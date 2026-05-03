import { Button } from '@/components/ui/button'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { connection } from 'next/server'

type Props = {
  params: Promise<{ locale: string }>
}

export const generateMetadata = async ({ params }: Props) => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'page' })
  return {
    title: t('home'),
  }
}

const Home = async ({ params }: Props) => {
  // Force dynamic rendering for nonce-based CSP
  await connection()

  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'common' })

  return (
    <div>
      <Button>Click me</Button>
      <h1>{t('say_hello')}</h1>
    </div>
  )
}

export default Home
