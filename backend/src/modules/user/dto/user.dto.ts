import {
  Equals,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import type { User } from '../user.entity';

class BaseUserDto implements Omit<User, 'id'> {
  @MaxLength(96)
  @MinLength(4)
  @IsString()
  firstName: string = '';

  @IsOptional()
  @MaxLength(96)
  @MinLength(4)
  @IsString()
  lastName: string = '';

  @MaxLength(96)
  @IsEmail()
  email: string = '';
}

export class CreateUserDTO extends BaseUserDto {
  @IsOptional()
  @MinLength(8)
  @MaxLength(96)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character',
  })
  @IsString()
  password?: string = '';

  @ValidateIf((o: CreateUserDTO) => o.password !== undefined)
  @Equals('password', {
    message: 'Passwords do not match',
  })
  confirmPassword?: string;

  @IsOptional()
  @IsString()
  OAuthId: string;
}
