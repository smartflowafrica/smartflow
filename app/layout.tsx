import type { Metadata } from 'next'
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import '@/styles/globals.css'
import { LayoutWrapper } from './LayoutWrapper'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://smartflowafrica.com'),
  title: {
    default: 'SmartFlow Africa - AI Automation for Nigerian Businesses',
    template: '%s | SmartFlow Africa'
  },
  description: 'Transform your business with AI automation. 24/7 WhatsApp automation, CRM integration, payment processing & more. Trusted by 100+ Nigerian businesses.',
  keywords: ['business automation nigeria', 'whatsapp automation', 'restaurant automation lagos', 'crm integration nigeria', 'payment automation', 'ai automation nigeria', 'business automation lagos', 'whatsapp business api nigeria'],
  authors: [{ name: 'SmartFlow Africa' }],
  creator: 'SmartFlow Africa',
  publisher: 'SmartFlow Africa',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://smartflowafrica.com',
    siteName: 'SmartFlow Africa',
    title: 'SmartFlow Africa - AI Automation for Nigerian Businesses',
    description: 'Transform your business with AI automation. 24/7 WhatsApp automation, CRM integration, payment processing & more. Trusted by 100+ Nigerian businesses.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SmartFlow Africa - Business Automation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@smartflowafrica',
    creator: '@smartflowafrica',
    title: 'SmartFlow Africa - AI Automation for Nigerian Businesses',
    description: 'Transform your business with AI automation. 24/7 WhatsApp automation, CRM integration, payment processing & more.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SmartFlow Africa',
    url: 'https://smartflowafrica.com',
    logo: 'https://smartflowafrica.com/newlogo.png',
    description: 'AI-powered automation solutions for Nigerian businesses. WhatsApp automation, CRM integration, and business process automation.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NG',
      addressRegion: 'Lagos',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+234-814-552-3052',
      contactType: 'Sales',
      areaServed: 'NG',
      availableLanguage: ['en', 'yo', 'ig', 'ha'],
    },
    sameAs: [
      'https://twitter.com/smartflowafrica',
      'https://linkedin.com/company/smartflowafrica',
      'https://instagram.com/smartflowafrica',
      'https://facebook.com/smartflowafrica',
    ],
  }

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${jakarta.variable} ${outfit.variable} font-sans bg-slate-50 text-slate-900`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
