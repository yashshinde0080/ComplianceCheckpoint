// This file is deprecated. Use AuthPage.tsx in the auth folder instead.
import { Navigate } from 'react-router-dom';

export function Auth() {
  return <Navigate to="/login" replace />;
}
