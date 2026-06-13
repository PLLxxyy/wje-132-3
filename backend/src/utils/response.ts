import { ApiResponse, PaginatedResult } from '../types/interfaces';

export const ok = <T>(data: T, message = 'success'): ApiResponse<T> => ({
  code: 0,
  message,
  data,
});

export const warning = <T>(data: T, message = 'warning'): ApiResponse<T> => ({
  code: 1,
  message,
  data,
});

export const page = <T>(
  items: T[],
  total: number,
  pageNumber: number,
  pageSize: number,
): ApiResponse<PaginatedResult<T>> =>
  ok({
    items,
    total,
    page: pageNumber,
    pageSize: pageSize,
  });
