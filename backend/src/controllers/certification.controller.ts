import { Body, Controller, Get, Param, Patch, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { certificationRoutes } from '../routes/certification.routes';
import { CertificationService } from '../services/certification.service';
import { CertStatus, UserRole } from '../types/enums';
import { RequestWithUser } from '../types/interfaces';
import { assertRole } from '../middlewares/rbac.middleware';
import { uploadMulterOptions } from '../middlewares/upload.middleware';
import { toPublicUploadUrl } from '../utils/fileUpload';
import { ok } from '../utils/response';

@Controller(certificationRoutes.base)
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Get()
  async list(@Query('status') status?: CertStatus) {
    return ok(await this.certificationService.list(status));
  }

  @Get(certificationRoutes.expiring)
  async expiring(@Query('days') days?: string) {
    return ok(await this.certificationService.expiring(Number(days ?? 30)));
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return ok(await this.certificationService.getById(Number(id)));
  }

  @Post()
  @UseInterceptors(FileInterceptor('photo', uploadMulterOptions))
  async submit(
    @Body() body: Record<string, unknown>,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() req: RequestWithUser,
  ) {
    req.auditAction = '资质提交';
    return ok(
      await this.certificationService.submit({
        ...body,
        photoUrl: file ? toPublicUploadUrl(file.filename) : (body.photoUrl as string | undefined),
      }),
      '资质已提交',
    );
  }

  @Patch(certificationRoutes.review)
  async review(
    @Param('id') id: string,
    @Body() body: { auditStatus: CertStatus; auditComment?: string },
    @Req() req: RequestWithUser,
  ) {
    assertRole(req, UserRole.Admin, UserRole.SafetyManager);
    req.auditAction = '资质审核';
    return ok(await this.certificationService.review(Number(id), body.auditStatus, body.auditComment));
  }

  @Patch(certificationRoutes.renew)
  async renew(@Param('id') id: string, @Body() body: { validUntil: string; photoUrl?: string }, @Req() req: RequestWithUser) {
    req.auditAction = '资质续期';
    return ok(await this.certificationService.renew(Number(id), body.validUntil, body.photoUrl));
  }
}
