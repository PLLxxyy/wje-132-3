import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ErrorCode } from '../types/enums';
import { logger } from '../utils/logger';

export const normalizeError = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'getStatus' in error) {
    const httpError = error as { getStatus: () => number; message?: string };
    return {
      status: httpError.getStatus(),
      code: httpError.getStatus() === 403 ? ErrorCode.Forbidden : ErrorCode.ValidationFailed,
      message: httpError.message ?? '请求处理失败',
    };
  }

  logger.error('未处理异常', error);
  return {
    status: 500,
    code: ErrorCode.ServerError,
    message: '服务器异常，请稍后重试',
  };
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const normalized = normalizeError(exception);
    response.status(normalized.status).json({
      code: normalized.code,
      message: normalized.message,
      data: null,
    });
  }
}
