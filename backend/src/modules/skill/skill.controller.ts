import { Controller, Get, Query } from '@nestjs/common';
import { CRUDController } from 'src/types/controllers.types';
import { SkillService } from './skill.service';
import { QuerySkillDTO } from './skill.dto';

@Controller('skills')
export class SkillController implements Pick<CRUDController, 'getAll'> {
  constructor(private readonly service: SkillService) {}
  @Get()
  async getAll(@Query() query: QuerySkillDTO) {
    return this.service.findAll(query);
  }
}
