import { Strategy } from 'passport-strategy';
import { createClient } from '@supabase/supabase-js';
import type { AuthUser as SupabaseAuthUser } from '@supabase/supabase-js';
import type { Request } from 'express';

const UNAUTHORIZED = 'Unauthorized';
const SUPABASE_AUTH = 'SUPABASE_AUTH';
export class SupabaseAuthStrategy extends Strategy {
  readonly name = 'SUPABASE_AUTH';
  private supabase: ReturnType<typeof createClient>;
  private extractor: (req: Request) => string | null;
  success: (user: any, info: any) => void;
  fail: Strategy['fail'];
  constructor(options: {
    supabaseUrl: string;
    supabaseKey: string;
    supabaseOptions?: object;
    extractor: (req: Request) => string | null;
  }) {
    super();

    this.name = SUPABASE_AUTH;

    if (!options.extractor) {
      throw new Error(`
        Extractor is not a function. You should provide an extractor.
        Read the docs: https://github.com/tfarras/nestjs-firebase-auth#readme
      `);
    }

    this.supabase = createClient(
      options.supabaseUrl,
      options.supabaseKey,
      options.supabaseOptions || {},
    );

    this.extractor = options.extractor;
  }

  async validate(payload: SupabaseAuthUser): Promise<SupabaseAuthUser> {
    return payload;
  }

  authenticate(req: Request) {
    const accessToken = this.extractor(req);

    if (!accessToken) {
      this.fail(UNAUTHORIZED, 401);
      return;
    }

    this.supabase.auth
      .getUser(accessToken)
      .then((res) => this.validateSupabaseResponse(res))
      .catch((err: Error) => {
        this.fail(err.message, 401);
      });
  }

  private async validateSupabaseResponse({
    data,
    error,
  }: {
    data: { user: SupabaseAuthUser | null } | null;
    error: Error | null;
  }): Promise<void> {
    if (error || !data?.user) {
      this.fail(UNAUTHORIZED, 401);
      return;
    }

    const result = await this.validate(data.user);

    if (result) {
      this.success(result, {});
      return;
    }

    this.fail(UNAUTHORIZED, 401);
  }
}
