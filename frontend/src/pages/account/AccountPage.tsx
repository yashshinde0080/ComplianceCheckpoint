import { useAuth } from '@/app/providers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { User, Mail, Shield, Building } from 'lucide-react';

export function AccountPage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
          Account Settings
        </h1>
        <p style={{ color: '#64748b' }}>
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Card */}
      <div 
        className="rounded-xl p-6"
        style={{ 
          background: 'white',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div 
            className="h-16 w-16 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
          >
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold" style={{ color: '#0f172a' }}>
              {user?.full_name || 'User'}
            </h2>
            <p className="text-sm" style={{ color: '#64748b' }}>
              {user?.role || 'Member'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" style={{ color: '#64748b' }} />
              Email Address
            </Label>
            <Input
              id="email"
              value={user?.email || ''}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" style={{ color: '#64748b' }} />
              Full Name
            </Label>
            <Input
              id="name"
              value={user?.full_name || ''}
              disabled={!isEditing}
              className={isEditing ? '' : 'bg-gray-50'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-2">
              <Shield className="h-4 w-4" style={{ color: '#64748b' }} />
              Role
            </Label>
            <Input
              id="role"
              value={user?.role || ''}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="org" className="flex items-center gap-2">
              <Building className="h-4 w-4" style={{ color: '#64748b' }} />
              Organization ID
            </Label>
            <Input
              id="org"
              value={user?.organization_id?.toString() || 'Not assigned'}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          {isEditing ? (
            <>
              <Button 
                onClick={() => setIsEditing(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setIsEditing(false)}
                style={{ 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                }}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Security Section */}
      <div 
        className="rounded-xl p-6"
        style={{ 
          background: 'white',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#0f172a' }}>
          Security
        </h3>
        <p className="text-sm mb-4" style={{ color: '#64748b' }}>
          Manage your password and account security settings.
        </p>
        <Button variant="outline">
          Change Password
        </Button>
      </div>
    </div>
  );
}
