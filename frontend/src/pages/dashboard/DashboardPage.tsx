import { PageHeader } from '@/components/layout/PageHeader'
import { useQuery } from '@tanstack/react-query'
import { organizationApi, controlsApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/common/PageStates'
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
import { MagicBentoCard } from '@/components/ui/MagicBento'

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[140px] rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-[200px] rounded-2xl lg:col-span-2" />
        <Skeleton className="h-[200px] rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[300px] rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

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
    return <DashboardSkeleton />
  }

  const statusPanels = [
    {
      key: 'Not Started',
      icon: AlertCircle,
      iconClass: 'text-muted-foreground',
      wrapClass: 'bg-muted',
    },
    {
      key: 'In Progress',
      icon: Clock,
      iconClass: 'text-blue-500',
      wrapClass: 'bg-blue-500/10',
    },
    {
      key: 'Completed',
      icon: CheckCircle2,
      iconClass: 'text-green-500',
      wrapClass: 'bg-green-500/10',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader title="Dashboard" subtitle="Your compliance readiness overview" />
        {(!controls || controls.length === 0) && (
          <Button onClick={handleSeedControls} className="btn-gradient shadow-lg">
            <Shield className="mr-2 h-4 w-4" />
            Initialize Control Library
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Row 1: Key Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat, index) => (
            <MagicBentoCard
              key={stat.title}
              className={cn(
                'animate-fade-in magic-bento-card--border-glow min-h-[140px] shadow-none',
                stat.bgGradient
              )}
              style={{ animationDelay: `${index * 80}ms` }}
              spotlightColor="132, 0, 255"
            >
              <div className="flex h-full items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{stat.value}</p>
                  {stat.description && (
                    <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
                  )}
                </div>
                <div className={cn('shrink-0 rounded-xl p-3', stat.gradient)}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </MagicBentoCard>
          ))}
        </div>

        {/* Row 2: Progress & Quick Actions */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Overall Compliance Progress</CardTitle>
              <CardDescription>Based on completed tasks and uploaded evidence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Completion</span>
                <span className="text-lg font-bold text-foreground">{completionPercentage}%</span>
              </div>
              <div className="progress-bar h-3 overflow-hidden rounded-full border border-white/5 bg-white/10">
                <div
                  className="progress-bar-fill bg-gradient-to-r from-primary/60 via-primary to-primary shadow-glow-sm transition-all duration-1000"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>Target: 100%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              <CardDescription>Common management tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="btn-gradient w-full justify-start">
                <Link to="/policies">
                  <FileText className="mr-2 h-4 w-4" />
                  Policies
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link to="/evidence">
                  <Upload className="mr-2 h-4 w-4" />
                  Evidence
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link to="/tasks">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Tasks
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Row 3: Control status overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {statusPanels.map((panel) => (
            <Card key={panel.key} className="flex min-h-[300px] flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base font-semibold">
                  <span className={cn('mr-3 rounded-lg p-1.5', panel.wrapClass)}>
                    <panel.icon className={cn('h-4 w-4', panel.iconClass)} />
                  </span>
                  {panel.key}
                </CardTitle>
                <CardDescription className="text-xs">
                  {controlsByStatus[panel.key]?.length || 0} controls
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="max-h-52 space-y-2 overflow-y-auto">
                  {controlsByStatus[panel.key]?.slice(0, 4).map((control: any) => (
                    <Link
                      key={control.id}
                      to={`/controls/${control.id}`}
                      className="flex items-center gap-2 rounded-lg p-2 text-xs transition-colors hover:bg-white/5"
                    >
                      <span className="shrink-0 font-medium text-foreground">
                        {control.control_code}
                      </span>
                      <span className="min-w-0 truncate text-muted-foreground">
                        {control.title}
                      </span>
                    </Link>
                  ))}
                  {(controlsByStatus[panel.key]?.length || 0) === 0 && (
                    <p className="py-4 text-center text-xs text-muted-foreground">
                      No controls
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
