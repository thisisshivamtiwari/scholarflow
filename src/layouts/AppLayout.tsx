import { LogOut, Menu, X } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { navForRole } from '@/config/navByRole'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export const AppLayout = () => {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) return null

  const items = navForRole(user.role)

  const handleToggleMobile = () => setMobileOpen((o) => !o)
  const handleMenuKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggleMobile()
    }
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    )

  const sidebar = (
    <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="App">
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {user.role}
      </p>
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={linkClass}
          onClick={() => setMobileOpen(false)}
        >
          <Icon className="size-4 shrink-0" aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="flex min-h-dvh w-full max-w-full bg-background">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card shadow-lg transition-transform lg:static lg:translate-x-0 lg:shadow-none',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label="Sidebar"
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4 lg:h-16">
          <Link
            to="/app"
            className="truncate text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            TMS · {user.schoolId}
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-foreground lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={handleToggleMobile}
            onKeyDown={handleMenuKeyDown}
            aria-label="Close menu"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        {sidebar}
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu overlay"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col lg:ml-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-card/95 px-4 backdrop-blur supports-backdrop-filter:bg-card/80 lg:h-16 lg:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-foreground lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={handleToggleMobile}
            onKeyDown={handleMenuKeyDown}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu className="size-5" aria-hidden />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {user.displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LogOut className="size-4" aria-hidden />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </header>
        <main
          id="main"
          className="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
