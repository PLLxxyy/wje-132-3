import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');
import { Repository } from 'typeorm';
import { jwtConfig } from '../config/jwt.config';
import { User } from '../models/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('账号或密码错误');
    const matched = await bcrypt.compare(password, user.passwordHash);
    if (!matched) throw new UnauthorizedException('账号或密码错误');
    const payload = { id: user.id, name: user.name, role: user.roleName };
    return {
      token: jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn }),
      user: payload,
    };
  }
}
