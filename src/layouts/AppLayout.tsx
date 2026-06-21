import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useEffect, useState, type KeyboardEvent } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { navForRole } from '@/config/navByRole'
import { roleHomePath } from '@/config/roleHome'
import { useAuth } from '@/context/AuthContext'
import { useSessionTimeout } from '@/hooks/useSessionTimeout'
import { AppDataLoading } from '@/components/app/AppDataLoading'
import { FetchingBar } from '@/components/ui/FetchingBar'
import { useAppData } from '@/context/AppDataContext'
import { cn } from '@/lib/utils'

const SIDEBAR_KEY = 'tms-sidebar-collapsed'

export const AppLayout = () => {
  const { user, logout } = useAuth()
  const { isFetching } = useAppData()
  useSessionTimeout()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [collapsed])

  if (!user) return null

  const items = navForRole(user.role)
  const brandLabel = user.role === 'superadmin' ? 'Platform' : user.schoolId

  const handleToggleMobile = () => setMobileOpen((o) => !o)
  const handleMenuKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggleMobile()
    }
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      collapsed && 'justify-center px-2',
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    )

  const sidebar = (
    <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="App">
      {!collapsed ? (
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {user.role}
        </p>
      ) : null}
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          title={collapsed ? label : undefined}
          className={linkClass}
          onClick={() => setMobileOpen(false)}
        >
          <Icon className="size-4 shrink-0" aria-hidden />
          {!collapsed ? <span className="truncate">{label}</span> : null}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="flex min-h-dvh w-full max-w-full bg-muted/20">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card shadow-lg transition-all duration-200 lg:static lg:translate-x-0 lg:shadow-none',
          collapsed ? 'w-[4.5rem]' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label="Sidebar"
      >
        <div
          className={cn(
            'flex h-14 items-center border-b border-border lg:h-16',
            collapsed ? 'justify-center px-2' : 'justify-between px-4',
          )}
        >
          {!collapsed ? (
            <Link
              to={roleHomePath(user.role)}
              className="flex min-w-0 items-center gap-2 truncate text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            >
              <GraduationCap className="size-5 shrink-0 text-primary" aria-hidden />
              <span className="truncate">TMS · {brandLabel}</span>
            </Link>
          ) : (
            <Link
              to={roleHomePath(user.role)}
              className="rounded-lg p-2 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              title={`TMS · ${brandLabel}`}
            >
              <GraduationCap className="size-5" aria-hidden />
            </Link>
          )}
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
        <div className={cn('border-t border-border p-3', collapsed && 'flex justify-center')}>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              'hidden w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground lg:flex',
              collapsed && 'w-auto justify-center px-2',
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="size-4" aria-hidden />
            ) : (
              <>
                <ChevronLeft className="size-4 shrink-0" aria-hidden />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu overlay"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur supports-backdrop-filter:bg-card/80 lg:h-16 lg:gap-4 lg:px-6">
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
            <p className="truncate text-sm font-medium text-foreground">{user.displayName}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <span className="hidden rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary sm:inline">
            {user.role}
          </span>
          <button
            type="button"
            onClick={() => void logout()}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LogOut className="size-4" aria-hidden />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </header>
        <main id="main" className="relative flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8">
          <FetchingBar active={user.role !== 'superadmin' && isFetching} />
          <AppDataLoading>
            <Outlet />
          </AppDataLoading>
        </main>
      </div>
    </div>
  )
}
