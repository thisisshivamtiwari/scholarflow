/* eslint-disable react-refresh/only-export-components -- provider + hook pattern */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AppDataState, CurriculumStatus } from '@/types/tms'
import { createInitialAppData } from '@/data/initialAppData'

type AppDataContextValue = {
  data: AppDataState
  approveSyllabus: (workspaceId: string) => void
  rejectSyllabus: (workspaceId: string) => void
  approveChangeRequest: (requestId: string) => void
  rejectChangeRequest: (requestId: string) => void
  approveAccountRequest: (requestId: string) => void
  rejectAccountRequest: (requestId: string) => void
  submitCurriculumForApproval: (workspaceId: string) => void
  setWorkspaceStatus: (workspaceId: string, status: CurriculumStatus) => void
  resetData: () => void
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

const clone = (d: AppDataState): AppDataState => structuredClone(d)

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AppDataState>(() => clone(createInitialAppData()))

  const resetData = useCallback(() => {
    setData(clone(createInitialAppData()))
  }, [])

  const approveSyllabus = useCallback((workspaceId: string) => {
    setData((prev) => {
      const next = clone(prev)
      next.syllabusPending = next.syllabusPending.filter(
        (s) => s.workspaceId !== workspaceId,
      )
      const ws = next.workspaces.find((w) => w.id === workspaceId)
      if (ws) ws.curriculumStatus = 'locked'
      return next
    })
  }, [])

  const rejectSyllabus = useCallback((workspaceId: string) => {
    setData((prev) => {
      const next = clone(prev)
      next.syllabusPending = next.syllabusPending.filter(
        (s) => s.workspaceId !== workspaceId,
      )
      const ws = next.workspaces.find((w) => w.id === workspaceId)
      if (ws) ws.curriculumStatus = 'rejected'
      return next
    })
  }, [])

  const approveChangeRequest = useCallback((requestId: string) => {
    setData((prev) => {
      const next = clone(prev)
      const req = next.changeRequests.find((c) => c.id === requestId)
      next.changeRequests = next.changeRequests.filter((c) => c.id !== requestId)
      if (req) {
        const ws = next.workspaces.find((w) => w.id === req.workspaceId)
        if (ws) ws.curriculumStatus = 'draft'
      }
      return next
    })
  }, [])

  const rejectChangeRequest = useCallback((requestId: string) => {
    setData((prev) => {
      const next = clone(prev)
      next.changeRequests = next.changeRequests.filter((c) => c.id !== requestId)
      return next
    })
  }, [])

  const approveAccountRequest = useCallback((requestId: string) => {
    setData((prev) => {
      const next = clone(prev)
      next.accountRequests = next.accountRequests.filter((a) => a.id !== requestId)
      return next
    })
  }, [])

  const rejectAccountRequest = useCallback((requestId: string) => {
    setData((prev) => {
      const next = clone(prev)
      next.accountRequests = next.accountRequests.filter((a) => a.id !== requestId)
      return next
    })
  }, [])

  const submitCurriculumForApproval = useCallback((workspaceId: string) => {
    setData((prev) => {
      const next = clone(prev)
      const ws = next.workspaces.find((w) => w.id === workspaceId)
      if (ws && ws.curriculumStatus === 'draft') {
        ws.curriculumStatus = 'pending'
        ws.submittedAt = new Date().toISOString().slice(0, 10)
        if (!next.syllabusPending.some((s) => s.workspaceId === workspaceId)) {
          next.syllabusPending.push({
            id: `sp-${Date.now()}`,
            workspaceId,
            submittedAt: ws.submittedAt,
          })
        }
      }
      return next
    })
  }, [])

  const setWorkspaceStatus = useCallback(
    (workspaceId: string, status: CurriculumStatus) => {
      setData((prev) => {
        const next = clone(prev)
        const ws = next.workspaces.find((w) => w.id === workspaceId)
        if (ws) ws.curriculumStatus = status
        return next
      })
    },
    [],
  )

  const value = useMemo(
    () => ({
      data,
      approveSyllabus,
      rejectSyllabus,
      approveChangeRequest,
      rejectChangeRequest,
      approveAccountRequest,
      rejectAccountRequest,
      submitCurriculumForApproval,
      setWorkspaceStatus,
      resetData,
    }),
    [
      data,
      approveSyllabus,
      rejectSyllabus,
      approveChangeRequest,
      rejectChangeRequest,
      approveAccountRequest,
      rejectAccountRequest,
      submitCurriculumForApproval,
      setWorkspaceStatus,
      resetData,
    ],
  )

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  )
}

export const useAppData = (): AppDataContextValue => {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
