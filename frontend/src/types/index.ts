export * from './certification';
export * from './enums';
export * from './incident';
export * from './inspection';
export * from './roles';
export * from './training';

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
