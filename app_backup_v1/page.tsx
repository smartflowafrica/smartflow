import Hero from '@/components/home/Hero'
import LogoCloud from '@/components/home/LogoCloud'
import ProblemSolution from '@/components/home/ProblemSolution'
import ServicesOverview from '@/components/home/ServicesOverview'
import Industries from '@/components/home/Industries'
import HowItWorks from '@/components/home/HowItWorks'
import ResultsStats from '@/components/home/ResultsStats'
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
      <LogoCloud />
      <ProblemSolution />
      <ServicesOverview />
      <Industries />
      <HowItWorks />
      <ResultsStats />
      <CaseStudiesPreview />
      <PricingPreview />
      <ROICalculator />
      <TrustSignals />
      <FAQPreview />
      <FinalCTA />
    </>
  )
}
