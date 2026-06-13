import { Body, Controller, Get, Param, Patch, Post, Query, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { incidentRoutes } from '../routes/incident.routes';
import { IncidentService } from '../services/incident.service';
import { IncidentStatus, SeverityLevel, UserRole } from '../types/enums';
import { RequestWithUser } from '../types/interfaces';
import { toPublicUploadUrl } from '../utils/fileUpload';
import { page, ok } from '../utils/response';
import { uploadMulterOptions } from '../middlewares/upload.middleware';
import { assertRole } from '../middlewares/rbac.middleware';

@Controller(incidentRoutes.base)
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Get()
  async list(
    @Query('severity') severity?: SeverityLevel,
    @Query('status') status?: IncidentStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') currentPage?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const result = await this.incidentService.list({
      severity,
      status,
      startDate,
      endDate,
      page: Number(currentPage ?? 1),
      pageSize: Number(pageSize ?? 20),
    });
    return page(result.items, result.total, result.page, result.pageSize);
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return ok(await this.incidentService.getById(Number(id)));
  }

  @Post()
  @UseInterceptors(FilesInterceptor('photos', 6, uploadMulterOptions))
  async report(
    @Body() body: Record<string, unknown>,
    @UploadedFiles() files: Express.Multer.File[] = [],
    @Req() req: RequestWithUser,
  ) {
    req.auditAction = '事件上报';
    const photoUrls = [
      ...this.readJsonArray<string>(body.photoUrls),
      ...files.map((file) => toPublicUploadUrl(file.filename)),
    ];
    return ok(
      await this.incidentService.report({
        ...body,
        involvedWorkerIds: this.readJsonArray<number>(body.involvedWorkerIds),
        photoUrls,
        reporterId: req.user?.id ?? Number(body.reporterId ?? 1),
      }),
      '事件已上报',
    );
  }

  @Patch(incidentRoutes.assign)
  async assign(@Param('id') id: string, @Body() body: { investigatorId: number; note?: string }, @Req() req: RequestWithUser) {
    assertRole(req, UserRole.Admin, UserRole.SafetyManager);
    req.auditAction = '事件调查指派';
    return ok(await this.incidentService.assignInvestigation(Number(id), body.investigatorId, body.note));
  }

  @Patch(incidentRoutes.corrective)
  async corrective(
    @Param('id') id: string,
    @Body() body: { correctiveAction: string; correctiveDeadline: string },
    @Req() req: RequestWithUser,
  ) {
    req.auditAction = '事件整改提交';
    return ok(
      await this.incidentService.submitCorrectiveAction(
        Number(id),
        body.correctiveAction,
        body.correctiveDeadline,
        req.user?.id ?? 1,
      ),
    );
  }

  @Patch(incidentRoutes.close)
  async close(@Param('id') id: string, @Body() body: { note?: string }, @Req() req: RequestWithUser) {
    assertRole(req, UserRole.Admin, UserRole.SafetyManager);
    req.auditAction = '事件关闭';
    return ok(await this.incidentService.close(Number(id), req.user?.id ?? 1, body.note));
  }

  private readJsonArray<T>(value: unknown): T[] {
    if (Array.isArray(value)) return value as T[];
    if (typeof value !== 'string' || value.length === 0) return [];
    try {
      return JSON.parse(value) as T[];
    } catch {
      return [];
    }
  }
}
