import { FeaturesGridSection } from '@/components/home/FeaturesGridSection'
import { HeroSection } from '@/components/home/HeroSection'
import { HomeCtaSection } from '@/components/home/HomeCtaSection'
import { LogoCloudSection } from '@/components/home/LogoCloudSection'
import { TestimonialSection } from '@/components/home/TestimonialSection'
import { WorkflowSection } from '@/components/home/WorkflowSection'
import { AnimatedMount } from '@/components/motion/AnimatedMount'

export const HomePage = () => {
  return (
    <AnimatedMount className="flex min-h-0 flex-1 flex-col" fromY={14}>
      <div className="flex min-h-0 flex-1 flex-col">
        <HeroSection />
        <LogoCloudSection />
        <FeaturesGridSection />
        <WorkflowSection />
        <TestimonialSection />
        <HomeCtaSection />
      </div>
    </AnimatedMount>
  )
}
