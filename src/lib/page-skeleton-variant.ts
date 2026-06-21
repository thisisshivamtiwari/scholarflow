import type { PageSkeletonVariant } from '@/components/ui/LoadingSkeletons'

export const pageSkeletonVariant = (pathname: string): PageSkeletonVariant => {
  if (pathname.includes('/dashboard')) return 'dashboard'
  if (pathname.includes('/workspaces') || pathname.includes('/subjects') || pathname.includes('/pending')) {
    return 'list'
  }
  if (pathname.includes('/topics/')) return 'detail'
  if (
    pathname.includes('/audit-log') ||
    pathname.includes('/users') ||
    pathname.includes('/account-requests') ||
    pathname.includes('/schools')
  ) {
    return 'table'
  }
  if (pathname.includes('/configuration') || pathname.includes('/attendance-config')) return 'form'
  if (pathname.includes('/timetable')) return 'timetable'
  if (
    pathname.includes('/performance') ||
    pathname.includes('/attendance') ||
    pathname.includes('/curriculum') ||
    pathname.includes('/syllabus/')
  ) {
    return 'performance'
  }
  if (pathname.includes('/tracking') || pathname.includes('/grades')) return 'detail'
  return 'dashboard'
}

export const pageSkeletonTableColumns = (pathname: string): number => {
  if (pathname.includes('/account-requests')) return 6
  if (pathname.includes('/schools')) return 3
  if (pathname.includes('/users')) return 5
  return 4
}
