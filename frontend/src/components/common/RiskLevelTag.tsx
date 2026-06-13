import { Tag } from 'antd';
import { severityLabels } from '../../constants/severityColors';
import { SeverityLevel } from '../../types/enums';
import { getSeverityColor } from '../../utils/getSeverityColor';

export function RiskLevelTag({ level }: { level: SeverityLevel }) {
  return (
    <Tag color={getSeverityColor(level)} className="risk-level-tag">
      {severityLabels[level] ?? level}
    </Tag>
  );
}
