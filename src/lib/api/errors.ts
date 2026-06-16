import type { PostgrestError } from '@supabase/supabase-js'

export const throwIfError = <T>(
  result: { data: T; error: PostgrestError | null },
): T => {
  if (result.error) throw result.error
  return result.data
}

export const throwIfMutationError = (result: { error: PostgrestError | null }) => {
  if (result.error) throw result.error
}
