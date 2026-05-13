import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagModule } from '../tag/tag.module';
import { Post } from './post.entity';
import { PaginationService } from 'src/providers/pagination/pagination.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), TagModule, AuthModule],
  controllers: [PostController],
  providers: [PostService, PaginationService],
})
export class PostModule {}
