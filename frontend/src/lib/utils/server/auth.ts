import('server-only')
import { SupabaseClient } from '@supabase/supabase-js'

export const supabase: SupabaseClient = new SupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!,
  {
    auth: {
      persistSession: false,
    },
  },
)
