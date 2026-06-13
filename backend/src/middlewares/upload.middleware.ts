import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import multer = require('multer');
import * as path from 'node:path';
import { v4 as uuid } from 'uuid';
import { uploadConfig } from '../config/upload.config';
import { ensureUploadDir } from '../utils/fileUpload';

ensureUploadDir();

export const uploadMulterOptions: MulterOptions = {
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadConfig.uploadDir),
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname);
      callback(null, `${uuid()}${extension}`);
    },
  }),
  limits: {
    fileSize: uploadConfig.maxFileSizeBytes,
  },
  fileFilter: (_req, file, callback) => {
    if (uploadConfig.allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
      return;
    }
    callback(new Error('仅支持 JPG、PNG、WebP 图片'), false);
  },
};

export const uploadMiddleware = multer(uploadMulterOptions as multer.Options);
