import { useQuery } from '@tanstack/react-query'
import { organizationApi, controlsApi } from '@/lib/api'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Shield,
  FileText,
  Upload,
  CheckSquare,
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { MagicBentoCard, MagicBentoGrid } from '@/components/ui/MagicBento'

export function DashboardPage() {
  const { toast } = useToast()

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['organization-stats'],
    queryFn: async () => {
      const response = await organizationApi.getStats()
      return response.data
    },
  })

  const { data: controls, isLoading: controlsLoading } = useQuery({
    queryKey: ['controls'],
    queryFn: async () => {
      const response = await controlsApi.list()
      return response.data
    },
  })

  const handleSeedControls = async () => {
    try {
      await controlsApi.seed()
      toast({
        title: 'Controls seeded',
        description: 'SOC 2, ISO 27001, and GDPR controls have been added.',
      })
      window.location.reload()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to seed controls',
        variant: 'destructive',
      })
    }
  }

  const statCards = [
    {
      title: 'Total Controls',
      value: stats?.total_controls || 0,
      icon: Shield,
      gradient: 'bg-primary shadow-glow',
      bgGradient: 'bg-primary/5 border-primary/20',
    },
    {
      title: 'Policies',
      value: `${stats?.approved_policies || 0}/${stats?.total_policies || 0}`,
      description: 'Approved',
      icon: FileText,
      gradient: 'bg-success shadow-glow-sm',
      bgGradient: 'bg-success/5 border-success/20',
    },
    {
      title: 'Evidence Items',
      value: stats?.total_evidence || 0,
      icon: Upload,
      gradient: 'bg-primary shadow-glow-sm opacity-80',
      bgGradient: 'bg-primary/5 border-primary/20',
    },
    {
      title: 'Tasks',
      value: `${stats?.completed_tasks || 0}/${stats?.total_tasks || 0}`,
      description: 'Completed',
      icon: CheckSquare,
      gradient: 'bg-warning shadow-glow-sm',
      bgGradient: 'bg-warning/5 border-warning/20',
    },
  ]

  const completionPercentage = stats?.completion_percentage || 0

  // Group controls by completion status
  const controlsByStatus = controls?.reduce((acc: any, control: any) => {
    const status = control.completion_status
    if (!acc[status]) acc[status] = []
    acc[status].push(control)
    return acc
  }, {}) || {}

  if (statsLoading || controlsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner h-10 w-10"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Your compliance readiness overview</p>
        </div>
        {(!controls || controls.length === 0) && (
          <Button onClick={handleSeedControls} className="btn-gradient shadow-lg">
            <Shield className="mr-2 h-4 w-4" />
            Initialize Control Library
          </Button>
        )}
      </div>

      <MagicBentoGrid className="card-grid">
        {/* Row 1: Key Metrics */}
        {statCards.map((stat, index) => (
          <MagicBentoCard
            key={stat.title}
            className={cn("animate-fade-in magic-bento-card--border-glow shadow-none min-h-[140px]", stat.bgGradient)}
            style={{ animationDelay: `${index * 100}ms` }}
            spotlightColor="132, 0, 255"
            label={stat.title === 'Analytics' ? 'Real-time' : undefined}
          >
            <CardContent className="pt-2 relative z-30 h-full">
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1 text-foreground">{stat.value}</p>
                  {stat.description && (
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  )}
                </div>
                <div className={cn("p-3 rounded-xl", stat.gradient)}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </MagicBentoCard>
        ))}

        {/* Row 2: Hero Progress & Sidebar Actions */}
        <MagicBentoCard
          className="lg:col-span-3 animate-card magic-bento-card--border-glow"
          spotlightColor="132, 0, 255"
          title="Overall Compliance Progress"
          description="Based on completed tasks and uploaded evidence"
        >
          <CardContent className="relative z-30 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Completion</span>
                <span className="text-lg font-bold text-foreground">{completionPercentage}%</span>
              </div>
              <div className="progress-bar h-3 bg-white/10 border border-white/5 rounded-full overflow-hidden">
                <div
                  className="progress-bar-fill bg-gradient-to-r from-white/20 via-white/50 to-white shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-1000"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>Target: 100%</span>
              </div>
            </div>
          </CardContent>
        </MagicBentoCard>

        <MagicBentoCard className="lg:col-span-1 animate-card magic-bento-card--border-glow" spotlightColor="132, 0, 255">
          <CardHeader className="relative z-30">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription className="text-xs text-muted-foreground/60 truncate">Common management tasks</CardDescription>
          </CardHeader>
          <CardContent className="relative z-30 space-y-3 pt-2">
            <Button asChild className="w-full btn-gradient shadow-md hover-lift justify-start h-9 text-xs">
              <Link to="/policies">
                <FileText className="mr-2 h-3 w-3" />
                Policies
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full hover-lift border-white/10 hover:bg-white/5 justify-start h-9 text-xs">
              <Link to="/evidence">
                <Upload className="mr-2 h-3 w-3" />
                Evidence
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full hover-lift border-white/10 hover:bg-white/5 justify-start h-9 text-xs">
              <Link to="/tasks">
                <CheckSquare className="mr-2 h-3 w-3" />
                Tasks
              </Link>
            </Button>
          </CardContent>
        </MagicBentoCard>

        {/* Row 3: Comprehensive Control Status Overview */}
        <div className="lg:col-span-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Not Started */}
          <MagicBentoCard className="animate-card magic-bento-card--border-glow min-h-[320px] flex flex-col" spotlightColor="132, 0, 255">
            <CardHeader className="pb-3 relative z-30">
              <CardTitle className="text-base flex items-center">
                <div className="p-1.5 rounded-lg bg-muted mr-3">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </div>
                Not Started
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground/60">
                {controlsByStatus['Not Started']?.length || 0} controls
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-30 flex-1">
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {controlsByStatus['Not Started']?.slice(0, 4).map((control: any) => (
                  <Link key={control.id} to={`/controls/${control.id}`} className="block p-2 rounded-lg hover:bg-white/5 text-xs transition-colors group">
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">{control.control_code}</span>
                    <span className="text-muted-foreground/60 ml-2 truncate inline-block max-w-[150px] align-bottom">{control.title}</span>
                  </Link>
                ))}
                {(controlsByStatus['Not Started']?.length || 0) === 0 && (
                  <p className="text-xs text-muted-foreground/60 text-center py-4">No controls</p>
                )}
              </div>
            </CardContent>
          </MagicBentoCard>

          {/* In Progress */}
          <MagicBentoCard className="animate-card magic-bento-card--border-glow min-h-[320px] flex flex-col" spotlightColor="132, 0, 255">
            <CardHeader className="pb-3 relative z-30">
              <CardTitle className="text-base flex items-center">
                <div className="p-1.5 rounded-lg bg-blue-500/10 mr-3">
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
                In Progress
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground/60">
                {controlsByStatus['In Progress']?.length || 0} controls
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-30 flex-1">
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {controlsByStatus['In Progress']?.slice(0, 4).map((control: any) => (
                  <Link key={control.id} to={`/controls/${control.id}`} className="block p-2 rounded-lg hover:bg-white/5 text-xs transition-colors group">
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">{control.control_code}</span>
                    <span className="text-muted-foreground/60 ml-2 truncate inline-block max-w-[150px] align-bottom">{control.title}</span>
                  </Link>
                ))}
                {(controlsByStatus['In Progress']?.length || 0) === 0 && (
                  <p className="text-xs text-muted-foreground/60 text-center py-4">No controls</p>
                )}
              </div>
            </CardContent>
          </MagicBentoCard>

          {/* Completed */}
          <MagicBentoCard className="animate-card magic-bento-card--border-glow min-h-[320px] flex flex-col" spotlightColor="132, 0, 255">
            <CardHeader className="pb-3 relative z-30">
              <CardTitle className="text-base flex items-center">
                <div className="p-1.5 rounded-lg bg-green-500/10 mr-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                Completed
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground/60">
                {controlsByStatus['Completed']?.length || 0} controls
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-30 flex-1">
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {controlsByStatus['Completed']?.slice(0, 4).map((control: any) => (
                  <Link key={control.id} to={`/controls/${control.id}`} className="block p-2 rounded-lg hover:bg-white/5 text-xs transition-colors group">
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">{control.control_code}</span>
                    <span className="text-muted-foreground/60 ml-2 truncate inline-block max-w-[150px] align-bottom">{control.title}</span>
                  </Link>
                ))}
                {(controlsByStatus['Completed']?.length || 0) === 0 && (
                  <p className="text-xs text-muted-foreground/60 text-center py-4">No controls</p>
                )}
              </div>
            </CardContent>
          </MagicBentoCard>
        </div>
      </MagicBentoGrid>
    </div>
  )
}