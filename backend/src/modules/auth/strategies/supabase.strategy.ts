import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { SupabaseAuthStrategy } from 'nestjs-supabase-auth';
import { User as SupabaseUser } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStrategy extends PassportStrategy<
  typeof SupabaseAuthStrategy,
  SupabaseUser | null
>(SupabaseAuthStrategy, 'supabase') {
  public constructor() {
    super({
      supabaseUrl: process.env.SUPABASE_URL!,
      supabaseKey: process.env.SUPABASE_ANON_KEY!,
      supabaseOptions: {},
      extractor: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  validate(payload: unknown) {
    return super.validate(payload) as Promise<SupabaseUser>;
  }

  authenticate(req) {
    super.authenticate(req);
  }
}
