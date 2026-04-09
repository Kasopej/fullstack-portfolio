import { OmitType } from '@nestjs/mapped-types';
import {
  Equals,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateUserDTO } from 'src/modules/user/dto/user.dto';

export class PasswordLoginDto {
  @IsEmail()
  email: string = '';

  @IsString()
  password: string = '';
}

export class SignUpDTO extends OmitType(CreateUserDTO, ['OAuthId']) {
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character',
  })
  @IsString()
  password: string = '';

  @Equals('password', {
    message: 'Passwords do not match',
  })
  confirmPassword?: string;
}
