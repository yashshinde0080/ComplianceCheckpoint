import { useQuery } from '@tanstack/react-query'
import { organizationApi, controlsApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Shield, 
  FileText, 
  Upload, 
  CheckSquare, 
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

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
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/5',
    },
    {
      title: 'Policies',
      value: `${stats?.approved_policies || 0}/${stats?.total_policies || 0}`,
      description: 'Approved',
      icon: FileText,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-500/10 to-emerald-600/5',
    },
    {
      title: 'Evidence Items',
      value: stats?.total_evidence || 0,
      icon: Upload,
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-500/10 to-violet-600/5',
    },
    {
      title: 'Tasks',
      value: `${stats?.completed_tasks || 0}/${stats?.total_tasks || 0}`,
      description: 'Completed',
      icon: CheckSquare,
      gradient: 'from-orange-500 to-amber-600',
      bgGradient: 'from-orange-500/10 to-amber-600/5',
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={stat.title} className={`metric-card hover-lift animate-fade-in bg-gradient-to-br ${stat.bgGradient}`} style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1 text-foreground">{stat.value}</p>
                  {stat.description && (
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  )}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Card */}
      <Card className="animate-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className="p-2 rounded-lg bg-primary/10 mr-3">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            Overall Compliance Progress
          </CardTitle>
          <CardDescription>
            Based on completed tasks and uploaded evidence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Completion</span>
              <span className="text-lg font-bold text-foreground">{completionPercentage}%</span>
            </div>
            <div className="progress-bar h-3">
              <div
                className="progress-bar-fill bg-gradient-to-r from-primary to-primary/70"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>Target: 100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Control Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Not Started */}
        <Card className="animate-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <div className="p-2 rounded-lg bg-muted mr-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              Not Started
            </CardTitle>
            <CardDescription>
              {controlsByStatus['Not Started']?.length || 0} controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {controlsByStatus['Not Started']?.slice(0, 5).map((control: any) => (
                <Link
                  key={control.id}
                  to={`/controls/${control.id}`}
                  className="block p-3 rounded-lg hover:bg-muted/50 text-sm transition-colors group"
                >
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">{control.control_code}</span>
                  <span className="text-muted-foreground ml-2 truncate">{control.title}</span>
                </Link>
              ))}
              {(controlsByStatus['Not Started']?.length || 0) > 5 && (
                <Link to="/controls" className="flex items-center gap-1 text-sm text-primary hover:underline mt-2 font-medium">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              )}
              {(controlsByStatus['Not Started']?.length || 0) === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No controls in this status</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card className="animate-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <div className="p-2 rounded-lg bg-blue-500/10 mr-3">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              In Progress
            </CardTitle>
            <CardDescription>
              {controlsByStatus['In Progress']?.length || 0} controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {controlsByStatus['In Progress']?.slice(0, 5).map((control: any) => (
                <Link
                  key={control.id}
                  to={`/controls/${control.id}`}
                  className="block p-3 rounded-lg hover:bg-muted/50 text-sm transition-colors group"
                >
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">{control.control_code}</span>
                  <span className="text-muted-foreground ml-2 truncate">{control.title}</span>
                </Link>
              ))}
              {(controlsByStatus['In Progress']?.length || 0) > 5 && (
                <Link to="/controls" className="flex items-center gap-1 text-sm text-primary hover:underline mt-2 font-medium">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              )}
              {(controlsByStatus['In Progress']?.length || 0) === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No controls in this status</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Completed */}
        <Card className="animate-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <div className="p-2 rounded-lg bg-green-500/10 mr-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              Completed
            </CardTitle>
            <CardDescription>
              {controlsByStatus['Completed']?.length || 0} controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {controlsByStatus['Completed']?.slice(0, 5).map((control: any) => (
                <Link
                  key={control.id}
                  to={`/controls/${control.id}`}
                  className="block p-3 rounded-lg hover:bg-muted/50 text-sm transition-colors group"
                >
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">{control.control_code}</span>
                  <span className="text-muted-foreground ml-2 truncate">{control.title}</span>
                </Link>
              ))}
              {(controlsByStatus['Completed']?.length || 0) > 5 && (
                <Link to="/controls" className="flex items-center gap-1 text-sm text-primary hover:underline mt-2 font-medium">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              )}
              {(controlsByStatus['Completed']?.length || 0) === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No controls in this status</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="animate-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="btn-gradient shadow-md hover-lift">
              <Link to="/policies">
                <FileText className="mr-2 h-4 w-4" />
                Generate Policy
              </Link>
            </Button>
            <Button variant="outline" asChild className="hover-lift">
              <Link to="/evidence">
                <Upload className="mr-2 h-4 w-4" />
                Upload Evidence
              </Link>
            </Button>
            <Button variant="outline" asChild className="hover-lift">
              <Link to="/tasks">
                <CheckSquare className="mr-2 h-4 w-4" />
                View Tasks
              </Link>
            </Button>
            <Button variant="outline" asChild className="hover-lift">
              <Link to="/audit">
                <TrendingUp className="mr-2 h-4 w-4" />
                Export Audit Report
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}