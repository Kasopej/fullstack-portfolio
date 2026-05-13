import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PasswordLoginDto, SignUpDTO } from './dto/login.dto';
import {
  supabaseClient,
  supabaseAdminClient,
} from 'src/singletons/supabase/supabase.client';
import { UserService } from '../user/user.service';
import { CreateUserDTO } from '../user/dto/user.dto';
import { plainToInstance } from 'class-transformer';
import type { Session } from '@supabase/supabase-js';
import type { User } from '../user/user.entity';

export interface AuthenticationResponse extends Omit<Session, 'user'>, User {
  user?: undefined;
}

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  public async signUp(dto: SignUpDTO): Promise<AuthenticationResponse> {
    const { data, error } = await supabaseClient.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: dto,
      },
    });
    if (data.user && data.session) {
      const userMetaData = data.user.user_metadata as {
        first_name: string;
        last_name: string;
      };
      const dbUser = await this.userService
        .create(
          plainToInstance(CreateUserDTO, {
            email: data.user.email,
            firstName: userMetaData.first_name,
            lastName: userMetaData.last_name,
            OAuthId: data.user.id,
          } as CreateUserDTO),
        )
        .catch(async (err) => {
          if (data.user)
            await supabaseAdminClient.auth.admin.deleteUser(data.user.id);
          throw err;
        });
      return {
        ...dbUser,
        ...data.session,
        user: undefined,
      };
    } else {
      if (error?.code === 'user_already_exists')
        throw new BadRequestException(error?.message);
      throw new InternalServerErrorException();
    }
  }
  public async signInWithPassword(
    dto: PasswordLoginDto,
  ): Promise<AuthenticationResponse> {
    const { data, error } = await supabaseClient.auth.signInWithPassword(dto);
    if (data.user) {
      const userMetaData = data.user.user_metadata as {
        first_name: string;
        last_name: string;
      };
      const dbUser = await this.userService
        .updatebyOauthId(
          data.user.id,
          plainToInstance(CreateUserDTO, {
            email: data.user.email,
            firstName: userMetaData.first_name,
            lastName: userMetaData.last_name,
            OAuthId: data.user.id,
          } as CreateUserDTO),
        )
        .catch(async (err) => {
          await supabaseAdminClient.auth.admin.signOut(
            data.session.access_token,
          );
          throw err;
        });
      return {
        ...dbUser,
        ...data.session,
        user: undefined,
      };
    } else {
      if (error?.code === 'invalid_credentials')
        throw new UnauthorizedException(error?.message);
      throw new InternalServerErrorException();
    }
  }
}
