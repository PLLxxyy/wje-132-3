import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs = require('dayjs');
import { Repository } from 'typeorm';
import { WorkerCertification } from '../models/certification.entity';
import { SafetyTraining } from '../models/training.entity';
import { CertAnomalyType, CertStatus } from '../types/enums';
import type { CertStatusCheckResult, SignInAnomaly } from '../types/interfaces';

@Injectable()
export class CertificationService {
  constructor(
    @InjectRepository(WorkerCertification)
    private readonly certificationRepository: Repository<WorkerCertification>,
    @InjectRepository(SafetyTraining)
    private readonly trainingRepository: Repository<SafetyTraining>,
  ) {}

  async list(status?: CertStatus) {
    return this.certificationRepository.find({
      where: status ? { auditStatus: status } : {},
      order: { validUntil: 'ASC' },
    });
  }

  async getById(id: number) {
    const certification = await this.certificationRepository.findOne({ where: { id } });
    if (!certification) throw new NotFoundException('人员资质不存在');
    return certification;
  }

  async submit(payload: Partial<WorkerCertification>) {
    return this.certificationRepository.save(
      this.certificationRepository.create({
        ...payload,
        auditStatus: CertStatus.Pending,
      }),
    );
  }

  async review(id: number, auditStatus: CertStatus, auditComment?: string) {
    const certification = await this.getById(id);
    certification.auditStatus = auditStatus;
    certification.auditComment = auditComment ?? null;
    return this.certificationRepository.save(certification);
  }

  async renew(id: number, validUntil: string, photoUrl?: string) {
    const certification = await this.getById(id);
    certification.validUntil = validUntil;
    certification.photoUrl = photoUrl ?? certification.photoUrl;
    certification.auditStatus = CertStatus.Pending;
    return this.certificationRepository.save(certification);
  }

  async expiring(days = 30) {
    const certifications = await this.certificationRepository.find();
    const today = dayjs();
    return certifications.filter((certification) => {
      const diff = dayjs(certification.validUntil).diff(today, 'day');
      return diff >= 0 && diff <= days;
    });
  }

  async checkWorkerCertStatus(workerId: number, trainingId: number, warningDays = 30): Promise<CertStatusCheckResult> {
    const certifications = await this.certificationRepository.find({
      where: { workerId },
    });

    const today = dayjs();
    const anomalies: SignInAnomaly[] = [];
    const certDetails: CertStatusCheckResult['certifications'] = [];

    for (const cert of certifications) {
      const daysRemaining = dayjs(cert.validUntil).diff(today, 'day');
      certDetails.push({
        id: cert.id,
        type: cert.certificationType,
        validUntil: cert.validUntil,
        auditStatus: cert.auditStatus,
        daysRemaining,
      });

      if (cert.auditStatus !== CertStatus.Approved) {
        anomalies.push({
          workerId,
          trainingId,
          anomalyType: CertAnomalyType.NotApproved,
          message: `资质【${cert.certificationType}】未通过审核，当前状态：${cert.auditStatus}`,
          detectedAt: today.format('YYYY-MM-DD HH:mm:ss'),
          certId: cert.id,
          certType: cert.certificationType,
          validUntil: cert.validUntil,
          daysRemaining,
        });
      } else if (daysRemaining < 0) {
        anomalies.push({
          workerId,
          trainingId,
          anomalyType: CertAnomalyType.Expired,
          message: `资质【${cert.certificationType}】已过期 ${Math.abs(daysRemaining)} 天`,
          detectedAt: today.format('YYYY-MM-DD HH:mm:ss'),
          certId: cert.id,
          certType: cert.certificationType,
          validUntil: cert.validUntil,
          daysRemaining,
        });
      } else if (daysRemaining <= warningDays) {
        anomalies.push({
          workerId,
          trainingId,
          anomalyType: CertAnomalyType.ExpiringSoon,
          message: `资质【${cert.certificationType}】将在 ${daysRemaining} 天后过期`,
          detectedAt: today.format('YYYY-MM-DD HH:mm:ss'),
          certId: cert.id,
          certType: cert.certificationType,
          validUntil: cert.validUntil,
          daysRemaining,
        });
      }
    }

    if (certifications.length === 0) {
      anomalies.push({
        workerId,
        trainingId,
        anomalyType: CertAnomalyType.NoCert,
        message: '未查询到任何有效资质信息',
        detectedAt: today.format('YYYY-MM-DD HH:mm:ss'),
      });
    }

    const hasValidCert = certDetails.some(
      (c) => c.auditStatus === CertStatus.Approved && c.daysRemaining >= 0,
    );

    return {
      hasValidCert,
      anomalies,
      certifications: certDetails,
    };
  }

  async getWorkerSignInAnomalies(workerId: number): Promise<SignInAnomaly[]> {
    const certifications = await this.certificationRepository.find({ where: { workerId } });
    const certIds = certifications.map((c) => c.id);

    const trainings = await this.trainingRepository.find();
    const allAnomalies: SignInAnomaly[] = [];

    for (const training of trainings) {
      if (training.signInAnomalies) {
        const workerAnomalies = training.signInAnomalies.filter(
          (a) => a.workerId === workerId || (a.certId && certIds.includes(a.certId)),
        );
        allAnomalies.push(...workerAnomalies);
      }
    }

    return allAnomalies.sort((a, b) => dayjs(b.detectedAt).valueOf() - dayjs(a.detectedAt).valueOf());
  }
}
