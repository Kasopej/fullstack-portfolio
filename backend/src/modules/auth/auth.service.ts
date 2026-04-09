import { Body, Injectable, RequestTimeoutException } from '@nestjs/common';
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
      console.log('user', data.user);
      return data.session;
    } else throw new RequestTimeoutException(error?.message);
  }
  public async signInWithPassword(dto: PasswordLoginDto) {
    const { data, error } = await supabaseClient.auth.signInWithPassword(dto);
    if (data.user) {
      return data.session;
    } else throw new RequestTimeoutException(error?.message);
  }
}
