import { Badge, Tag } from 'antd';
import {
  CertStatus,
  IncidentStatus,
  InspectionStatus,
} from '../../types/enums';

type StatusValue = IncidentStatus | InspectionStatus | CertStatus | string;

const statusMap: Record<string, { color: string; label: string; badge: 'success' | 'processing' | 'warning' | 'error' | 'default' }> = {
  [IncidentStatus.Reported]: { color: 'orange', label: '已上报', badge: 'warning' },
  [IncidentStatus.Investigating]: { color: 'blue', label: '调查中', badge: 'processing' },
  [IncidentStatus.Resolved]: { color: 'green', label: '已整改', badge: 'success' },
  [IncidentStatus.Closed]: { color: 'default', label: '已关闭', badge: 'default' },
  [InspectionStatus.Scheduled]: { color: 'default', label: '已计划', badge: 'default' },
  [InspectionStatus.InProgress]: { color: 'blue', label: '执行中', badge: 'processing' },
  [InspectionStatus.Completed]: { color: 'green', label: '合格', badge: 'success' },
  [InspectionStatus.Failed]: { color: 'red', label: '未通过', badge: 'error' },
  [CertStatus.Pending]: { color: 'gold', label: '待审核', badge: 'warning' },
  [CertStatus.Approved]: { color: 'green', label: '已通过', badge: 'success' },
  [CertStatus.Rejected]: { color: 'red', label: '已驳回', badge: 'error' },
  [CertStatus.Expired]: { color: 'volcano', label: '已过期', badge: 'error' },
};

export function StatusBadge({ status, compact = false }: { status: StatusValue; compact?: boolean }) {
  const item = statusMap[String(status)] ?? { color: 'default', label: String(status), badge: 'default' as const };
  if (compact) return <Badge status={item.badge} text={item.label} />;
  return <Tag color={item.color}>{item.label}</Tag>;
}
