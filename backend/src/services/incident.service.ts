import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { SafetyIncident } from '../models/incident.entity';
import { IncidentStatus, SeverityLevel } from '../types/enums';

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(SafetyIncident)
    private readonly incidentRepository: Repository<SafetyIncident>,
  ) {}

  async list(query: {
    severity?: SeverityLevel;
    status?: IncidentStatus;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = Number(query.page ?? 1);
    const pageSize = Number(query.pageSize ?? 20);
    const where: FindOptionsWhere<SafetyIncident> = {};

    if (query.severity) where.severity = query.severity;
    if (query.status) where.status = query.status;
    if (query.startDate && query.endDate) {
      where.occurredAt = Between(new Date(query.startDate), new Date(query.endDate));
    }

    const [items, total] = await this.incidentRepository.findAndCount({
      where,
      order: { occurredAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { items, total, page, pageSize };
  }

  async getById(id: number) {
    const incident = await this.incidentRepository.findOne({ where: { id } });
    if (!incident) throw new NotFoundException('安全事件不存在');
    return incident;
  }

  async report(payload: Partial<SafetyIncident>) {
    const incident = this.incidentRepository.create({
      ...payload,
      occurredAt: payload.occurredAt ? new Date(payload.occurredAt) : new Date(),
      involvedWorkerIds: payload.involvedWorkerIds ?? [],
      photoUrls: payload.photoUrls ?? [],
      status: IncidentStatus.Reported,
      reporterId: payload.reporterId ?? 1,
      timeline: [
        {
          at: new Date().toISOString(),
          label: '事件已上报',
          actorId: payload.reporterId ?? 1,
          note: payload.description,
        },
      ],
    });
    return this.incidentRepository.save(incident);
  }

  async assignInvestigation(id: number, investigatorId: number, note?: string) {
    const incident = await this.getById(id);
    incident.status = IncidentStatus.Investigating;
    incident.timeline = [
      ...(incident.timeline ?? []),
      {
        at: new Date().toISOString(),
        label: `已指派调查人 #${investigatorId}`,
        actorId: investigatorId,
        note,
      },
    ];
    return this.incidentRepository.save(incident);
  }

  async submitCorrectiveAction(
    id: number,
    correctiveAction: string,
    correctiveDeadline: string,
    actorId: number,
  ) {
    const incident = await this.getById(id);
    incident.status = IncidentStatus.Resolved;
    incident.correctiveAction = correctiveAction;
    incident.correctiveDeadline = correctiveDeadline;
    incident.timeline = [
      ...(incident.timeline ?? []),
      {
        at: new Date().toISOString(),
        label: '已提交整改',
        actorId,
        note: correctiveAction,
      },
    ];
    return this.incidentRepository.save(incident);
  }

  async close(id: number, actorId: number, note?: string) {
    const incident = await this.getById(id);
    incident.status = IncidentStatus.Closed;
    incident.timeline = [
      ...(incident.timeline ?? []),
      {
        at: new Date().toISOString(),
        label: '事件已关闭',
        actorId,
        note,
      },
    ];
    return this.incidentRepository.save(incident);
  }

  async dashboardStats() {
    const incidents = await this.incidentRepository.find({
      order: { occurredAt: 'ASC' },
      take: 200,
    });
    const severityDistribution = Object.values(SeverityLevel).map((severity) => ({
      severity,
      count: incidents.filter((incident) => incident.severity === severity).length,
    }));
    const statusCounts = Object.values(IncidentStatus).map((status) => ({
      status,
      count: incidents.filter((incident) => incident.status === status).length,
    }));
    return {
      total: incidents.length,
      severityDistribution,
      statusCounts,
      pendingCorrectives: incidents
        .filter((incident) => incident.status !== IncidentStatus.Closed)
        .slice(0, 6),
      trend: incidents.slice(-30).map((incident) => ({
        date: incident.occurredAt.toISOString().slice(0, 10),
        count: 1,
      })),
    };
  }
}
