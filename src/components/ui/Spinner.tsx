import { cn } from '@/lib/utils'

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const sizeClasses = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-10 border-[3px]',
} as const

export const Spinner = ({ size = 'md', className, label = 'Loading' }: SpinnerProps) => (
  <span
    role="status"
    aria-label={label}
    className={cn(
      'inline-block animate-spin rounded-full border-muted border-t-primary',
      sizeClasses[size],
      className,
    )}
  />
)
