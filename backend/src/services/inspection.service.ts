import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InspectionItem } from '../models/inspectionItem.entity';
import { SafetyInspection } from '../models/inspection.entity';
import { InspectionStatus } from '../types/enums';

@Injectable()
export class InspectionService {
  constructor(
    @InjectRepository(SafetyInspection)
    private readonly inspectionRepository: Repository<SafetyInspection>,
  ) {}

  async list() {
    return this.inspectionRepository.find({ order: { inspectionDate: 'DESC' } });
  }

  async getById(id: number) {
    const inspection = await this.inspectionRepository.findOne({ where: { id } });
    if (!inspection) throw new NotFoundException('安全检查不存在');
    return inspection;
  }

  async createPlan(payload: Partial<SafetyInspection>) {
    const items = (payload.items ?? []).map((item) =>
      Object.assign(new InspectionItem(), {
        name: item.name,
        passed: item.passed ?? false,
        remark: item.remark ?? null,
        photoUrls: item.photoUrls ?? [],
      }),
    );
    return this.inspectionRepository.save(
      this.inspectionRepository.create({
        ...payload,
        status: payload.status ?? InspectionStatus.Scheduled,
        totalScore: payload.totalScore ?? 0,
        hazardCount: payload.hazardCount ?? 0,
        passedCount: payload.passedCount ?? 0,
        items,
      }),
    );
  }

  async execute(id: number, items: InspectionItem[]) {
    const inspection = await this.getById(id);
    inspection.items = items.map((item) =>
      Object.assign(new InspectionItem(), {
        ...item,
        photoUrls: item.photoUrls ?? [],
      }),
    );
    inspection.passedCount = inspection.items.filter((item) => item.passed).length;
    inspection.hazardCount = inspection.items.length - inspection.passedCount;
    inspection.totalScore = inspection.items.length
      ? Math.round((inspection.passedCount / inspection.items.length) * 100)
      : 0;
    inspection.status = inspection.hazardCount > 0 ? InspectionStatus.Failed : InspectionStatus.Completed;
    return this.inspectionRepository.save(inspection);
  }

  async report(id: number) {
    const inspection = await this.getById(id);
    return {
      inspection,
      result: inspection.status,
      summary: `${inspection.area} 共检查 ${inspection.items.length} 项，合格 ${inspection.passedCount} 项，发现隐患 ${inspection.hazardCount} 项。`,
    };
  }
}
