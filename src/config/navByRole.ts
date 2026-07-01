import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LineChart,
  Settings,
  Shield,
  Star,
  Users,
  UserSquare,
} from 'lucide-react'
import type { Role } from '@/types/tms'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  roles: Role[]
}

export const appNavItems: NavItem[] = [
  {
    to: '/app/teacher/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['teacher'],
  },
  {
    to: '/app/teacher/workspaces',
    label: 'Workspaces',
    icon: BookOpen,
    roles: ['teacher'],
  },
  {
    to: '/app/teacher/request-subject',
    label: 'Request subject',
    icon: ClipboardList,
    roles: ['teacher'],
  },
  {
    to: '/app/teacher/behaviour',
    label: 'Behaviour',
    icon: Star,
    roles: ['teacher'],
  },
  {
    to: '/app/teacher/academic-report',
    label: 'Academic report',
    icon: FileText,
    roles: ['teacher'],
  },
  {
    to: '/app/teacher/timetable',
    label: 'Timetable',
    icon: CalendarDays,
    roles: ['teacher'],
  },
  {
    to: '/app/student/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['student'],
  },
  {
    to: '/app/student/subjects',
    label: 'My subjects',
    icon: BookOpen,
    roles: ['student'],
  },
  {
    to: '/app/student/performance',
    label: 'My performance',
    icon: LineChart,
    roles: ['student'],
  },
  {
    to: '/app/student/timetable',
    label: 'Timetable',
    icon: CalendarDays,
    roles: ['student'],
  },
  {
    to: '/app/student/attendance',
    label: 'Attendance',
    icon: ClipboardCheck,
    roles: ['student'],
  },
  {
    to: '/app/parent/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['parent'],
  },
  {
    to: '/app/parent/performance',
    label: 'Academic',
    icon: LineChart,
    roles: ['parent'],
  },
  {
    to: '/app/parent/curriculum',
    label: 'Curriculum',
    icon: BookOpen,
    roles: ['parent'],
  },
  {
    to: '/app/parent/attendance',
    label: 'Attendance',
    icon: ClipboardCheck,
    roles: ['parent'],
  },
  {
    to: '/app/parent/behaviour',
    label: 'Behaviour',
    icon: Star,
    roles: ['parent'],
  },
  {
    to: '/app/parent/timetable',
    label: 'Timetable',
    icon: CalendarDays,
    roles: ['parent'],
  },
  {
    to: '/app/headmaster/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['headmaster'],
  },
  {
    to: '/app/headmaster/pending',
    label: 'Pending tasks',
    icon: ClipboardList,
    roles: ['headmaster'],
  },
  {
    to: '/app/headmaster/school-performance',
    label: 'School performance',
    icon: LineChart,
    roles: ['headmaster'],
  },
  {
    to: '/app/headmaster/teacher-performance',
    label: 'Teacher performance',
    icon: UserSquare,
    roles: ['headmaster'],
  },
  {
    to: '/app/headmaster/attendance',
    label: 'Attendance overview',
    icon: ClipboardCheck,
    roles: ['headmaster'],
  },
  {
    to: '/app/headmaster/users',
    label: 'Users',
    icon: Users,
    roles: ['headmaster'],
  },
  {
    to: '/app/headmaster/configuration',
    label: 'Configuration',
    icon: Settings,
    roles: ['headmaster'],
  },
  {
    to: '/app/headmaster/timetable',
    label: 'Timetable',
    icon: CalendarDays,
    roles: ['headmaster'],
  },
  {
    to: '/app/headmaster/audit-log',
    label: 'Audit log',
    icon: ClipboardList,
    roles: ['headmaster'],
  },
  {
    to: '/app/admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['admin'],
  },
  {
    to: '/app/admin/pending',
    label: 'Pending tasks',
    icon: ClipboardList,
    roles: ['admin'],
  },
  {
    to: '/app/admin/users',
    label: 'Users',
    icon: Users,
    roles: ['admin'],
  },
  {
    to: '/app/admin/configuration',
    label: 'Configuration',
    icon: Settings,
    roles: ['admin'],
  },
  {
    to: '/app/admin/timetable',
    label: 'Timetable',
    icon: CalendarDays,
    roles: ['admin'],
  },
  {
    to: '/app/admin/attendance-config',
    label: 'Attendance config',
    icon: ClipboardCheck,
    roles: ['admin'],
  },
  {
    to: '/app/admin/audit-log',
    label: 'Audit log',
    icon: ClipboardList,
    roles: ['admin'],
  },
  {
    to: '/app/superadmin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['superadmin'],
  },
  {
    to: '/app/superadmin/schools',
    label: 'Schools',
    icon: Building2,
    roles: ['superadmin'],
  },
  {
    to: '/app/superadmin/account-requests',
    label: 'Account requests',
    icon: Users,
    roles: ['superadmin'],
  },
  {
    to: '/app/superadmin/audit-log',
    label: 'Audit log',
    icon: Shield,
    roles: ['superadmin'],
  },
]

export const navForRole = (role: Role): NavItem[] =>
  appNavItems.filter((item) => item.roles.includes(role))
