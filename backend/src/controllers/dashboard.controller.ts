import { Controller, Get } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { ok } from '../utils/response';

@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async summary() {
    return ok(await this.dashboardService.summary());
  }
}
