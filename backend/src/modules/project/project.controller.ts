import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CRUDController } from 'src/types/controllers.types';
import { ProjectService } from './project.service';
import {
  CreateProjectDTO,
  QueryProjectDTO,
  UpdateProjectDTO,
} from './dto/project.dto';
import { ActiveUser } from '../auth/auth.decorators';
import { User } from '../user/user.entity';
import { SupabaseAuthGuard } from '../auth/guards/supabase.guard';

@Controller('projects')
export class ProjectController implements CRUDController {
  constructor(private readonly service: ProjectService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard)
  async create(@Body() body: CreateProjectDTO, @ActiveUser() user: User) {
    return this.service.create(body, user);
  }

  @Patch(':id')
  @UseGuards(SupabaseAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProjectDTO,
  ) {
    return this.service.update(id, body);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Get()
  async getAll(@Query() query: QueryProjectDTO) {
    return this.service.findAll(query);
  }
}
