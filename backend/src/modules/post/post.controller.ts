import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CRUDController } from 'src/types/controllers.types';
import { PostService } from './post.service';
import { CreatePostDTO, QueryPostDTO, UpdatePostDTO } from './post.dto';
import { ActiveUser } from '../auth/auth.decorators';
import { User } from '../user/user.entity';
import { SupabaseAuthGuard } from '../auth/guards/supabase.guard';

@Controller('blog-post')
export class PostController implements CRUDController {
  constructor(private readonly service: PostService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @UseGuards(SupabaseAuthGuard)
  async create(@Body() body: CreatePostDTO, @ActiveUser() user: User) {
    return this.service.create(body, user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  @UseGuards(SupabaseAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDTO,
  ) {
    return this.service.update(id, body);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getAll(@Query() query: QueryPostDTO) {
    return this.service.findAll(query);
  }
}
