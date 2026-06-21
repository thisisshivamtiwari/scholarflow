import type { AppDataState, CurriculumStatus } from '@/types/tms'
import { useAppData as useAppDataQuery } from '@/hooks/queries/useTmsData'

/** Compatibility hook — mirrors legacy AppDataContext API backed by Supabase */
export const useAppData = () => {
  const q = useAppDataQuery()

  const data: AppDataState | undefined = q.data

  return {
    data: data as AppDataState,
    isLoading: q.isLoading,
    isFetching: q.isFetching,
    error: q.error,
    refetch: q.refetch,
    approveSyllabus: (workspaceId: string) => q.approveSyllabus.mutate(workspaceId),
    rejectSyllabus: (workspaceId: string) => q.rejectSyllabus.mutate(workspaceId),
    approveChangeRequest: (requestId: string) => q.approveChangeRequest.mutate(requestId),
    rejectChangeRequest: (requestId: string) => q.rejectChangeRequest.mutate(requestId),
    approveAccountRequest: (requestId: string) => q.approveAccountRequest.mutate(requestId),
    rejectAccountRequest: (requestId: string) => q.rejectAccountRequest.mutate(requestId),
    submitCurriculumForApproval: (workspaceId: string) =>
      q.submitCurriculumForApproval.mutate(workspaceId),
    setWorkspaceStatus: (workspaceId: string, status: CurriculumStatus) =>
      q.setWorkspaceStatus.mutate({ workspaceId, status }),
    addTopic: q.addTopic.mutate,
    deleteTopic: (id: string) => q.deleteTopic.mutate(id),
    reorderTopics: (ids: string[]) => q.reorderTopics.mutate(ids),
    upsertTracking: q.upsertTracking.mutate,
    addResource: q.addResource.mutate,
    toggleResourceVisibility: q.toggleResourceVisibility.mutate,
    removeResource: (id: string) => q.removeResource.mutate(id),
    uploadPaper: q.uploadPaper.mutate,
    addGrade: q.addGrade.mutate,
    importGradesCsv: q.importGradesCsv.mutate,
    upsertAttendance: q.upsertAttendance.mutate,
    createChangeRequest: q.createChangeRequest.mutate,
    resetData: () => q.refetch(),
  }
}
