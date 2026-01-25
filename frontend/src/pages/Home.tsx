import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from '@neondatabase/neon-js/auth/react/ui';
import { DashboardPage } from './dashboard/DashboardPage';
import { Layout } from '@/components/layout/Layout';

export function Home() {
  return (
    <>
      <SignedIn>
        <Layout>
          <DashboardPage />
        </Layout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
