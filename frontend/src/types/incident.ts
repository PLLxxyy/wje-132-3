import { IncidentCategory, IncidentStatus, SeverityLevel } from './enums';

export interface SafetyIncident {
  id: number;
  title: string;
  description: string;
  occurredAt: string;
  site: string;
  area: string;
  severity: SeverityLevel;
  category: IncidentCategory;
  involvedWorkerIds: number[];
  photoUrls: string[];
  status: IncidentStatus;
  correctiveAction: string | null;
  correctiveDeadline: string | null;
  reporterId: number;
  timeline: Array<{ at: string; label: string; actorId?: number; note?: string }> | null;
}

export interface IncidentQuery {
  severity?: SeverityLevel;
  status?: IncidentStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}
