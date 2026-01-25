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
  Search,
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
    <div className="min-h-screen" style={{ background: '#f1f5f9' }}>
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
          'fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ background: 'white', borderRight: '1px solid #e2e8f0', boxShadow: '4px 0 6px -1px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="p-2 rounded-lg transition-colors" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                <Shield className="h-6 w-6" style={{ color: '#3b82f6' }} />
              </div>
              <span className="text-lg font-bold" style={{ color: '#0f172a' }}>ComplianceCP</span>
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
                  className="sidebar-link"
                  style={isActive ? {
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    boxShadow: '0 4px 12px -2px rgba(59, 130, 246, 0.4)'
                  } : {
                    color: '#64748b'
                  }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="p-4" style={{ borderTop: '1px solid #e2e8f0' }}>
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="h-10 w-10 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
              >
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#0f172a' }}>
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs truncate" style={{ color: '#64748b' }}>
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
          className="sticky top-0 z-30"
          style={{ 
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid #e2e8f0'
          }}
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
              
              {/* Search bar */}
              <div 
                className="hidden md:flex items-center gap-2 rounded-lg px-3 py-2 w-64 lg:w-80"
                style={{ background: '#f1f5f9' }}
              >
                <Search className="h-4 w-4" style={{ color: '#94a3b8' }} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-sm w-full"
                  style={{ color: '#0f172a' }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" style={{ color: '#64748b' }} />
                <span 
                  className="absolute top-1 right-1 h-2 w-2 rounded-full animate-pulse"
                  style={{ background: '#ef4444' }}
                />
              </Button>
              
              {/* User avatar for mobile */}
              <div className="lg:hidden">
                <div 
                  className="h-8 w-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
                >
                  <User className="h-4 w-4 text-white" />
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
        <footer style={{ borderTop: '1px solid #e2e8f0' }} className="py-4 px-6">
          <p className="text-xs text-center" style={{ color: '#94a3b8' }}>
            © 2026 ComplianceCheckpoint. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}