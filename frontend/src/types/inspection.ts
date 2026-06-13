import { InspectionStatus, InspectionType } from './enums';

export interface InspectionItem {
  id?: number;
  name: string;
  passed: boolean;
  remark?: string | null;
  photoUrls: string[];
}

export interface SafetyInspection {
  id: number;
  name: string;
  type: InspectionType;
  area: string;
  inspectionDate: string;
  inspectorId: number;
  totalScore: number;
  status: InspectionStatus;
  hazardCount: number;
  passedCount: number;
  items: InspectionItem[];
}
