import { CertificationType, CertStatus } from './enums';

export interface WorkerCertification {
  id: number;
  workerId: number;
  certificationType: CertificationType;
  certificateNo: string;
  issuingAuthority: string;
  issuedAt: string;
  validUntil: string;
  photoUrl: string | null;
  auditStatus: CertStatus;
  auditComment: string | null;
}
