import { AccountView } from '@neondatabase/neon-js/auth/react/ui';

export function AccountPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        <AccountView />
      </div>
    </div>
  );
}
