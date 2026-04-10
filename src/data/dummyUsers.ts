/**
 * Demo TMS login — School ID: DEMO01
 * Password for all accounts: demo123
 *
 * | Username   | Role       |
 * |------------|------------|
 * | teacher    | Teacher    |
 * | student    | Student    |
 * | parent     | Parent     |
 * | headmaster | Headmaster |
 * | admin      | Admin      |
 */
import type { AuthUser } from '@/types/tms'
import { DEMO_SCHOOL_ID } from '@/data/initialAppData'

const PASSWORD = 'demo123'

export const DUMMY_PASSWORD = PASSWORD

export const dummyUsers: AuthUser[] = [
  {
    id: 'u-teacher',
    schoolId: DEMO_SCHOOL_ID,
    username: 'teacher',
    displayName: 'Dr. Morgan Chen',
    email: 'teacher@riverside.demo',
    role: 'teacher',
    workspaceIds: ['ws-sci-9', 'ws-math-9'],
  },
  {
    id: 'u-student',
    schoolId: DEMO_SCHOOL_ID,
    username: 'student',
    displayName: 'Alex Rivera',
    email: 'student@riverside.demo',
    role: 'student',
    studentId: 'u-student',
  },
  {
    id: 'u-parent',
    schoolId: DEMO_SCHOOL_ID,
    username: 'parent',
    displayName: 'Jamie Rivera',
    email: 'parent@riverside.demo',
    role: 'parent',
    parentChildIds: ['u-student'],
  },
  {
    id: 'u-headmaster',
    schoolId: DEMO_SCHOOL_ID,
    username: 'headmaster',
    displayName: 'Prof. Elena Voss',
    email: 'head@riverside.demo',
    role: 'headmaster',
  },
  {
    id: 'u-admin',
    schoolId: DEMO_SCHOOL_ID,
    username: 'admin',
    displayName: 'Riley Okonkwo',
    email: 'admin@riverside.demo',
    role: 'admin',
  },
]

export const findDummyUser = (
  schoolId: string,
  usernameOrEmail: string,
  password: string,
): AuthUser | null => {
  const normalizedSchool = schoolId.trim().toUpperCase()
  const key = usernameOrEmail.trim().toLowerCase()
  if (password !== PASSWORD) return null
  if (normalizedSchool !== DEMO_SCHOOL_ID) return null
  const u = dummyUsers.find(
    (user) =>
      user.username.toLowerCase() === key ||
      user.email.toLowerCase() === key,
  )
  return u ?? null
}
