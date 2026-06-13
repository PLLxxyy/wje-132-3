import type { SignOptions } from 'jsonwebtoken';

export const jwtConfig: { secret: string; expiresIn: SignOptions['expiresIn'] } = {
  secret: process.env.JWT_SECRET ?? 'safety_platform_local_secret',
  expiresIn: '8h' as const,
};
