import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { authLogger } from '@/lib/logger'
import { authClient } from '@/lib/auth'

interface User {
  id: number
  email: string
  full_name: string
  role: string
  organization_id: number | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  isLoading: boolean
}

interface RegisterData {
  email: string
  password: string
  full_name: string
  role?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      authLogger.info('Initializing authentication...')
      try {
        // Restore session from Neon
        // @ts-expect-error - SDK type mismatch
        const session = await authClient.getSession();
        if (session) {
          // @ts-expect-error - SDK type mismatch
          const token = await session.getToken();
          setToken(token);

          // Fetch user details from backend (using api interceptor which now has token)
          // But we can also set header explicitly to be safe
          const userResponse = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(userResponse.data);
          authLogger.success(`Session restored for: ${userResponse.data.email}`);
        }
      } catch (e) {
        // Session restore failed or no session
      }
      
      setIsLoading(false)
      authLogger.state('isLoading', false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    authLogger.auth(`Logging in: ${email}`)
    
    // Neon Login
    const result = await authClient.signInWithEmail(email, password);

    // If success, get token
    const token = await result.session?.getToken();
    const validToken = token || (result as any).access_token;

    if (validToken) {
        setToken(validToken);
        authLogger.success('Token received from Neon')

        // Get user info from OUR backend
        const userResponse = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${validToken}` }
        })
        setUser(userResponse.data)

        authLogger.success(`Login successful`)
        // Redact user details in log
        authLogger.state('user', '[Redacted]')
    }
  }

  const register = async (data: RegisterData) => {
    authLogger.auth(`Registering new user: ${data.email}`)
    
    // Neon Register
    await authClient.signUpWithEmail(data.email, data.password, {
        full_name: data.full_name
    });

    authLogger.success('Registration successful (Neon)')
    
    // Sync with local backend is handled by login flow usually,
    // or we call a sync endpoint.
    // For now, let's auto-login.
    authLogger.info('Auto-logging in after registration...')
    await login(data.email, data.password)
  }

  const logout = async () => {
    authLogger.auth('Logging out...')
    await authClient.signOut();
    setToken(null)
    setUser(null)
    authLogger.success('Logged out successfully')
    authLogger.state('user', null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
