import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { use } from 'react'

type TOfflinePageProps = {
  params: Promise<{ locale: string }>
}

export const generateMetadata = async ({ params }: TOfflinePageProps) => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'offline' })
  return {
    title: t('title'),
  }
}

const OfflinePage = ({ params }: TOfflinePageProps) => {
  const { locale } = use(params)
  setRequestLocale(locale)

  const t = useTranslations('offline')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <p className="text-muted-foreground max-w-md">{t('description')}</p>
    </main>
  )
}

export default OfflinePage
