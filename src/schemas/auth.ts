import { z } from 'zod'
import { email } from 'zod/v4'

export const loginSchema = z.object({
  email: email({ message: 'auth.email_invalid' }),
  password: z.string().min(6, { message: 'auth.password_too_short' }),
})

export const signUpSchema = z
  .object({
    email: email({ message: 'auth.email_invalid' }),
    password: z.string().min(6, { message: 'auth.password_too_short' }),
    confirmPassword: z.string().min(1, { message: 'auth.confirm_password_required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.passwords_mismatch',
    path: ['confirmPassword'],
  })

export type LoginForm = z.infer<typeof loginSchema>
export type SignUpForm = z.infer<typeof signUpSchema>
