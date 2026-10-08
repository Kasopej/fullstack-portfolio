'use client'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/utils/client/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import z from 'zod'

const ResetPasswordSchema = z.object({
  password: z.string(),
  passwordConfirm: z.string(),
}).superRefine(({ password, passwordConfirm }, ctx) => {
  if (passwordConfirm !== password) {
    ctx.addIssue({ code: 'custom', message: 'Passwords do not match', path: ['passwordConfirm'] })
  }
})
type FormPayload = z.infer<typeof ResetPasswordSchema>
export default function ResetPasswordPage() {
  const formContext = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  })

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [passwordMasked, setPasswordMasked] = useState(true)

  async function onSubmit(data: FormPayload) {
    if (isLoading) return
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.updateUser({ password: data.password })
      if (error) throw error
      router.push('/dashboard/login')
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
          Rset your password to login
        </p>
      </header>
      <FormProvider {...formContext}>
        <form onSubmit={formContext.handleSubmit(onSubmit)} className="w-full">
          <fieldset className="flex flex-col gap-4 mb-3">
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
            <FormField
              control={formContext.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-contrast-foreground">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm password"
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
          <Button className="w-full max-md:h-16 max-md:text-lg" type="submit" size="xl" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </FormProvider>
    </section>
  )
}
