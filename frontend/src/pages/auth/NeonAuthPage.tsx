import { AuthView } from '@neondatabase/neon-js/auth/react/ui';
import { Shield } from 'lucide-react';

export function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 50%, #dbeafe 100%)' }}>
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgba(59, 130, 246, 0.15)' }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgba(59, 130, 246, 0.2)' }} />
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Logo header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl mb-4" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
            <Shield className="h-12 w-12" style={{ color: '#3b82f6' }} />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: '#0f172a' }}>ComplianceCheckpoint</h1>
          <p className="mt-2" style={{ color: '#64748b' }}>Secure compliance management platform</p>
        </div>
        
        {/* Auth card - simplified without interfering CSS */}
        <div 
          className="rounded-xl shadow-xl overflow-hidden animate-fade-in"
          style={{ 
            background: 'white', 
            border: '1px solid #e2e8f0'
          }}
        >
          <AuthView />
        </div>
        
        {/* Footer */}
        <p className="text-center text-xs mt-6 animate-fade-in" style={{ color: '#94a3b8' }}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
