import { severityColors } from '../constants/severityColors';
import { SeverityLevel } from '../types/enums';

export function getSeverityColor(level: SeverityLevel) {
  return severityColors[level] ?? '#4b5563';
}
