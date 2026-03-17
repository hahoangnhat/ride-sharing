import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SerwistProvider } from './serwist'
import { Figtree } from 'next/font/google'
import { cn } from '@/utils'

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' })

const appName = process.env.APP_NAME!
const appDefaultTitle = process.env.APP_DEFAULT_TITLE!
const appTitleTemplate = process.env.APP_TITLE_TEMPLATE!
const appDescription = process.env.APP_DESCRIPTION!

export const metadata: Metadata = {
  applicationName: appName,
  title: {
    default: appDefaultTitle,
    template: appTitleTemplate,
  },
  description: appDescription,
  appleWebApp: {
    capable: true,
    title: appDefaultTitle,
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: appName,
    title: {
      default: appDefaultTitle,
      template: appTitleTemplate,
    },
    description: appDescription,
  },
  twitter: {
    card: 'summary',
    title: {
      default: appDefaultTitle,
      template: appTitleTemplate,
    },
    description: appDescription,
  },
}

export const viewport: Viewport = {
  themeColor: '#fff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={cn('font-sans', figtree.variable)}>
      <body>
        <SerwistProvider swUrl="/serwist/sw.js">{children}</SerwistProvider>
      </body>
    </html>
  )
}
