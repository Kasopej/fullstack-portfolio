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
import { Project } from '../project.entity';
import { User } from 'src/modules/user/user.entity';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { PaginationDto } from 'src/providers/pagination/pagination.dto';
import { Type } from 'class-transformer';
import { CreateSkillDTO } from 'src/modules/skill/skill.dto';

class BaseProjectDto implements Omit<Project, 'id' | 'skills'> {
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
  @Type(() => CreateSkillDTO)
  skills: CreateSkillDTO[];

  @IsOptional()
  @IsUrl()
  projectUrl?: string;

  @IsOptional()
  @IsUrl()
  repoUrl?: string;
}

export class CreateProjectDTO extends BaseProjectDto {}
export class UpdateProjectDTO extends PartialType(
  OmitType(BaseProjectDto, ['author']),
) {}

export class QueryProjectDTO
  extends PartialType(PaginationDto)
  implements Partial<BaseProjectDto>
{
  @IsOptional()
  @MaxLength(48)
  @MinLength(4)
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  skills?: CreateSkillDTO[];
}
