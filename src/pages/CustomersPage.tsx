import { CustomerStoriesSection } from '@/components/customers/CustomerStoriesSection'
import { LogoCloudSection } from '@/components/home/LogoCloudSection'
import { TestimonialSection } from '@/components/home/TestimonialSection'
import { PageHero } from '@/components/marketing/PageHero'
import { AnimatedMount } from '@/components/motion/AnimatedMount'

export const CustomersPage = () => {
  return (
    <AnimatedMount className="flex min-h-0 flex-1 flex-col" fromY={14}>
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHero
          eyebrow="Customers"
          title="Leaders who refuse to let operations slow instruction"
          subtitle="Independent schools, charter networks, and global groups partner with ScholarFlow when they need velocity without sacrificing oversight. These highlights come straight from our quarterly business reviews."
        />
        <LogoCloudSection />
        <CustomerStoriesSection />
        <TestimonialSection />
      </div>
    </AnimatedMount>
  )
}
