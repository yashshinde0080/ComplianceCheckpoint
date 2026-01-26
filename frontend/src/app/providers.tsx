import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { authApi } from '@/lib/api'
import { authLogger } from '@/lib/logger'

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
      const storedToken = localStorage.getItem('token')
      
      if (storedToken) {
        try {
          // Verify token and get user details
          // Note: api interceptor automatically adds the token from localStorage
          const userResponse = await authApi.me();
          
          setToken(storedToken);
          setUser(userResponse.data);
          authLogger.success(`Session restored for: ${userResponse.data.email}`);
        } catch (e) {
          // Token invalid or expired
          authLogger.error('Session restore failed', e)
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        }
      } else {
         authLogger.info('No session found')
      }
      
      setIsLoading(false)
      authLogger.state('isLoading', false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    authLogger.auth(`Logging in: ${email}`)
    
    try {
      const result = await authApi.login(email, password);
      const { access_token } = result.data;

      if (access_token) {
        localStorage.setItem('token', access_token);
        setToken(access_token);
        authLogger.success('Token received from Backend')

        // Get user info
        const userResponse = await authApi.me()
        setUser(userResponse.data)

        authLogger.success(`Login successful`)
        // Redact user details in log
        authLogger.state('user', '[Redacted]')
      }
    } catch (error) {
      authLogger.error('Login failed', error)
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    authLogger.auth(`Registering new user: ${data.email}`)
    
    try {
      await authApi.register({
        email: data.email,
        password: data.password,
        full_name: data.full_name
      });

      authLogger.success('Registration successful')
      
      authLogger.info('Auto-logging in after registration...')
      await login(data.email, data.password)
    } catch (error) {
      authLogger.error('Registration failed', error)
      throw error
    }
  }

  const logout = async () => {
    authLogger.auth('Logging out...')
    localStorage.removeItem('token')
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
