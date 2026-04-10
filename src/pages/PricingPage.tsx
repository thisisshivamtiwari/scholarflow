import { PageHero } from '@/components/marketing/PageHero'
import { AnimatedMount } from '@/components/motion/AnimatedMount'
import { PricingTiers } from '@/components/pricing/PricingTiers'

export const PricingPage = () => {
  return (
    <AnimatedMount className="flex min-h-0 flex-1 flex-col" fromY={14}>
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHero
          eyebrow="Pricing"
          title="Transparent tiers that scale with your seats—not surprise invoices"
          subtitle="Pick the package that matches your governance needs today. Upgrade paths are contract-friendly, and every tier includes our mobile-ready web experience with no hidden device fees."
        />
        <PricingTiers />
      </div>
    </AnimatedMount>
  )
}
