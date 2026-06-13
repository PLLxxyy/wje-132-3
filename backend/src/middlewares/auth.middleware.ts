import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import jwt = require('jsonwebtoken');
import { jwtConfig } from '../config/jwt.config';
import { AuthUser, RequestWithUser } from '../types/interfaces';
import { UserRole } from '../types/enums';

const publicPaths = ['/api/health', '/api/auth/login', '/uploads'];

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: RequestWithUser, _res: Response, next: NextFunction) {
    if (publicPaths.some((path) => req.path.startsWith(path))) {
      next();
      return;
    }

    const authorization = req.headers.authorization;
    if (!authorization) {
      req.user = {
        id: 1,
        name: '演示安全经理',
        role: (req.headers['x-user-role'] as UserRole) || UserRole.SafetyManager,
      };
      next();
      return;
    }

    const [, token] = authorization.split(' ');
    if (!token) {
      throw new UnauthorizedException('缺少访问令牌');
    }

    try {
      req.user = jwt.verify(token, jwtConfig.secret) as AuthUser;
      next();
    } catch {
      throw new UnauthorizedException('访问令牌无效或已过期');
    }
  }
}
