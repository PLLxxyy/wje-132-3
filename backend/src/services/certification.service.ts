import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs = require('dayjs');
import { Repository } from 'typeorm';
import { WorkerCertification } from '../models/certification.entity';
import { CertStatus } from '../types/enums';

@Injectable()
export class CertificationService {
  constructor(
    @InjectRepository(WorkerCertification)
    private readonly certificationRepository: Repository<WorkerCertification>,
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
}
