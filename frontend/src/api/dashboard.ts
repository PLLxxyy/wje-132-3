import { apiPaths } from '../constants/apiPaths';
import type { SafetyIncident } from '../types';
import { request, unwrap } from '../utils/request';

export interface DashboardSummary {
  incidents: {
    total: number;
    severityDistribution: Array<{ severity: string; count: number }>;
    statusCounts: Array<{ status: string; count: number }>;
    pendingCorrectives: SafetyIncident[];
    trend: Array<{ date: string; count: number }>;
  };
  inspectionSummary: {
    total: number;
    failed: number;
    averageScore: number;
  };
  trainingCompletionRate: number;
}

export const dashboardApi = {
  summary: () => unwrap<DashboardSummary>(request.get(apiPaths.dashboard)),
  auditLogs: () => unwrap<Array<Record<string, unknown>>>(request.get(apiPaths.auditLogs)),
};
