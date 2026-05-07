import { IsEnum, IsOptional, IsString, Validate } from 'class-validator';
import { IsIanaTimezoneConstraint } from 'src/lib/utils/validators.utils';

export enum PageViewQueryRange {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export class PageViewQueryDto {
  @IsEnum(PageViewQueryRange)
  range: PageViewQueryRange;

  @IsOptional()
  @IsString()
  @Validate(IsIanaTimezoneConstraint)
  timezone?: string;
}
