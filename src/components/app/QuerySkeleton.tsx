import type { ReactNode } from 'react'
import { PageSkeleton, type PageSkeletonVariant } from '@/components/ui/LoadingSkeletons'

type QuerySkeletonProps = {
  isLoading: boolean
  variant?: PageSkeletonVariant
  tableColumns?: number
  children: ReactNode
}

export const QuerySkeleton = ({
  isLoading,
  variant = 'dashboard',
  tableColumns,
  children,
}: QuerySkeletonProps) => {
  if (isLoading) {
    return <PageSkeleton variant={variant} tableColumns={tableColumns} />
  }
  return children
}
