export enum SeverityLevel {
  NearMiss = 'NearMiss',
  Minor = 'Minor',
  Moderate = 'Moderate',
  Major = 'Major',
  Fatal = 'Fatal',
}

export enum IncidentStatus {
  Reported = 'Reported',
  Investigating = 'Investigating',
  Resolved = 'Resolved',
  Closed = 'Closed',
}

export enum IncidentCategory {
  Fall = 'Fall',
  ElectricShock = 'ElectricShock',
  StruckByObject = 'StruckByObject',
  Collapse = 'Collapse',
  MechanicalInjury = 'MechanicalInjury',
  Other = 'Other',
}

export enum InspectionType {
  Routine = 'Routine',
  Special = 'Special',
  PreShift = 'PreShift',
  Emergency = 'Emergency',
}

export enum InspectionStatus {
  Scheduled = 'Scheduled',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Failed = 'Failed',
}

export enum TrainingType {
  Induction = 'Induction',
  Regular = 'Regular',
  Special = 'Special',
  Emergency = 'Emergency',
}

export enum AssessmentMethod {
  Written = 'Written',
  Practical = 'Practical',
  Oral = 'Oral',
}

export enum CertStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Expired = 'Expired',
}

export enum CertificationType {
  SpecialOperation = 'SpecialOperation',
  SafetyOfficer = 'SafetyOfficer',
  Electrician = 'Electrician',
  Welder = 'Welder',
  HighAltitude = 'HighAltitude',
  CraneOperator = 'CraneOperator',
  Other = 'Other',
}

export enum UserRole {
  Admin = 'Admin',
  SafetyManager = 'SafetyManager',
  Inspector = 'Inspector',
  Worker = 'Worker',
}

export enum CertAnomalyType {
  NoCert = 'NoCert',
  Expired = 'Expired',
  ExpiringSoon = 'ExpiringSoon',
  NotApproved = 'NotApproved',
}

export enum ErrorCode {
  Unauthorized = 'UNAUTHORIZED',
  Forbidden = 'FORBIDDEN',
  NotFound = 'NOT_FOUND',
  ValidationFailed = 'VALIDATION_FAILED',
  UploadFailed = 'UPLOAD_FAILED',
  ServerError = 'SERVER_ERROR',
}
