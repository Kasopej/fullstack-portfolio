import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Skill } from './skill.entity';

class BaseSkillDto implements Omit<Skill, 'id' | 'projects'> {
  @MaxLength(48)
  @MinLength(4)
  @IsString()
  name: string = '';
}

export class CreateSkillDTO extends BaseSkillDto {}

export class QuerySkillDTO implements Partial<BaseSkillDto> {
  @IsOptional()
  @IsString()
  name?: string;
}
