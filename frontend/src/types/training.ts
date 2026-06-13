import { AssessmentMethod, TrainingType } from './enums';

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
}
