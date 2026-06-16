import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createSchool,
  fetchAllAccountRequests,
  fetchAllSchools,
  fetchPlatformStats,
} from '@/lib/api/platform'

export const PLATFORM_SCHOOLS_KEY = ['platform', 'schools'] as const
export const PLATFORM_STATS_KEY = ['platform', 'stats'] as const
export const PLATFORM_ACCOUNT_REQUESTS_KEY = ['platform', 'accountRequests'] as const

export const usePlatformStats = () =>
  useQuery({ queryKey: PLATFORM_STATS_KEY, queryFn: fetchPlatformStats })

export const usePlatformSchools = () =>
  useQuery({ queryKey: PLATFORM_SCHOOLS_KEY, queryFn: fetchAllSchools })

export const usePlatformAccountRequests = () =>
  useQuery({ queryKey: PLATFORM_ACCOUNT_REQUESTS_KEY, queryFn: fetchAllAccountRequests })

export const useCreateSchool = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createSchool,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PLATFORM_SCHOOLS_KEY })
      qc.invalidateQueries({ queryKey: PLATFORM_STATS_KEY })
    },
  })
}
