import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import { PageTransition } from '@/components/motion/PageTransition'

export const MarketingLayout = () => {
  return (
    <div className="flex min-h-dvh w-full max-w-full flex-col bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main
        id="main"
        className="flex w-full max-w-full flex-1 flex-col outline-none"
        tabIndex={-1}
      >
        <PageTransition />
      </main>
      <SiteFooter />
    </div>
  )
}
