import { ForbiddenException } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UserRole } from '../types/enums';
import { RequestWithUser } from '../types/interfaces';

const roleRank: Record<UserRole, number> = {
  [UserRole.Worker]: 1,
  [UserRole.Inspector]: 2,
  [UserRole.SafetyManager]: 3,
  [UserRole.Admin]: 4,
};

export const rbacMiddleware =
  (...allowedRoles: UserRole[]) =>
  (req: RequestWithUser, _res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role) {
      throw new ForbiddenException('当前用户缺少角色信息');
    }
    if (!allowedRoles.includes(role)) {
      throw new ForbiddenException(`角色 ${role} 无权执行该操作`);
    }
    next();
  };

export const assertRole = (req: RequestWithUser, ...allowedRoles: UserRole[]) => {
  const role = req.user?.role;
  if (!role || !allowedRoles.includes(role)) {
    throw new ForbiddenException(`角色 ${role ?? 'Unknown'} 无权执行该操作`);
  }
};

export const requireAtLeastRole =
  (minimumRole: UserRole) => (req: RequestWithUser, _res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || roleRank[role] < roleRank[minimumRole]) {
      throw new ForbiddenException(`需要 ${minimumRole} 或更高权限`);
    }
    next();
  };
