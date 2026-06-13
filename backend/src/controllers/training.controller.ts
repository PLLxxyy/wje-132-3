import { Body, Controller, Get, Header, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { trainingRoutes } from '../routes/training.routes';
import { TrainingService } from '../services/training.service';
import { RequestWithUser } from '../types/interfaces';
import { ok } from '../utils/response';

@Controller(trainingRoutes.base)
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Get()
  async list() {
    return ok(await this.trainingService.list());
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return ok(await this.trainingService.getById(Number(id)));
  }

  @Post()
  async create(@Body() body: Record<string, unknown>, @Req() req: RequestWithUser) {
    req.auditAction = '培训创建';
    return ok(await this.trainingService.create(body), '培训已创建');
  }

  @Patch(trainingRoutes.signIn)
  async signIn(@Param('id') id: string, @Body('workerId') workerId: number, @Req() req: RequestWithUser) {
    req.auditAction = '培训签到';
    return ok(await this.trainingService.signIn(Number(id), workerId ?? req.user?.id ?? 1));
  }

  @Patch(trainingRoutes.scores)
  async scores(@Param('id') id: string, @Body('scores') scores: Record<string, number>, @Req() req: RequestWithUser) {
    req.auditAction = '培训成绩录入';
    return ok(await this.trainingService.recordScores(Number(id), scores ?? {}));
  }

  @Get(trainingRoutes.export)
  @Header('Content-Type', 'application/json; charset=utf-8')
  async export(@Param('id') id: string, @Res() res: Response) {
    const record = await this.trainingService.exportRecord(Number(id));
    res.setHeader('Content-Disposition', `attachment; filename="${record.filename}"`);
    res.end(JSON.stringify(record.content, null, 2));
  }
}
