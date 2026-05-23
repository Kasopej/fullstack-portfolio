import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { User } from 'src/modules/user/user.entity';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { PaginationDto } from 'src/providers/pagination/pagination.dto';
import { Transform, Type } from 'class-transformer';
import { Post } from './post.entity';
import { CreateTagDTO } from '../tag/tag.dto';
import { DTOFromEntity, PublishStatus } from 'src/types';

class BasePostDto implements Omit<DTOFromEntity<Post>, 'tags' | 'publish'> {
  @MaxLength(48)
  @MinLength(4)
  @IsString()
  title: string = '';

  @MaxLength(96)
  @MinLength(4)
  @IsString()
  description: string = '';

  @IsNotEmpty()
  @IsString()
  html: string = '';

  @IsUrl()
  @IsString()
  coverImage: string;

  @Type(() => User)
  author: User;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTagDTO)
  tags: CreateTagDTO[];

  @IsEnum(PublishStatus)
  @Transform(({ value }) =>
    typeof value !== 'boolean'
      ? (value as unknown)
      : value
        ? PublishStatus.TRUE
        : PublishStatus.FALSE,
  )
  publish: PublishStatus;

  @Transform(({ value }) => (value as bigint).toString())
  estimatedReadingTime?: bigint;
}

export class CreatePostDTO extends BasePostDto {}
export class UpdatePostDTO extends PartialType(
  OmitType(BasePostDto, ['author']),
) {}

export enum PublishStatusQuery {
  ALL = 'all',
  PUBLISHED = 'published',
  DRAFT = 'draft',
}
export class QueryPostDTO
  extends PartialType(PaginationDto)
  implements Partial<BasePostDto>
{
  @IsOptional()
  @MaxLength(48)
  @MinLength(4)
  @IsString()
  @Transform(({ value }) => (value as string) || undefined)
  title?: string;

  @IsOptional()
  @IsArray()
  tags?: CreateTagDTO[];

  @IsOptional()
  @IsEnum(PublishStatusQuery)
  type?: PublishStatusQuery;
}
