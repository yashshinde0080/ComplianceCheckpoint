import { Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@neondatabase/neon-js/auth/react/ui'
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



function PrivateRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>
        <Layout>{children}</Layout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>
        <Navigate to="/dashboard" replace />
      </SignedIn>
      <SignedOut>
        {children}
      </SignedOut>
    </>
  )
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