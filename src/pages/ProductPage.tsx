import { FeaturesGridSection } from '@/components/home/FeaturesGridSection'
import { PageHero } from '@/components/marketing/PageHero'
import { AnimatedMount } from '@/components/motion/AnimatedMount'
import { PlatformDepthSection } from '@/components/product/PlatformDepthSection'

export const ProductPage = () => {
  return (
    <AnimatedMount className="flex min-h-0 flex-1 flex-col" fromY={14}>
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHero
          eyebrow="Platform"
          title="ScholarFlow is the command center for modern schools"
          subtitle="Purpose-built workflows replace generic project tools. Teachers stay in flow, leaders get trustworthy telemetry, and families finally experience software that feels as polished as consumer apps."
        />
        <FeaturesGridSection
          eyebrow="Capability map"
          title="Mix and match modules like you would in any serious SaaS stack"
          subtitle="Each pillar is priced transparently, ships with admin analytics, and can be toggled per campus so you never pay for shelfware."
          headingId="product-features-heading"
        />
        <PlatformDepthSection />
      </div>
    </AnimatedMount>
  )
}
