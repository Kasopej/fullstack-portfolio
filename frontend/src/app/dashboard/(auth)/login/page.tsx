'use client'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { GithubIcon, ChromeIcon } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { Label } from '@/components/ui/label'

const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
})
export default function LoginPage() {
  const formContext = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
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
        <form onSubmit={e => e.preventDefault()} className="w-full">
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
                    <Input placeholder="Enter your password" type="password" {...field} />
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
                <Checkbox />
                Remember me
              </Label>
            </span>
            <Link href="/dashboard/forgot-password">Forgot password?</Link>
          </div>
          <Button className="w-full max-md:h-16 max-md:text-lg" type="submit" size="xl">
            Sign in
          </Button>
        </form>
      </FormProvider>
    </section>
  )
}
