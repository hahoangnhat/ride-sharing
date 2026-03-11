import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { use } from 'react'

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

const Home = ({ params }: Props) => {
  const { locale } = use(params)
  setRequestLocale(locale)

  const t = useTranslations('common')

  return <h1>{t('say_hello')}</h1>
}

export default Home
