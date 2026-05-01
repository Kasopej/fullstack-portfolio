import {
  BadRequestException,
  Body,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PasswordLoginDto, SignUpDTO } from './dto/login.dto';
import { supabaseClient } from 'src/singletons/supabase/supabase.client';

@Injectable()
export class AuthService {
  public async signUp(dto: SignUpDTO) {
    const { data, error } = await supabaseClient.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: dto,
      },
    });
    if (data.user) {
      return data.session;
    } else {
      if (error?.code === 'user_already_exists')
        throw new BadRequestException(error?.message);
      throw new InternalServerErrorException();
    }
  }
  public async signInWithPassword(dto: PasswordLoginDto) {
    const { data, error } = await supabaseClient.auth.signInWithPassword(dto);
    if (data.user) {
      return data.session;
    } else {
      if (error?.code === 'invalid_credentials')
        throw new UnauthorizedException(error?.message);
      throw new InternalServerErrorException();
    }
  }
}
