import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  LayoutDashboard,
  LineChart,
  Settings,
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
    to: '/app/teacher/timetable',
    label: 'Timetable',
    icon: CalendarDays,
    roles: ['teacher'],
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
    to: '/app/parent/overview',
    label: 'Overview',
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
    to: '/app/parent/timetable',
    label: 'Timetable',
    icon: CalendarDays,
    roles: ['parent'],
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
]

export const navForRole = (role: Role): NavItem[] =>
  appNavItems.filter((item) => item.roles.includes(role))
