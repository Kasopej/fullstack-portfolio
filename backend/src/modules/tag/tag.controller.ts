import { Controller, Get, Query } from '@nestjs/common';
import { CRUDController } from 'src/types/controllers.types';
import { TagService } from './tag.service';
import { QueryTagDTO } from './tag.dto';

@Controller('tags')
export class TagController implements Pick<CRUDController, 'getAll'> {
  constructor(private readonly service: TagService) {}
  @Get()
  async getAll(@Query() query: QueryTagDTO) {
    return this.service.findAll(query);
  }
}
