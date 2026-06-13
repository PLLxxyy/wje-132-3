import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { authRoutes } from '../routes/auth.routes';
import { AuthService } from '../services/auth.service';
import { RequestWithUser } from '../types/interfaces';
import { ok } from '../utils/response';

@Controller(authRoutes.base)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(authRoutes.login)
  async login(@Body() body: { email: string; password: string }) {
    return ok(await this.authService.login(body.email, body.password));
  }

  @Get(authRoutes.me)
  async me(@Req() req: RequestWithUser) {
    return ok(req.user);
  }
}
