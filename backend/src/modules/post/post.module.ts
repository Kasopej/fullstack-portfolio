import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagModule } from '../tag/tag.module';
import { Post } from './post.entity';
import { PaginationService } from 'src/providers/pagination/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), TagModule],
  controllers: [PostController],
  providers: [PostService, PaginationService],
})
export class PostModule {}
