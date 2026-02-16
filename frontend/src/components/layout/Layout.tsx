import { ReactNode } from 'react'
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
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

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

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden transition-opacity"
          style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-300 ease-in-out lg:translate-x-0 bg-card border-r border-border shadow-2xl',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="p-2 rounded-lg transition-colors bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <span className="text-lg font-bold text-foreground">ComplianceCP</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "sidebar-link transition-colors",
                    isActive ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-white/5"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center bg-primary"
              >
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs truncate text-muted-foreground">
                  {user?.email || ''}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border"
        >
          <div className="flex h-16 items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span
                  className="absolute top-1 right-1 h-2 w-2 rounded-full animate-pulse bg-destructive"
                />
              </Button>

              {/* User avatar for mobile */}
              <div className="lg:hidden">
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center bg-primary"
                >
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 animate-fade-in">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-border">
          <p className="text-xs text-center text-muted-foreground">
            © 2026 ComplianceCheckpoint. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}