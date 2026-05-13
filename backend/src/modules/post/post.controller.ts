import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CRUDController } from 'src/types/controllers.types';
import { PostService } from './post.service';
import { CreatePostDTO, QueryPostDTO, UpdatePostDTO } from './post.dto';
import { ActiveUser } from '../auth/auth.decorators';
import { User } from '../user/user.entity';

@Controller('post')
export class PostController implements CRUDController {
  constructor(private readonly service: PostService) {}

  @Post()
  async create(@Body() body: CreatePostDTO, @ActiveUser() user: User) {
    return this.service.create(body, user);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDTO,
  ) {
    return this.service.update(id, body);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Get()
  async getAll(@Query() query: QueryPostDTO) {
    return this.service.findAll(query);
  }
}
