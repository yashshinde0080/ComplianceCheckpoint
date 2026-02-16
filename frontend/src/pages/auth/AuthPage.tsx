import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/app/providers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { MagicBentoCard } from '@/components/ui/MagicBento'
import { useToast } from '@/hooks/use-toast'

// Validation Schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
})

type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>

export function AuthPage() {
  const location = useLocation()
  const isRegister = location.pathname === '/register'
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { login, register: registerUser } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  // Register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
    }
  })

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      })
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.detail || 'Invalid credentials. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        role: 'Founder',
      })
      toast({
        title: 'Account created!',
        description: 'Welcome to ComplianceCheckpoint. You can now log in.',
      })
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.detail || 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    'SOC 2 Type II Compliance',
    'ISO 27001 Ready',
    'GDPR Framework Support',
    'Real-time Monitoring',
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#060010]"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full opacity-10 animate-pulse"
            style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 rounded-full opacity-10 animate-pulse"
            style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)', animationDelay: '1s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-xl bg-white/5 border border-white/10 shadow-glow-sm"
            >
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground tracking-tight">ComplianceCheckpoint</span>
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground leading-tight">
                Enterprise Compliance<br />
                <span className="text-primary">Made Simple</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Streamline your compliance journey with our intelligent platform.
                Track controls, manage evidence, and achieve certifications faster.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className="p-1.5 rounded-full bg-primary/20"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Trusted by 500+ companies worldwide</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div
        className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background"
      >
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="inline-flex items-center gap-3 mb-8">
              <div
                className="p-3 rounded-xl bg-primary/10"
              >
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">ComplianceCheckpoint</span>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-muted-foreground">
              {isRegister
                ? 'Start your compliance journey in minutes'
                : 'Log in to access your compliance dashboard'}
            </p>
          </div>

          <MagicBentoCard
            className="magic-bento-card--border-glow shadow-2xl"
            spotlightColor="132, 0, 255"
          >
            <div className="relative z-30 p-8 space-y-6">
              {isRegister ? (
                // Register Form
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-sm font-medium text-foreground/80">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="full_name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10 h-12 text-base bg-secondary border-border rounded-xl text-foreground placeholder:text-muted-foreground"
                        {...registerForm.register('full_name')}
                      />
                    </div>
                    {registerForm.formState.errors.full_name && (
                      <p className="text-xs font-bold text-destructive mt-1">
                        {registerForm.formState.errors.full_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        className="pl-10 h-12 text-base bg-secondary border-border rounded-xl text-foreground placeholder:text-muted-foreground"
                        {...registerForm.register('email')}
                      />
                    </div>
                    {registerForm.formState.errors.email && (
                      <p className="text-sm" style={{ color: '#ef4444' }}>
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground/80">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-12 text-base bg-secondary border-border rounded-xl text-foreground placeholder:text-muted-foreground"
                        {...registerForm.register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" style={{ color: '#9ca3af' }} />
                        ) : (
                          <Eye className="h-5 w-5" style={{ color: '#9ca3af' }} />
                        )}
                      </button>
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-sm" style={{ color: '#ef4444' }}>
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password" className="text-sm font-medium text-foreground/80">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirm_password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-12 text-base bg-secondary border-border rounded-xl text-foreground placeholder:text-muted-foreground"
                        {...registerForm.register('confirm_password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-muted-foreground/60" />
                        ) : (
                          <Eye className="h-5 w-5 text-muted-foreground/60" />
                        )}
                      </button>
                    </div>
                    {registerForm.formState.errors.confirm_password && (
                      <p className="text-xs font-bold text-destructive mt-1">
                        {registerForm.formState.errors.confirm_password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-glow transition-all hover-lift"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Create Account
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </span>
                    )}
                  </Button>
                </form>
              ) : (
                // Login Form
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        className="pl-10 h-12 text-base bg-secondary border-border rounded-xl text-foreground placeholder:text-muted-foreground"
                        {...loginForm.register('email')}
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-sm" style={{ color: '#ef4444' }}>
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-foreground/80">
                        Password
                      </Label>
                      <a
                        href="#"
                        className="text-sm font-medium transition-colors hover:underline text-primary"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-12 text-base bg-secondary border-border rounded-xl text-foreground placeholder:text-muted-foreground"
                        {...loginForm.register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" style={{ color: '#9ca3af' }} />
                        ) : (
                          <Eye className="h-5 w-5" style={{ color: '#9ca3af' }} />
                        )}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm" style={{ color: '#ef4444' }}>
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium group"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      borderRadius: '0.75rem',
                      boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.4)'
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Sign In
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </span>
                    )}
                  </Button>
                </form>
              )}

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                  </span>
                </div>
              </div>

              {/* Switch Auth Mode */}
              <Link
                to={isRegister ? '/login' : '/register'}
                className="flex items-center justify-center gap-2 w-full h-12 rounded-xl text-base font-medium transition-all hover:bg-white/5 border border-border text-foreground"
              >
                {isRegister ? 'Sign in instead' : 'Create an account'}
              </Link>
            </div>
          </MagicBentoCard>

          {/* Terms */}
          <p className="text-center text-sm text-muted-foreground/60 mt-8 leading-relaxed">
            By continuing, you agree to our{' '}
            <a href="#" className="font-bold text-foreground/80 hover:text-primary transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="font-bold text-foreground/80 hover:text-primary transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
