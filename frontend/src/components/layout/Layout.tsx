import { ReactNode, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/app/providers'
import {
  LayoutDashboard,
  Shield,
  FileText,
  Upload,
  CheckSquare,
  Download,
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Controls', href: '/controls', icon: Shield },
  { name: 'Policies', href: '/policies', icon: FileText },
  { name: 'Evidence', href: '/evidence', icon: Upload },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Audit Export', href: '/audit', icon: Download },
  { name: 'Settings', href: '/settings', icon: Settings },
]

function initialsOf(name?: string) {
  const parts = (name || 'U').trim().split(/\s+/).filter(Boolean)
  return (parts[0]?.[0] ?? 'U').concat(parts[1]?.[0] ?? '').toUpperCase()
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const current = navigation.find(
    (item) => location.pathname === item.href || location.pathname.startsWith(item.href + '/')
  )
  const initials = initialsOf(user?.full_name)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card/95 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-5">
          <Link to="/dashboard" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30 transition-colors group-hover:bg-primary/25">
              <Shield className="h-5 w-5 text-primary" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-foreground">
                ComplianceCheckpoint
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                Workspace
              </span>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navigation.map((item) => {
            const isActive =
              location.pathname === item.href || location.pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'sidebar-link',
                  isActive
                    ? 'bg-primary/15 text-foreground ring-1 ring-inset ring-primary/30 shadow-glow-sm'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                )}
              >
                <item.icon
                  className={cn('h-5 w-5 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')}
                />
                <span className="truncate">{item.name}</span>
                {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="shrink-0 border-t border-border p-3">
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/[0.03] p-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {user?.full_name || 'User'}
              </p>
              <p className="truncate text-xs text-muted-foreground">{user?.email || ''}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <nav aria-label="Breadcrumb" className="min-w-0 truncate text-sm">
                <span className="text-muted-foreground/70">Workspace</span>
                <span className="mx-1.5 text-muted-foreground/40">/</span>
                <span className="font-medium text-foreground">{current?.name ?? 'Dashboard'}</span>
              </nav>
            </div>

            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
              </Button>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground lg:hidden">
                {initials}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1400px] animate-fade-in p-4 lg:p-8">{children}</div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border px-6 py-4">
          <p className="text-center text-xs text-muted-foreground">
            © 2026 ComplianceCheckpoint. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}
