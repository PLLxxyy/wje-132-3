import type { Request } from 'express';
import { CertAnomalyType, UserRole } from './enums';

export interface AuthUser {
  id: number;
  name: string;
  role: UserRole;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface RequestWithUser extends Request {
  user?: AuthUser;
  auditAction?: string;
  files?: Express.Multer.File[];
  file?: Express.Multer.File;
}

export interface SignInAnomaly {
  workerId: number;
  trainingId: number;
  anomalyType: CertAnomalyType;
  message: string;
  detectedAt: string;
  certId?: number;
  certType?: string;
  validUntil?: string;
  daysRemaining?: number;
}

export interface CertStatusCheckResult {
  hasValidCert: boolean;
  anomalies: SignInAnomaly[];
  certifications: Array<{
    id: number;
    type: string;
    validUntil: string;
    auditStatus: string;
    daysRemaining: number;
  }>;
}
