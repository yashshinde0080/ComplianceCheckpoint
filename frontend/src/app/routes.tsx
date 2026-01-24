import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './providers'
import { Layout } from '@/components/layout/Layout'
import { AuthPage } from '@/pages/auth/AuthPage'
import { AccountPage } from '@/pages/account/AccountPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { ControlsPage } from '@/pages/controls/ControlsPage'
import { ControlDetailPage } from '@/pages/controls/ControlDetailPage'
import { PoliciesPage } from '@/pages/policies/PoliciesPage'
import { PolicyDetailPage } from '@/pages/policies/PolicyDetailPage'
import { EvidencePage } from '@/pages/evidence/EvidencePage'
import { TasksPage } from '@/pages/tasks/TasksPage'
import { AuditPage } from '@/pages/audit/AuditPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'

function LoadingScreen() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)'
      }}
    >
      <div className="relative">
        {/* Outer glow */}
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' }}
        />
        
        {/* Spinner */}
        <div 
          className="relative h-16 w-16 rounded-full animate-spin"
          style={{
            border: '4px solid #e2e8f0',
            borderTopColor: '#3b82f6',
          }}
        />
      </div>
      
      <div className="mt-6 text-center">
        <p 
          className="text-lg font-medium animate-pulse"
          style={{ color: '#3b82f6' }}
        >
          Loading...
        </p>
        <p 
          className="text-sm mt-1"
          style={{ color: '#64748b' }}
        >
          Preparing your compliance dashboard
        </p>
      </div>
    </div>
  )
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Layout>{children}</Layout>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      {/* Private Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/account"
        element={
          <PrivateRoute>
            <AccountPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/controls"
        element={
          <PrivateRoute>
            <ControlsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/controls/:id"
        element={
          <PrivateRoute>
            <ControlDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/policies"
        element={
          <PrivateRoute>
            <PoliciesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/policies/:id"
        element={
          <PrivateRoute>
            <PolicyDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/evidence"
        element={
          <PrivateRoute>
            <EvidencePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <PrivateRoute>
            <TasksPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/audit"
        element={
          <PrivateRoute>
            <AuditPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}