import { FileInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common';

export const UploadFileInterceptor = FileInterceptor('file', {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file) return cb(new BadRequestException('No file'), false);

    cb(null, true);
  },
});
