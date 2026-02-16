import { useAuth } from '@/app/providers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { MagicBentoCard } from '@/components/ui/MagicBento';
import { User, Mail, Shield, Building, Key, Settings, ExternalLink } from 'lucide-react';

export function AccountPage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Account Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your compliance profile and security preferences
        </p>
      </div>

      {/* Profile & Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <MagicBentoCard
          className="lg:col-span-2 magic-bento-card--border-glow border-white/5"
          spotlightColor="132, 0, 255"
        >
          <div className="relative z-30 p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <div
                className="h-24 w-24 rounded-2xl flex items-center justify-center border border-primary/20 bg-primary/10 shadow-lg shadow-primary/20"
              >
                <User className="h-12 w-12 text-primary" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-foreground">
                  {user?.full_name || 'Compliance Officer'}
                </h2>
                <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                  <Shield className="h-4 w-4 text-primary/60" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {user?.role || 'Administrator'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <Mail className="h-3 w-3 text-primary" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-white/5 border-white/10 text-muted-foreground/60 focus:ring-primary h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <User className="h-3 w-3 text-primary" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={user?.full_name || ''}
                  disabled={!isEditing}
                  className={`${isEditing ? 'bg-white/5 border-primary/40' : 'bg-white/5 border-white/10'} text-foreground h-11 transition-all`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <Shield className="h-3 w-3 text-primary" />
                  Access Level
                </Label>
                <Input
                  id="role"
                  value={user?.role || ''}
                  disabled
                  className="bg-white/5 border-white/10 text-muted-foreground/60 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="org" className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <Building className="h-3 w-3 text-primary" />
                  Organization
                </Label>
                <Input
                  id="org"
                  value={user?.organization_id?.toString() || 'Compliance Unit #1'}
                  disabled
                  className="bg-white/5 border-white/10 text-muted-foreground/60 h-11"
                />
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              {isEditing ? (
                <>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-white/10 hover:bg-white/5 px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    className="btn-gradient shadow-lg px-8"
                  >
                    Save Profile
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-white/10 hover:bg-white/5 group px-6"
                >
                  <Settings className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </MagicBentoCard>

        {/* Info/Security Column */}
        <div className="space-y-6">
          <MagicBentoCard className="magic-bento-card--border-glow border-white/5 bg-secondary/10 min-h-[280px] flex flex-col" spotlightColor="132, 0, 255">
            <div className="relative z-30 p-6 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Security
                </h3>
              </div>
              <p className="text-sm text-muted-foreground/60 mb-6 leading-relaxed flex-1">
                Update your authentication credentials and manage authorized sessions.
              </p>
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 h-11 transition-all">
                Change Password
              </Button>
            </div>
          </MagicBentoCard>

          <MagicBentoCard className="magic-bento-card--border-glow border-white/5 overflow-hidden min-h-[280px] flex flex-col" spotlightColor="132, 0, 255">
            <div className="relative z-30 p-6 space-y-4 flex flex-col h-full">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-amber-500/80" />
                Quick Actions
              </h3>
              <div className="space-y-2 flex-1">
                {[
                  'Compliance Documentation',
                  'Auditor Access Portal',
                  'Activity Logs'
                ].map((action, i) => (
                  <button
                    key={i}
                    className="w-full text-left p-3 rounded-lg bg-white/[0.02] border border-white/5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 hover:border-white/10 transition-all flex justify-between items-center group"
                  >
                    {action}
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </MagicBentoCard>
        </div>
      </div>
    </div>
  );
}
