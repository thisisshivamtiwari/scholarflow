import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

type AuthShellProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

export const AuthShell = ({ title, subtitle, children }: AuthShellProps) => (
  <div className="flex min-h-dvh flex-col bg-linear-to-br from-muted/80 via-background to-primary/5 px-4 py-12 sm:px-6">
    <div className="mx-auto w-full max-w-md">
      <Link
        to="/"
        className="mb-8 flex items-center justify-center gap-2.5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
      >
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <GraduationCap className="size-6" aria-hidden />
        </div>
        <div>
          <p className="text-base font-semibold leading-tight">ScholarFlow</p>
          <p className="text-xs text-muted-foreground">Teaching Management System</p>
        </div>
      </Link>

      <div className="rounded-2xl border border-border/80 bg-card/95 p-8 shadow-lg backdrop-blur-sm sm:p-10">
        <h1 className="text-center text-xl font-semibold text-foreground">{title}</h1>
        {subtitle ? (
          <p className="mt-2 text-center text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  </div>
)
