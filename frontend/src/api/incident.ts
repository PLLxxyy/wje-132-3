import { apiPaths } from '../constants/apiPaths';
import type { IncidentQuery, PaginatedResult, SafetyIncident } from '../types';
import { request, unwrap } from '../utils/request';

export const incidentApi = {
  list: (query: IncidentQuery = {}) =>
    unwrap<PaginatedResult<SafetyIncident>>(request.get(apiPaths.incidents.base, { params: query })),
  detail: (id: number) => unwrap<SafetyIncident>(request.get(apiPaths.incidents.detail(id))),
  report: (payload: Partial<SafetyIncident> | FormData) =>
    unwrap<SafetyIncident>(
      request.post(apiPaths.incidents.base, payload, {
        headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      }),
    ),
  assign: (id: number, investigatorId: number, note?: string) =>
    unwrap<SafetyIncident>(request.patch(apiPaths.incidents.assign(id), { investigatorId, note })),
  corrective: (id: number, correctiveAction: string, correctiveDeadline: string) =>
    unwrap<SafetyIncident>(
      request.patch(apiPaths.incidents.corrective(id), { correctiveAction, correctiveDeadline }),
    ),
  close: (id: number, note?: string) =>
    unwrap<SafetyIncident>(request.patch(apiPaths.incidents.close(id), { note })),
};
