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
  CheckCircle2
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
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Policies',
      value: `${stats?.approved_policies || 0}/${stats?.total_policies || 0}`,
      description: 'Approved',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Evidence Items',
      value: stats?.total_evidence || 0,
      icon: Upload,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Tasks',
      value: `${stats?.completed_tasks || 0}/${stats?.total_tasks || 0}`,
      description: 'Completed',
      icon: CheckSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Your compliance readiness overview</p>
        </div>
        {(!controls || controls.length === 0) && (
          <Button onClick={handleSeedControls}>
            <Shield className="mr-2 h-4 w-4" />
            Initialize Control Library
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  {stat.description && (
                    <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                  )}
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Overall Compliance Progress
          </CardTitle>
          <CardDescription>
            Based on completed tasks and uploaded evidence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completion</span>
              <span className="text-sm font-bold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-primary h-4 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Control Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Not Started */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-gray-400" />
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
                  className="block p-2 rounded hover:bg-gray-50 text-sm"
                >
                  <span className="font-medium text-gray-700">{control.control_code}</span>
                  <span className="text-gray-500 ml-2 truncate">{control.title}</span>
                </Link>
              ))}
              {(controlsByStatus['Not Started']?.length || 0) > 5 && (
                <Link to="/controls" className="block text-sm text-primary hover:underline mt-2">
                  View all →
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
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
                  className="block p-2 rounded hover:bg-gray-50 text-sm"
                >
                  <span className="font-medium text-gray-700">{control.control_code}</span>
                  <span className="text-gray-500 ml-2 truncate">{control.title}</span>
                </Link>
              ))}
              {(controlsByStatus['In Progress']?.length || 0) > 5 && (
                <Link to="/controls" className="block text-sm text-primary hover:underline mt-2">
                  View all →
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Completed */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
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
                  className="block p-2 rounded hover:bg-gray-50 text-sm"
                >
                  <span className="font-medium text-gray-700">{control.control_code}</span>
                  <span className="text-gray-500 ml-2 truncate">{control.title}</span>
                </Link>
              ))}
              {(controlsByStatus['Completed']?.length || 0) > 5 && (
                <Link to="/controls" className="block text-sm text-primary hover:underline mt-2">
                  View all →
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link to="/policies">
                <FileText className="mr-2 h-4 w-4" />
                Generate Policy
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/evidence">
                <Upload className="mr-2 h-4 w-4" />
                Upload Evidence
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/tasks">
                <CheckSquare className="mr-2 h-4 w-4" />
                View Tasks
              </Link>
            </Button>
            <Button variant="outline" asChild>
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