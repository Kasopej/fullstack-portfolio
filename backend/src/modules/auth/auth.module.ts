import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { SupabaseStrategy } from './strategies/supabase.strategy';
import { UserModule } from '../user/user.module';
import { SupabaseAuthGuard } from './guards/supabase.guard';

@Module({
  imports: [PassportModule, UserModule],
  providers: [AuthService, SupabaseStrategy, SupabaseAuthGuard],
  controllers: [AuthController],
  exports: [SupabaseStrategy, SupabaseAuthGuard, UserModule],
})
export class AuthModule {}
