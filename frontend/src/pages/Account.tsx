// This file is deprecated. Use AccountPage.tsx in the account folder instead.
import { Navigate } from 'react-router-dom';

export function Account() {
  return <Navigate to="/account" replace />;
}
