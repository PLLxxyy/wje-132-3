import { apiPaths } from '../constants/apiPaths';
import type { InspectionItem, SafetyInspection } from '../types';
import { request, unwrap } from '../utils/request';

export const inspectionApi = {
  list: () => unwrap<SafetyInspection[]>(request.get(apiPaths.inspections.base)),
  detail: (id: number) => unwrap<SafetyInspection>(request.get(`${apiPaths.inspections.base}/${id}`)),
  create: (payload: Partial<SafetyInspection>) =>
    unwrap<SafetyInspection>(request.post(apiPaths.inspections.base, payload)),
  execute: (id: number, items: InspectionItem[]) =>
    unwrap<SafetyInspection>(request.patch(apiPaths.inspections.execute(id), { items })),
  report: (id: number) =>
    unwrap<{ inspection: SafetyInspection; result: string; summary: string }>(
      request.get(apiPaths.inspections.report(id)),
    ),
};
