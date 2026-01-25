import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { api, authApi } from '@/lib/api'
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
        authLogger.info('Found stored token, validating...')
        setToken(storedToken)
        
        try {
          // Verify token and get user info
          const response = await authApi.me()
          setUser(response.data)
          authLogger.success(`Session restored for: ${response.data.email}`)
          authLogger.state('user', { id: response.data.id, email: response.data.email, role: response.data.role })
        } catch (error) {
          // Token is invalid, clean up
          authLogger.warn('Token validation failed - clearing session')
          localStorage.removeItem('token')
          setToken(null)
        }
      } else {
        authLogger.info('No stored token found')
      }
      
      setIsLoading(false)
      authLogger.state('isLoading', false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    authLogger.auth(`Logging in: ${email}`)
    
    const response = await authApi.login(email, password)
    const { access_token } = response.data

    // Store token
    localStorage.setItem('token', access_token)
    setToken(access_token)
    authLogger.success('Token received and stored')

    // Get user info
    const userResponse = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    })
    setUser(userResponse.data)
    
    authLogger.success(`Login successful: ${userResponse.data.email}`)
    authLogger.state('user', { 
      id: userResponse.data.id, 
      email: userResponse.data.email, 
      role: userResponse.data.role 
    })
  }

  const register = async (data: RegisterData) => {
    authLogger.auth(`Registering new user: ${data.email}`)
    
    // Register user
    await api.post('/auth/register', data)
    authLogger.success('Registration successful')
    
    // Auto-login after registration
    authLogger.info('Auto-logging in after registration...')
    await login(data.email, data.password)
  }

  const logout = () => {
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
