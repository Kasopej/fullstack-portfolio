'use client'
import { SupabaseClient, User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

type AuthContextType = {
  user: User | null
}
const AuthContext = createContext<AuthContextType>({ user: null })
const supabase: SupabaseClient = new SupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!,
)

export const AuthProvider = ({
  children,
  initialCredentials,
}: {
  children: React.ReactNode
  initialCredentials?: { accessToken: string, refreshToken: string } | null
}) => {
  const [credentials] = useImmer<{
    accessToken: string
    refreshToken: string
  } | null>(initialCredentials || null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    (async () => {
      try {
        await supabase.auth.setSession({
          access_token: credentials?.accessToken || '',
          refresh_token: credentials?.refreshToken || '',
        })
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      }
      catch {
        // do nothing
      }
    })()
  }, [credentials])
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
