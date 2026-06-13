import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SafetyTraining } from '../models/training.entity';

@Injectable()
export class TrainingService {
  constructor(
    @InjectRepository(SafetyTraining)
    private readonly trainingRepository: Repository<SafetyTraining>,
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
      }),
    );
  }

  async signIn(id: number, workerId: number) {
    const training = await this.getById(id);
    training.signedInIds = Array.from(new Set([...(training.signedInIds ?? []), workerId]));
    return this.trainingRepository.save(training);
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
