import {
  IsArray,
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
import { Type } from 'class-transformer';
import { Post } from './post.entity';
import { CreateTagDTO } from '../tag/tag.dto';
import { DTOFromEntity } from 'src/types';

class BasePostDto implements Omit<DTOFromEntity<Post>, 'tags'> {
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

  @IsOptional()
  @IsUrl()
  @IsString()
  coverImage?: string;

  @Type(() => User)
  author: User;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTagDTO)
  tags: CreateTagDTO[];
}

export class CreatePostDTO extends BasePostDto {}
export class UpdatePostDTO extends PartialType(
  OmitType(BasePostDto, ['author']),
) {}

export class QueryPostDTO
  extends PartialType(PaginationDto)
  implements Partial<BasePostDto>
{
  @IsOptional()
  @MaxLength(48)
  @MinLength(4)
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  skills?: CreateTagDTO[];
}
