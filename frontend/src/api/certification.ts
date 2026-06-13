import { apiPaths } from '../constants/apiPaths';
import type { WorkerCertification } from '../types';
import { CertStatus } from '../types/enums';
import { request, unwrap } from '../utils/request';

export const certificationApi = {
  list: (status?: CertStatus) =>
    unwrap<WorkerCertification[]>(request.get(apiPaths.certifications.base, { params: { status } })),
  detail: (id: number) =>
    unwrap<WorkerCertification>(request.get(`${apiPaths.certifications.base}/${id}`)),
  submit: (payload: Partial<WorkerCertification> | FormData) =>
    unwrap<WorkerCertification>(
      request.post(apiPaths.certifications.base, payload, {
        headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      }),
    ),
  review: (id: number, auditStatus: CertStatus, auditComment?: string) =>
    unwrap<WorkerCertification>(
      request.patch(apiPaths.certifications.review(id), { auditStatus, auditComment }),
    ),
  renew: (id: number, validUntil: string, photoUrl?: string) =>
    unwrap<WorkerCertification>(request.patch(apiPaths.certifications.renew(id), { validUntil, photoUrl })),
  expiring: (days = 30) =>
    unwrap<WorkerCertification[]>(request.get(apiPaths.certifications.expiring, { params: { days } })),
};
