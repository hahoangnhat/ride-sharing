'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { signUpSchema, type SignUpForm } from '@/schemas/auth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()
  const tValidation = useTranslations('validation')
  const tCommon = useTranslations('common')
  const [loading, setLoading] = useState(false)

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (formData: SignUpForm) => {
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`,
      },
    })

    if (error) {
      toast.error(error.message)
      return
    }

    router.push('/check-email')

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg border p-6">
        <h1 className="text-2xl font-bold">{tCommon('auth.actions.sign_up')}</h1>

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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium">
              {tCommon('auth.labels.confirm_password')}
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder={tCommon('auth.placeholders.password')}
              className="mt-1 block w-full rounded-md border px-3 py-2"
              {...form.register('confirmPassword')}
            />
            {form.formState.errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {tValidation(form.formState.errors.confirmPassword.message as string)}
              </p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? tCommon('auth.actions.signing_up') : tCommon('auth.actions.sign_up')}
          </Button>
        </form>
      </div>
    </div>
  )
}
