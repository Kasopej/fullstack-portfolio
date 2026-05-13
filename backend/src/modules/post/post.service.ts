import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from 'src/providers/pagination/pagination.service';
import { CRUDService } from 'src/types/services.types';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { TagService } from '../tag/tag.service';
import { CreatePostDTO, QueryPostDTO, UpdatePostDTO } from './post.dto';
import { User } from '../user/user.entity';
import { PaginatedResponse } from 'src/providers/pagination/pagination.types';

@Injectable()
export class PostService implements CRUDService {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
    private readonly paginationService: PaginationService,
    private readonly skillService: TagService,
  ) {}

  public async create(dto: CreatePostDTO, user?: User) {
    if (!user) throw new UnauthorizedException();
    const resolvedTags = await this.skillService.resolveTags(dto.tags);
    const post = this.repository.create({
      ...dto,
      tags: resolvedTags,
      author: user,
    });
    const estimatedReadingTime = this.calculateEstimatedReadingTime(dto.html);
    post.estimatedReadingTime = estimatedReadingTime;
    return this.repository.save(post).catch(async () => {
      throw new InternalServerErrorException();
    });
  }

  public async update(id: number, dto: UpdatePostDTO) {
    const post = await this.repository
      .findOneOrFail({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('Post not found');
      });
    const insertedTags = await this.skillService.resolveTags(dto.tags || [], {
      insertedOnly: true,
    });
    return this.repository
      .save({
        ...post,
        ...dto,
        tags: [...post.tags, ...insertedTags],
      })
      .catch(async () => {
        new InternalServerErrorException();
      });
  }

  public async findById(id: number) {
    const post = await this.repository.findOneBy({ id }).catch(() => {
      throw new InternalServerErrorException('Could not find post');
    });
    if (post) return post;
    throw new NotFoundException('Could not find post');
  }

  public async findByTitle(title: string): Promise<Post | null> {
    const post = await this.repository.findOneBy({ title }).catch(() => {
      throw new InternalServerErrorException('Could not find post');
    });
    if (post) return post;
    throw new NotFoundException('Could not find post');
  }

  public async findAll(query?: QueryPostDTO): Promise<PaginatedResponse<Post>> {
    return this.paginationService
      .paginateQuery(this.repository, query, {})
      .catch(() => {
        throw new InternalServerErrorException('No posts found');
      });
  }

  private calculateEstimatedReadingTime(html: string): bigint {
    const text = html.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return BigInt(minutes * 60 * 1000);
  }
}
