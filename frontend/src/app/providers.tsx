import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { api, authApi } from '@/lib/api'

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
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        setToken(storedToken)
        try {
          // Verify token and get user info
          const response = await authApi.me()
          setUser(response.data)
        } catch (error) {
          // Token is invalid, clean up
          console.error('Token validation failed:', error)
          localStorage.removeItem('token')
          setToken(null)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password)
    const { access_token } = response.data

    // Store token
    localStorage.setItem('token', access_token)
    setToken(access_token)

    // Get user info
    const userResponse = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    })
    setUser(userResponse.data)
  }

  const register = async (data: RegisterData) => {
    // Register user
    await api.post('/auth/register', data)
    
    // Auto-login after registration
    await login(data.email, data.password)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
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
