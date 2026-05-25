import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
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

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @UseGuards(SupabaseAuthGuard)
  async create(@Body() body: CreateProjectDTO, @ActiveUser() user?: User) {
    if (!user) throw new UnauthorizedException();
    return this.service.create(body, user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  @UseGuards(SupabaseAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProjectDTO,
    @ActiveUser() user?: User,
  ) {
    if (!user) throw new UnauthorizedException();
    return this.service.update(id, body, user);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Get()
  async getAll(@Query() query: QueryProjectDTO) {
    return this.service.findAll(query);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user?: User,
  ) {
    if (!user) throw new UnauthorizedException();
    return this.service.deleteRecord(id, user);
  }
}
