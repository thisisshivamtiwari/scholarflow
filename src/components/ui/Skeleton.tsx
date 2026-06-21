import { cn } from '@/lib/utils'

type SkeletonProps = {
  className?: string
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    className={cn('skeleton-shimmer rounded-md bg-muted', className)}
    aria-hidden
  />
)
