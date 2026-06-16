import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type StatCardProps = {
  label: string
  value: ReactNode
  hint?: string
  icon?: LucideIcon
  tone?: 'default' | 'warning' | 'success'
  to?: string
  linkLabel?: string
}

export const StatCard = ({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'default',
  to,
  linkLabel,
}: StatCardProps) => (
  <div
    className={cn(
      'rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md',
      tone === 'warning' && 'border-amber-500/30 bg-amber-500/5',
      tone === 'success' && 'border-emerald-500/30 bg-emerald-500/5',
      tone === 'default' && 'border-border',
    )}
  >
    <div className="flex items-center gap-2 text-muted-foreground">
      {Icon ? <Icon className="size-4 shrink-0" aria-hidden /> : null}
      <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
    </div>
    <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
    {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    {to && linkLabel ? (
      <Link to={to} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
        {linkLabel}
      </Link>
    ) : null}
  </div>
)
