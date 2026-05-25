'use client'
import { httpClient } from '@/lib/http/http.client'
import { SupabaseClient, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type AuthContextType = {
  user: User | null
}
const AuthContext = createContext<AuthContextType>({ user: null })
const supabase: SupabaseClient = new SupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!,
  {
    auth: {
      persistSession: false,
    },
  },
)

export const AuthProvider = ({
  children,
  credentials,
}: {
  children: React.ReactNode
  credentials?: { accessToken: string, refreshToken: string } | null
}) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.setSession({
          access_token: credentials?.accessToken || '',
          refresh_token: credentials?.refreshToken || '',
        })
        setUser(user)
      }
      catch {
        setUser(null)
      }
    })()
  }, [credentials])
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const router = useRouter()
  const authContext = useContext(AuthContext)
  const logout = useCallback(async () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    await httpClient.request('/api/auth/logout', { baseUrl: '', method: 'POST', data: { redirect: true } })
    router.refresh()
  }, [router])
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return { ...authContext, logout }
}
