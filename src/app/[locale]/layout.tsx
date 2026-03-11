import { routing } from '@/i18n/routing'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }))
}

const LocaleLayout = async ({ children, params }: Props) => {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  return <NextIntlClientProvider locale={locale}>{children}</NextIntlClientProvider>
}

export default LocaleLayout
