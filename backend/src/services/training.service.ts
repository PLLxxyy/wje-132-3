import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SafetyTraining } from '../models/training.entity';
import { CertificationService } from './certification.service';
import type { CertStatusCheckResult, SignInAnomaly } from '../types/interfaces';

@Injectable()
export class TrainingService {
  constructor(
    @InjectRepository(SafetyTraining)
    private readonly trainingRepository: Repository<SafetyTraining>,
    private readonly certificationService: CertificationService,
  ) {}

  async list() {
    return this.trainingRepository.find({ order: { trainingDate: 'DESC' } });
  }

  async getById(id: number) {
    const training = await this.trainingRepository.findOne({ where: { id } });
    if (!training) throw new NotFoundException('安全培训不存在');
    return training;
  }

  async create(payload: Partial<SafetyTraining>) {
    return this.trainingRepository.save(
      this.trainingRepository.create({
        ...payload,
        participantIds: payload.participantIds ?? [],
        signedInIds: payload.signedInIds ?? [],
        scores: payload.scores ?? {},
        passRate: payload.passRate ?? 0,
        signInAnomalies: payload.signInAnomalies ?? [],
      }),
    );
  }

  async signIn(id: number, workerId: number): Promise<{ training: SafetyTraining; certCheck: CertStatusCheckResult }> {
    const training = await this.getById(id);
    const certCheck = await this.certificationService.checkWorkerCertStatus(workerId, id);

    if (certCheck.anomalies.length > 0) {
      training.signInAnomalies = [...(training.signInAnomalies ?? []), ...certCheck.anomalies];
    }

    training.signedInIds = Array.from(new Set([...(training.signedInIds ?? []), workerId]));
    const savedTraining = await this.trainingRepository.save(training);

    return { training: savedTraining, certCheck };
  }

  async getSignInAnomalies(trainingId?: number): Promise<SignInAnomaly[]> {
    if (trainingId) {
      const training = await this.getById(trainingId);
      return training.signInAnomalies ?? [];
    }
    const trainings = await this.list();
    const allAnomalies: SignInAnomaly[] = [];
    for (const training of trainings) {
      if (training.signInAnomalies) {
        allAnomalies.push(...training.signInAnomalies);
      }
    }
    return allAnomalies.sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
  }

  async recordScores(id: number, scores: Record<string, number>) {
    const training = await this.getById(id);
    training.scores = { ...(training.scores ?? {}), ...scores };
    const scoreValues = Object.values(training.scores);
    training.passRate = scoreValues.length
      ? Math.round((scoreValues.filter((score) => score >= 60).length / scoreValues.length) * 100)
      : 0;
    return this.trainingRepository.save(training);
  }

  async exportRecord(id: number) {
    const training = await this.getById(id);
    return {
      filename: `training-${id}.json`,
      content: training,
    };
  }

  async monthlyCompletionRate() {
    const trainings = await this.trainingRepository.find();
    if (!trainings.length) return 0;
    const completed = trainings.filter((training) => training.passRate >= 80).length;
    return Math.round((completed / trainings.length) * 100);
  }
}
