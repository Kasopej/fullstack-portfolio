'use client'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { GithubIcon, ChromeIcon, EyeIcon, EyeOffIcon } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { httpClient } from '@/lib/http/http.client'
import { useRouter } from 'next/navigation'
import { Session } from '@supabase/supabase-js'
import { useState } from 'react'
import { User } from '@/types/auth.types'

type AuthenticationResponse = Omit<Session, 'user'> & User

const defaultGuestEmail = process.env.NEXT_PUBLIC_GUEST_EMAIL
const defaultGuestPassword = process.env.NEXT_PUBLIC_GUEST_PASSWORD
const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
  persistent: z.boolean().default(false),
})
type Payload = z.infer<typeof LoginSchema>
export default function LoginPage() {
  const router = useRouter()
  const formContext = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: defaultGuestEmail || '',
      password: defaultGuestPassword || '',
      persistent: false,
    },
  })
  const [isLoading, setIsLoading] = useState(false)
  const [passwordMasked, setPasswordMasked] = useState(true)

  async function handleLogin(data: Payload) {
    try {
      setIsLoading(true)
      const authData = (await httpClient.request<AuthenticationResponse>('/api/auth/login-proxy', {
        baseUrl: '',
        method: 'POST',
        data,
        notifyOnError: true,
      })).data
      localStorage.setItem('accessToken', authData.access_token)
      router.refresh()
    }
    catch {
      // already handled by notifyOnError
    }
    finally {
      setIsLoading(false)
    }
  }
  return (
    <section className="flex flex-col gap-6">
      <header className="md:text-center">
        <h1 className="text-2xl mb-2">
          Welcome back
        </h1>
        <p className="text-sm">
          Enter your credentials to access the admin panel
        </p>
      </header>
      <div className="flex gap-4 items-center justify-center">
        <Button className="basis-1/2 md:min-w-50 shrink" variant="outline" size="xl">
          <GithubIcon className="size-4" />
          Github
        </Button>
        <Button className="basis-1/2 md:min-w-50 shrink" variant="outline" size="xl">
          <ChromeIcon className="size-4 text-red-500" />
          Github
        </Button>
      </div>
      <FormProvider {...formContext}>
        <form onSubmit={formContext.handleSubmit(handleLogin)} className="w-full">
          <fieldset className="flex flex-col gap-4 mb-3">
            <FormField
              control={formContext.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-contrast-foreground">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            >
            </FormField>
            <FormField
              control={formContext.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-contrast-foreground">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type={passwordMasked ? 'password' : 'text'}
                      {...field}
                      suffix={(
                        <Button type="button" variant="outline" size="icon" onClick={() => setPasswordMasked(!passwordMasked)}>
                          {passwordMasked ? <EyeIcon /> : <EyeOffIcon />}
                        </Button>
                      )}
                      suffixClickable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            >
            </FormField>
          </fieldset>
          <div className="w-full mb-5 flex items-center justify-between gap-2 text-[13px]">
            <span>
              <Label>
                <Checkbox
                  defaultChecked={formContext.getValues('persistent')}
                  onCheckedChange={value => formContext.setValue('persistent', !!value)}
                />
                Remember me
              </Label>
            </span>
          </div>
          <Button className="w-full max-md:h-16 max-md:text-lg" type="submit" size="xl" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </FormProvider>
    </section>
  )
}
