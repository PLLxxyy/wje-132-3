import type { Request } from 'express';
import { UserRole } from './enums';

export interface AuthUser {
  id: number;
  name: string;
  role: UserRole;
}

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

export interface RequestWithUser extends Request {
  user?: AuthUser;
  auditAction?: string;
  files?: Express.Multer.File[];
  file?: Express.Multer.File;
}
