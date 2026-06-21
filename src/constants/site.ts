export const SITE = {
  name: 'ScholarFlow',
  tagline: 'The modern platform for how schools run day to day.',
  description:
    'Curriculum, schedules, attendance, and family visibility—one connected workspace your whole campus can trust.',
} as const

export const DEMO_SCHOOL_ID = 'DEMO01'

export type NavRoute = {
  label: string
  to: string
}

export const primaryNav: NavRoute[] = [
  { label: 'Product', to: '/product' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Customers', to: '/customers' },
]
