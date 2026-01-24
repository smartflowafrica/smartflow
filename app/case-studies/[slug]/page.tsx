import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CaseStudyDetail from '../../../components/case-studies/CaseStudyDetail'
import { getCaseStudyBySlug, listCaseStudies } from '../../../data/caseStudies'

type Props = {
  params: { slug: string }
}

// Generate static params for all case studies (for static generation)
export async function generateStaticParams() {
  const studies = listCaseStudies()
  return studies.map((study) => ({
    slug: study.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params
  const study = getCaseStudyBySlug(slug)

  if (!study) {
    return {
      title: 'Case Study Not Found',
      description: 'The requested case study could not be found.',
    }
  }

  const ogImage = study.heroImage || study.thumbnail || '/og-default.jpg'
  
  return {
    title: `${study.business} Case Study - ${study.industry} Automation Success | SmartFlow Africa`,
    description: study.summary,
    keywords: [
      study.business,
      study.industry,
      'automation',
      'case study',
      'Nigerian business',
      'WhatsApp automation',
      ...(study.tags || []),
    ],
    authors: [{ name: 'SmartFlow Africa' }],
    openGraph: {
      title: `${study.business} - ${study.industry} Automation Success`,
      description: study.summary,
      url: `/case-studies/${study.slug}`,
      siteName: 'SmartFlow Africa',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${study.business} case study`,
        },
      ],
      locale: 'en_NG',
      type: 'article',
      publishedTime: study.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${study.business} - ${study.industry} Automation Success`,
      description: study.summary,
      images: [ogImage],
    },
  }
}

export default function CaseStudyDetailPage({ params }: Props) {
  const { slug } = params
  const study = getCaseStudyBySlug(slug)

  if (!study) return notFound()

  return (
    <main>
      <CaseStudyDetail study={study} />
    </main>
  )
}
