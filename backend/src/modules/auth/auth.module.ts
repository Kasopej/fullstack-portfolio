import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { SupabaseStrategy } from './strategies/supabase.strategy';

@Module({
  imports: [PassportModule],
  providers: [AuthService, SupabaseStrategy],
  controllers: [AuthController],
  exports: [SupabaseStrategy],
})
export class AuthModule {}
