import { Injectable } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { InspectionService } from './inspection.service';
import { TrainingService } from './training.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly incidentService: IncidentService,
    private readonly inspectionService: InspectionService,
    private readonly trainingService: TrainingService,
  ) {}

  async summary() {
    const [incidents, inspections, trainingCompletionRate] = await Promise.all([
      this.incidentService.dashboardStats(),
      this.inspectionService.list(),
      this.trainingService.monthlyCompletionRate(),
    ]);

    return {
      incidents,
      inspectionSummary: {
        total: inspections.length,
        failed: inspections.filter((inspection) => inspection.hazardCount > 0).length,
        averageScore: inspections.length
          ? Math.round(inspections.reduce((sum, item) => sum + item.totalScore, 0) / inspections.length)
          : 0,
      },
      trainingCompletionRate,
    };
  }
}
