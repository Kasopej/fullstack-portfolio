import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { SupabaseUser } from '../auh.types';
import { Inject } from '@nestjs/common';

@Injectable()
export class SupabaseAuthGuard extends AuthGuard('supabase') {
  constructor(@Inject(UserService) private userService: UserService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) return false;

    const request = context.switchToHttp().getRequest<Request>();
    const supabaseUser = request.user as SupabaseUser;
    if (!supabaseUser.email) return false;
    const dbUser = await this.userService.findByEmail(supabaseUser.email);
    request.user = dbUser;
    return true;
  }
}
