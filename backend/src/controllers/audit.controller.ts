import { Controller, Get } from '@nestjs/common';
import { AuditService } from '../services/audit.service';
import { ok } from '../utils/response';

@Controller('api/audit-logs')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async list() {
    return ok(await this.auditService.list());
  }
}
