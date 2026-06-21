import { cn } from '@/lib/utils'

type FetchingBarProps = {
  active: boolean
}

export const FetchingBar = ({ active }: FetchingBarProps) => (
  <div
    role="status"
    aria-live="polite"
    aria-hidden={!active}
    className={cn(
      'pointer-events-none absolute inset-x-0 top-0 z-20 h-0.5 overflow-hidden transition-opacity',
      active ? 'opacity-100' : 'opacity-0',
    )}
  >
    <div className="h-full w-1/3 animate-[fetch-slide_1.1s_ease-in-out_infinite] bg-primary" />
  </div>
)
