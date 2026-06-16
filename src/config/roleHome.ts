import type { Role } from '@/types/tms'

export const roleHomePath = (role: Role): string => {
  switch (role) {
    case 'teacher':
      return '/app/teacher/dashboard'
    case 'student':
      return '/app/student/dashboard'
    case 'parent':
      return '/app/parent/dashboard'
    case 'headmaster':
      return '/app/headmaster/dashboard'
    case 'admin':
      return '/app/admin/dashboard'
    case 'superadmin':
      return '/app/superadmin/dashboard'
    default:
      return '/login'
  }
}
