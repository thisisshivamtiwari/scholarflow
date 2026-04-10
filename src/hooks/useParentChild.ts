import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export const useParentChild = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const childIds = useMemo(
    () => user?.parentChildIds ?? [],
    [user?.parentChildIds],
  )

  const childId = useMemo(() => {
    const raw = searchParams.get('child')
    if (raw && childIds.includes(raw)) return raw
    return childIds[0] ?? ''
  }, [searchParams, childIds])

  const setChildId = useCallback(
    (id: string) => {
      const next = new URLSearchParams(searchParams)
      next.set('child', id)
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  return { childId, childIds, setChildId }
}
