import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadMulterOptions } from '../middlewares/upload.middleware';
import { toPublicUploadUrl } from '../utils/fileUpload';
import { ok } from '../utils/response';

@Controller('api/uploads')
export class UploadController {
  @Post('image')
  @UseInterceptors(FileInterceptor('file', uploadMulterOptions))
  async image(@UploadedFile() file: Express.Multer.File) {
    return ok({ url: toPublicUploadUrl(file.filename) });
  }
}
