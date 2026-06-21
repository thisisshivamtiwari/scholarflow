import { Skeleton } from '@/components/ui/Skeleton'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils'

type PageLoaderProps = {
  label?: string
  className?: string
  fullScreen?: boolean
}

export const PageLoader = ({
  label = 'Loading',
  className,
  fullScreen = false,
}: PageLoaderProps) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center gap-3',
      fullScreen ? 'min-h-dvh bg-background' : 'min-h-[40vh]',
      className,
    )}
    role="status"
    aria-live="polite"
  >
    <Spinner size="lg" label={label} />
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
)

export const PageHeaderSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-8 w-56 max-w-full" />
    <Skeleton className="h-4 w-80 max-w-full" />
  </div>
)

export const StatGridSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-8 w-16" />
        <Skeleton className="mt-3 h-3 w-20" />
      </div>
    ))}
  </div>
)

type TableBodySkeletonProps = {
  rows?: number
  columns: number
}

export const TableBodySkeleton = ({ rows = 5, columns }: TableBodySkeletonProps) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <tr key={rowIndex} className="border-t border-border">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <td key={colIndex} className="p-3">
            <Skeleton
              className={cn('h-4', colIndex === 0 ? 'w-28' : colIndex === columns - 1 ? 'w-16' : 'w-full max-w-[140px]')}
            />
          </td>
        ))}
      </tr>
    ))}
  </>
)

export const CardListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="mt-2 h-4 w-32" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-7 w-20 rounded-md" />
          <Skeleton className="h-7 w-16 rounded-md" />
          <Skeleton className="h-7 w-24 rounded-md" />
        </div>
      </div>
    ))}
  </div>
)

export const DashboardPageSkeleton = () => (
  <div className="mx-auto max-w-6xl space-y-8">
    <PageHeaderSkeleton />
    <StatGridSkeleton />
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <Skeleton className="h-4 w-36" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  </div>
)

export const FormCardSkeleton = () => (
  <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
    <Skeleton className="h-4 w-32" />
    <div className="grid gap-4 sm:grid-cols-2">
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
    <Skeleton className="h-10 w-28 rounded-lg" />
  </div>
)

export const TimetableGridSkeleton = () => (
  <div className="overflow-x-auto rounded-xl border border-border">
    <table className="w-full min-w-[720px] text-left text-sm">
      <thead className="bg-muted/50">
        <tr>
          <th className="p-2">
            <Skeleton className="h-4 w-12" />
          </th>
          {Array.from({ length: 5 }).map((_, i) => (
            <th key={i} className="p-2">
              <Skeleton className="h-4 w-16" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <tr key={rowIndex} className="border-t border-border">
            <td className="p-2">
              <Skeleton className="h-4 w-14" />
            </td>
            {Array.from({ length: 5 }).map((_, colIndex) => (
              <td key={colIndex} className="p-2">
                <Skeleton className="h-16 w-full rounded-lg" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export const AuthFormSkeleton = () => (
  <div className="space-y-4" aria-hidden>
    <Skeleton className="h-16 w-full rounded-lg" />
    <Skeleton className="h-16 w-full rounded-lg" />
    <Skeleton className="h-16 w-full rounded-lg" />
    <Skeleton className="h-12 w-full rounded-xl" />
  </div>
)

export const ListPageSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="mx-auto max-w-4xl space-y-8">
    <PageHeaderSkeleton />
    <CardListSkeleton count={count} />
  </div>
)

export const DetailPageSkeleton = () => (
  <div className="mx-auto max-w-4xl space-y-6">
    <Skeleton className="h-4 w-24" />
    <PageHeaderSkeleton />
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-24 w-full rounded-lg" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  </div>
)

type TablePageSkeletonProps = {
  columns: number
  rows?: number
  maxWidth?: string
}

export const TablePageSkeleton = ({
  columns,
  rows = 6,
  maxWidth = 'max-w-5xl',
}: TablePageSkeletonProps) => (
  <div className={`mx-auto ${maxWidth} space-y-6`}>
    <PageHeaderSkeleton />
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead className="bg-muted/50">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="p-3">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <TableBodySkeleton rows={rows} columns={columns} />
        </tbody>
      </table>
    </div>
  </div>
)

export const FormPageSkeleton = () => (
  <div className="mx-auto max-w-2xl space-y-6">
    <PageHeaderSkeleton />
    <FormCardSkeleton />
  </div>
)

export const TimetablePageSkeleton = () => (
  <div className="mx-auto max-w-6xl space-y-6">
    <PageHeaderSkeleton />
    <TimetableGridSkeleton />
  </div>
)

export const PerformancePageSkeleton = () => (
  <div className="mx-auto max-w-5xl space-y-8">
    <PageHeaderSkeleton />
    <StatGridSkeleton count={3} />
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <Skeleton className="h-4 w-32" />
      <div className="mt-4 space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
)

export type PageSkeletonVariant =
  | 'dashboard'
  | 'list'
  | 'detail'
  | 'table'
  | 'form'
  | 'timetable'
  | 'performance'

type PageSkeletonProps = {
  variant?: PageSkeletonVariant
  tableColumns?: number
}

export const PageSkeleton = ({
  variant = 'dashboard',
  tableColumns = 4,
}: PageSkeletonProps) => {
  switch (variant) {
    case 'list':
      return <ListPageSkeleton />
    case 'detail':
      return <DetailPageSkeleton />
    case 'table':
      return <TablePageSkeleton columns={tableColumns} />
    case 'form':
      return <FormPageSkeleton />
    case 'timetable':
      return <TimetablePageSkeleton />
    case 'performance':
      return <PerformancePageSkeleton />
    default:
      return <DashboardPageSkeleton />
  }
}
