import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { inspectionRoutes } from '../routes/inspection.routes';
import { InspectionService } from '../services/inspection.service';
import { InspectionItem } from '../models/inspectionItem.entity';
import { RequestWithUser } from '../types/interfaces';
import { ok } from '../utils/response';

@Controller(inspectionRoutes.base)
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @Get()
  async list() {
    return ok(await this.inspectionService.list());
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return ok(await this.inspectionService.getById(Number(id)));
  }

  @Post()
  async create(@Body() body: Record<string, unknown>, @Req() req: RequestWithUser) {
    req.auditAction = '检查计划创建';
    return ok(await this.inspectionService.createPlan(body), '检查计划已创建');
  }

  @Patch(inspectionRoutes.execute)
  async execute(@Param('id') id: string, @Body('items') items: InspectionItem[], @Req() req: RequestWithUser) {
    req.auditAction = '检查结果提交';
    return ok(await this.inspectionService.execute(Number(id), items ?? []));
  }

  @Get(inspectionRoutes.report)
  async report(@Param('id') id: string) {
    return ok(await this.inspectionService.report(Number(id)));
  }
}
