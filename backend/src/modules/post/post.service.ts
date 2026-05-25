import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from 'src/providers/pagination/pagination.service';
import { CRUDService } from 'src/types/services.types';
import { Equal, ILike, IsNull, Or, Repository } from 'typeorm';
import { Post } from './post.entity';
import { TagService } from '../tag/tag.service';
import {
  CreatePostDTO,
  PublishStatusQuery,
  QueryPostDTO,
  UpdatePostDTO,
} from './post.dto';
import { User } from '../user/user.entity';
import { PaginatedResponse } from 'src/providers/pagination/pagination.types';
import { omit } from 'src/lib/utils';
import { PublishStatus } from 'src/types';
import { PermissionService } from '../permission/permission.service';
import { RoleName } from '../permission/permission.entity';

@Injectable()
export class PostService implements CRUDService {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
    private readonly paginationService: PaginationService,
    private readonly skillService: TagService,
    private readonly permissionService: PermissionService,
  ) {}

  public async create(dto: CreatePostDTO, user: User) {
    this.permissionService.hasRole(user, RoleName.ADMIN);
    const resolvedTags = await this.skillService.resolveTags(dto.tags);
    const post = this.repository.create({
      ...dto,
      tags: resolvedTags,
      author: user,
    });
    const estimatedReadingTime = this.calculateEstimatedReadingTime(dto.html);
    post.estimatedReadingTime = estimatedReadingTime;
    return this.repository.save(post).catch(async (error) => {
      console.error(error);
      throw new InternalServerErrorException();
    });
  }

  public async update(id: number, dto: UpdatePostDTO, user: User) {
    this.permissionService.hasRole(user, RoleName.ADMIN);
    const post = await this.repository
      .findOneOrFail({
        where: {
          id,
          author: {
            id: user.id,
          },
        },
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
    const post = await this.repository
      .findOne({
        where: { id },
        relations: {
          author: true,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Could not find post');
      });
    if (post) return { ...post, publish: post.publish ?? PublishStatus.TRUE };
    throw new NotFoundException('Could not find post');
  }

  public async findByTitle(title: string): Promise<Post | null> {
    const post = await this.repository.findOneBy({ title }).catch(() => {
      throw new InternalServerErrorException('Could not find post');
    });
    if (post) return { ...post, publish: post.publish ?? PublishStatus.TRUE };
    throw new NotFoundException('Could not find post');
  }

  public async findAll(query?: QueryPostDTO): Promise<PaginatedResponse<Post>> {
    const dataQuery = query && omit(query, 'limit', 'page');
    return this.paginationService
      .paginateQuery(
        this.repository,
        query,
        {
          where: dataQuery
            ? {
                title: dataQuery.title
                  ? ILike(`%${dataQuery.title}%`)
                  : undefined,
                publish:
                  !dataQuery.type || dataQuery.type === PublishStatusQuery.ALL
                    ? undefined
                    : dataQuery.type === PublishStatusQuery.DRAFT
                      ? PublishStatus.FALSE
                      : Or(Equal(PublishStatus.TRUE), IsNull()),
              }
            : {},
          relations: {
            author: true,
          },
        },
        {
          map: (post) => ({
            ...post,
            publish: post.publish ?? PublishStatus.TRUE,
          }),
        },
      )
      .catch(() => {
        throw new InternalServerErrorException('No posts found');
      });
  }

  public async deleteRecord(id: number, user: User) {
    this.permissionService.hasRole(user, RoleName.ADMIN);
    const post = await this.repository
      .findOneOrFail({
        where: {
          id,
          author: {
            id: user.id,
          },
        },
      })
      .catch(() => {
        throw new NotFoundException('Post not found');
      });
    await this.repository.delete(post.id).catch(() => {
      throw new InternalServerErrorException('Could not find post');
    });
  }

  private calculateEstimatedReadingTime(html: string): bigint {
    const text = html.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return BigInt(minutes * 60 * 1000);
  }
}
