import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Tag } from './tag.entity';

class BaseTagDto implements Omit<Tag, 'id' | 'posts'> {
  @MaxLength(48)
  @MinLength(4)
  @IsString()
  name: string = '';
}

export class CreateTagDTO extends BaseTagDto {}

export class QueryTagDTO implements Partial<BaseTagDto> {
  @IsOptional()
  @IsString()
  name?: string;
}
