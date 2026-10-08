import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/app/providers'
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
import { routerLogger } from '@/lib/logger'
import { useEffect } from 'react'

// Loading spinner component
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f1f5f9' }}>
      <div className="text-center">
        <div
          className="inline-block h-12 w-12 border-4 rounded-full animate-spin mb-4"
          style={{
            borderColor: 'rgba(59, 130, 246, 0.2)',
            borderTopColor: '#3b82f6'
          }}
        />
        <p style={{ color: '#64748b' }}>Loading...</p>
      </div>
    </div>
  )
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        routerLogger.nav(location.pathname, 'accessed private route')
      } else {
        routerLogger.nav('/app/login', 'redirecting (not authenticated)')
      }
    }
  }, [location.pathname, user, isLoading])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/app/login" replace />
  }

  return <Layout>{children}</Layout>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        routerLogger.nav('/app/dashboard', 'redirecting (already authenticated)')
      } else {
        routerLogger.nav(location.pathname, 'accessed public route')
      }
    }
  }, [location.pathname, user, isLoading])

  if (isLoading) {
    return <LoadingScreen />
  }

if (user) {
        return <Navigate to="/app/dashboard" replace />;
      }

  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/app/login"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />
      <Route
        path="/app/register"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      {/* Private Routes */}
      <Route
        path="/app/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/app/account"
        element={
          <PrivateRoute>
            <AccountPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/app/controls"
        element={
          <PrivateRoute>
            <ControlsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/app/controls/:id"
        element={
          <PrivateRoute>
            <ControlDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/app/policies"
        element={
          <PrivateRoute>
            <PoliciesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/app/policies/:id"
        element={
          <PrivateRoute>
            <PolicyDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/app/evidence"
        element={
          <PrivateRoute>
            <EvidencePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/app/tasks"
        element={
          <PrivateRoute>
            <TasksPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/app/audit"
        element={
          <PrivateRoute>
            <AuditPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/app/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />

      {/* Redirect root to landing_page service */}
      <Route
        path="/"
        element={<Navigate to="/" replace />}
      />

      {/* 404 - redirect to app root */}
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  )
}