import { SeverityLevel } from '../types/enums';

export const severityColors: Record<SeverityLevel, string> = {
  [SeverityLevel.NearMiss]: '#2f7d32',
  [SeverityLevel.Minor]: '#5f7f24',
  [SeverityLevel.Moderate]: '#b7791f',
  [SeverityLevel.Major]: '#b54708',
  [SeverityLevel.Fatal]: '#9f1239',
};

export const severityLabels: Record<SeverityLevel, string> = {
  [SeverityLevel.NearMiss]: '未遂',
  [SeverityLevel.Minor]: '轻微',
  [SeverityLevel.Moderate]: '中等',
  [SeverityLevel.Major]: '重大',
  [SeverityLevel.Fatal]: '致命',
};
