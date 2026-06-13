import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { NextFunction, Response } from 'express';
import { DataSource } from 'typeorm';
import { AuditLog } from '../models/auditLog.entity';
import { RequestWithUser } from '../types/interfaces';
import { logger } from '../utils/logger';

@Injectable()
export class AuditLogMiddleware implements NestMiddleware {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  use(req: RequestWithUser, res: Response, next: NextFunction) {
    const startedAt = Date.now();

    res.on('finish', async () => {
      if (req.method === 'GET' || req.path === '/api/health') {
        return;
      }

      try {
        await this.dataSource.getRepository(AuditLog).save({
          userId: req.user?.id ?? null,
          userRole: req.user?.role ?? 'Anonymous',
          action: req.auditAction ?? `${req.method} ${req.path}`,
          resource: req.path.split('/')[2] ?? 'unknown',
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          metadata: {
            durationMs: Date.now() - startedAt,
            ip: req.ip,
          },
        });
      } catch (error) {
        logger.warn('写入审计日志失败', error);
      }
    });

    next();
  }
}
