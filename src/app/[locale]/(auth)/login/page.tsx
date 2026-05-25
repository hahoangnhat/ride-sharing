'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { loginSchema, type LoginForm } from '@/schemas/auth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  const tValidation = useTranslations('validation')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(tCommon('auth.actions.sign_in'))
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md p-4">
        <h1 className="text-2xl font-bold">{tCommon('auth.actions.sign_in')}</h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              {tCommon('auth.labels.email')}
            </label>
            <input
              id="email"
              type="email"
              placeholder={tCommon('auth.placeholders.email')}
              className="mt-1 block w-full rounded-md border px-3 py-2"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {tValidation(form.formState.errors.email.message as string)}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              {tCommon('auth.labels.password')}
            </label>
            <input
              id="password"
              type="password"
              placeholder={tCommon('auth.placeholders.password')}
              className="mt-1 block w-full rounded-md border px-3 py-2"
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {tValidation(form.formState.errors.password.message as string)}
              </p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? tCommon('auth.actions.signing_in') : tCommon('auth.actions.sign_in')}
          </Button>
        </form>
      </Card>
    </div>
  )
}
