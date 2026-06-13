import { apiPaths } from '../constants/apiPaths';
import type { SafetyTraining } from '../types';
import { request, unwrap } from '../utils/request';

export const trainingApi = {
  list: () => unwrap<SafetyTraining[]>(request.get(apiPaths.trainings.base)),
  detail: (id: number) => unwrap<SafetyTraining>(request.get(`${apiPaths.trainings.base}/${id}`)),
  create: (payload: Partial<SafetyTraining>) =>
    unwrap<SafetyTraining>(request.post(apiPaths.trainings.base, payload)),
  signIn: (id: number, workerId: number) =>
    unwrap<SafetyTraining>(request.patch(apiPaths.trainings.signIn(id), { workerId })),
  scores: (id: number, scores: Record<string, number>) =>
    unwrap<SafetyTraining>(request.patch(apiPaths.trainings.scores(id), { scores })),
  exportUrl: (id: number) => apiPaths.trainings.export(id),
};
