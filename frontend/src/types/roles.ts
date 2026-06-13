import { UserRole } from './enums';

export interface CurrentUser {
  id: number;
  name: string;
  role: UserRole;
}

export const roleLabels: Record<UserRole, string> = {
  [UserRole.Admin]: '系统管理员',
  [UserRole.SafetyManager]: '安全管理员',
  [UserRole.Inspector]: '巡检人员',
  [UserRole.Worker]: '施工人员',
};

export const canReviewCertification = (role: UserRole) =>
  role === UserRole.Admin || role === UserRole.SafetyManager;

export const canCloseIncident = (role: UserRole) =>
  role === UserRole.Admin || role === UserRole.SafetyManager;
