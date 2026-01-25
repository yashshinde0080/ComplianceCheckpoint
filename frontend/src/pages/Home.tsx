// This file is deprecated. Use the routes.tsx for routing instead.
// Redirecting to the AuthPage component.
import { Navigate } from 'react-router-dom';

export function Home() {
  return <Navigate to="/dashboard" replace />;
}
