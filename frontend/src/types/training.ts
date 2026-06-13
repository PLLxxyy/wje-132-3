import { AssessmentMethod, CertAnomalyType, TrainingType } from './enums';

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

export interface SignInResult {
  training: SafetyTraining;
  certCheck: CertStatusCheckResult;
}

export interface SafetyTraining {
  id: number;
  topic: string;
  type: TrainingType;
  trainingDate: string;
  durationHours: number;
  instructor: string;
  location: string;
  summary: string;
  participantIds: number[];
  signedInIds: number[];
  scores: Record<string, number> | null;
  assessmentMethod: AssessmentMethod;
  passRate: number;
  signInAnomalies: SignInAnomaly[] | null;
}
