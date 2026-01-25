import { AccountView } from '@neondatabase/neon-js/auth/react/ui';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

export function Account() {
  const { pathname } = useParams();
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <AccountView pathname={pathname} />
        </div>
      </div>
    </Layout>
  );
}
