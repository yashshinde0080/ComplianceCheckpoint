// This file is deprecated. Use AuthPage.tsx instead.
import { Navigate } from 'react-router-dom';

export function NeonAuthPage() {
  return <Navigate to="/login" replace />;
}
