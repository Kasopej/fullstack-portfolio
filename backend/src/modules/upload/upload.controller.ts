import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadFileInterceptor } from './upload.interceptors';
import { UploadDto } from './upload.dto';

@Controller('file')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload')
  @UseInterceptors(UploadFileInterceptor)
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDto,
  ) {
    return this.uploadService.uploadFile(file, dto.folder);
  }

  @Post('delete')
  async delete(@Body() { fileIds }: { fileIds: string[] }) {
    return this.uploadService.deleteFiles(fileIds);
  }
}
