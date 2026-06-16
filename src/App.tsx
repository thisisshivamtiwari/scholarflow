import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedAppLayout } from '@/components/auth/ProtectedAppLayout'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { MarketingLayout } from '@/components/layout/MarketingLayout'
import { AuthProvider } from '@/context/AuthContext'
import { AttendanceConfigPage } from '@/pages/app/admin/AttendanceConfigPage'
import { AdminDashboard } from '@/pages/app/admin/AdminDashboard'
import { NotFoundApp } from '@/pages/app/NotFoundApp'
import { RoleHomeRedirect } from '@/pages/app/RoleHomeRedirect'
import { HeadmasterAttendancePage } from '@/pages/app/headmaster/HeadmasterAttendancePage'
import { HeadmasterDashboard } from '@/pages/app/headmaster/HeadmasterDashboard'
import { PendingTasksPage } from '@/pages/app/headmaster/PendingTasksPage'
import { SchoolPerformancePage } from '@/pages/app/headmaster/SchoolPerformancePage'
import { SyllabusReviewPage } from '@/pages/app/headmaster/SyllabusReviewPage'
import { TeacherPerformancePage } from '@/pages/app/headmaster/TeacherPerformancePage'
import { TimetableAdminPage } from '@/pages/app/headmaster/TimetableAdminPage'
import { UsersAdminPage } from '@/pages/app/headmaster/UsersAdminPage'
import { ConfigurationPage } from '@/pages/app/headmaster/ConfigurationPage'
import { ParentAttendance } from '@/pages/app/parent/ParentAttendance'
import { ParentCurriculum } from '@/pages/app/parent/ParentCurriculum'
import { ParentDashboard } from '@/pages/app/parent/ParentDashboard'
import { ParentPerformance } from '@/pages/app/parent/ParentPerformance'
import { ParentTimetable } from '@/pages/app/parent/ParentTimetable'
import { StudentAttendance } from '@/pages/app/student/StudentAttendance'
import { StudentDashboard } from '@/pages/app/student/StudentDashboard'
import { StudentPerformance } from '@/pages/app/student/StudentPerformance'
import { StudentSubjects } from '@/pages/app/student/StudentSubjects'
import { StudentTopicDetail } from '@/pages/app/student/StudentTopicDetail'
import { StudentTimetable } from '@/pages/app/student/StudentTimetable'
import { TeacherAttendance } from '@/pages/app/teacher/TeacherAttendance'
import { TeacherCurriculum } from '@/pages/app/teacher/TeacherCurriculum'
import { TeacherDashboard } from '@/pages/app/teacher/TeacherDashboard'
import { TeacherGrades } from '@/pages/app/teacher/TeacherGrades'
import { TeacherTimetable } from '@/pages/app/teacher/TeacherTimetable'
import { TeacherTopicDetail } from '@/pages/app/teacher/TeacherTopicDetail'
import { TeacherTracking } from '@/pages/app/teacher/TeacherTracking'
import { TeacherWorkspaces } from '@/pages/app/teacher/TeacherWorkspaces'
import { CustomersPage } from '@/pages/CustomersPage'
import { GetStartedPage } from '@/pages/GetStartedPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { PricingPage } from '@/pages/PricingPage'
import { ProductPage } from '@/pages/ProductPage'
import { AuditLogPage } from '@/pages/app/admin/AuditLogPage'
import { SuperadminAccountRequestsPage } from '@/pages/app/superadmin/SuperadminAccountRequestsPage'
import { SuperadminDashboardPage } from '@/pages/app/superadmin/SuperadminDashboardPage'
import { SuperadminSchoolsPage } from '@/pages/app/superadmin/SuperadminSchoolsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
})

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MarketingLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/sign-in" element={<Navigate to="/login" replace />} />
            <Route path="/get-started" element={<GetStartedPage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/app" element={<ProtectedAppLayout />}>
              <Route index element={<RoleHomeRedirect />} />

              <Route path="teacher" element={<RoleGuard roles={['teacher']} />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<TeacherDashboard />} />
                <Route path="workspaces" element={<TeacherWorkspaces />} />
                <Route
                  path="workspaces/:workspaceId/curriculum"
                  element={<TeacherCurriculum />}
                />
                <Route
                  path="workspaces/:workspaceId/topics/:topicId"
                  element={<TeacherTopicDetail />}
                />
                <Route
                  path="workspaces/:workspaceId/tracking"
                  element={<TeacherTracking />}
                />
                <Route
                  path="workspaces/:workspaceId/grades"
                  element={<TeacherGrades />}
                />
                <Route
                  path="workspaces/:workspaceId/attendance"
                  element={<TeacherAttendance />}
                />
                <Route path="timetable" element={<TeacherTimetable />} />
              </Route>

              <Route path="student" element={<RoleGuard roles={['student']} />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="subjects" element={<StudentSubjects />} />
                <Route
                  path="subjects/:workspaceId/topics/:topicId"
                  element={<StudentTopicDetail />}
                />
                <Route path="performance" element={<StudentPerformance />} />
                <Route path="timetable" element={<StudentTimetable />} />
                <Route path="attendance" element={<StudentAttendance />} />
              </Route>

              <Route path="parent" element={<RoleGuard roles={['parent']} />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ParentDashboard />} />
                <Route path="overview" element={<Navigate to="dashboard" replace />} />
                <Route path="performance" element={<ParentPerformance />} />
                <Route path="curriculum" element={<ParentCurriculum />} />
                <Route path="attendance" element={<ParentAttendance />} />
                <Route path="timetable" element={<ParentTimetable />} />
              </Route>

              <Route path="headmaster" element={<RoleGuard roles={['headmaster']} />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<HeadmasterDashboard />} />
                <Route
                  path="pending"
                  element={<PendingTasksPage variant="headmaster" />}
                />
                <Route path="syllabus/:workspaceId" element={<SyllabusReviewPage />} />
                <Route
                  path="school-performance"
                  element={<SchoolPerformancePage />}
                />
                <Route
                  path="teacher-performance"
                  element={<TeacherPerformancePage />}
                />
                <Route path="attendance" element={<HeadmasterAttendancePage />} />
                <Route path="users" element={<UsersAdminPage />} />
                <Route path="configuration" element={<ConfigurationPage />} />
                <Route path="timetable" element={<TimetableAdminPage />} />
                <Route path="audit-log" element={<AuditLogPage />} />
              </Route>

              <Route path="admin" element={<RoleGuard roles={['admin']} />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="pending" element={<PendingTasksPage variant="admin" />} />
                <Route path="users" element={<UsersAdminPage />} />
                <Route path="configuration" element={<ConfigurationPage />} />
                <Route path="timetable" element={<TimetableAdminPage />} />
                <Route path="attendance-config" element={<AttendanceConfigPage />} />
                <Route path="audit-log" element={<AuditLogPage />} />
              </Route>

              <Route path="superadmin" element={<RoleGuard roles={['superadmin']} />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<SuperadminDashboardPage />} />
                <Route path="schools" element={<SuperadminSchoolsPage />} />
                <Route path="account-requests" element={<SuperadminAccountRequestsPage />} />
                <Route path="audit-log" element={<AuditLogPage />} />
              </Route>

              <Route path="*" element={<NotFoundApp />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
