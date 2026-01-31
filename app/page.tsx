import Hero from '@/components/home/Hero'

import ProblemSolution from '@/components/home/ProblemSolution'
import ServicesOverview from '@/components/home/ServicesOverview'
import Industries from '@/components/home/Industries'
import HowItWorks from '@/components/home/HowItWorks'

import CaseStudiesPreview from '@/components/home/CaseStudiesPreview'
import PricingPreview from '@/components/home/PricingPreview'
import ROICalculator from '@/components/home/ROICalculator'
import TrustSignals from '@/components/home/TrustSignals'
import FAQPreview from '@/components/home/FAQPreview'
import FinalCTA from '@/components/home/FinalCTA'

export default function HomePage() {
  return (
    <>
      <Hero />

      <ProblemSolution />
      <ServicesOverview />
      <Industries />
      <HowItWorks />

      <CaseStudiesPreview />
      <PricingPreview />
      <ROICalculator />
      <TrustSignals />
      <FAQPreview />
      <FinalCTA />
    </>
  )
}
