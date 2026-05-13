import { Injectable, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { supabaseAdminClient } from 'src/singletons/supabase/supabase.client';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File, folder = 'uploads') {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const ext = file.originalname.split('.').pop();
    const fileName = `${folder}/${randomUUID()}.${ext}`;
    const { error } = await supabaseAdminClient.storage
      .from('uploads')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });
    if (error) {
      throw new BadRequestException(error.message);
    }

    const {
      data: { publicUrl },
    } = supabaseAdminClient.storage.from('uploads').getPublicUrl(fileName);
    return {
      fileId: fileName,
      fileUrl: publicUrl,
    };
  }

  async deleteFiles(fileIds: string[]) {
    if (!fileIds.length) {
      throw new BadRequestException('no fileIds passed');
    }

    const { data, error } = await supabaseAdminClient.storage
      .from('uploads')
      .remove(fileIds);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      success: true,
      deleted: data,
    };
  }
}
