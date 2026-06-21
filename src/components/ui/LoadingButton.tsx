import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils'

type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  loadingLabel?: string
  children: ReactNode
}

export const LoadingButton = ({
  loading = false,
  loadingLabel,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: LoadingButtonProps) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={cn('inline-flex items-center justify-center gap-2 disabled:opacity-50', className)}
    {...props}
  >
    {loading ? (
      <>
        <Spinner size="sm" className="border-current/30 border-t-current" />
        {loadingLabel ?? children}
      </>
    ) : (
      children
    )}
  </button>
)
