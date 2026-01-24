import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'

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
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/me')
          setUser(response.data)
        } catch {
          localStorage.removeItem('token')
          setToken(null)
        }
      }
      setIsLoading(false)
    }
    initAuth()
  }, [token])

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    const { access_token } = response.data
    localStorage.setItem('token', access_token)
    setToken(access_token)
    
    const userResponse = await api.get('/auth/me')
    setUser(userResponse.data)
    navigate('/dashboard')
  }

  const register = async (data: RegisterData) => {
    await api.post('/auth/register', data)
    await login(data.email, data.password)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    navigate('/login')
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