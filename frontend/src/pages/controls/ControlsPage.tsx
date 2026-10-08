import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { controlsApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { EmptyState, ErrorState, PageSkeleton } from '@/components/common/PageStates'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, ChevronRight, FileText, Upload, Shield } from 'lucide-react'
import { cn, getStatusColor, getSeverityColor } from '@/lib/utils'

export function ControlsPage() {
  const [search, setSearch] = useState('')
  const [frameworkFilter, setFrameworkFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data: controls, isLoading, isError, refetch } = useQuery({
    queryKey: ['controls', frameworkFilter],
    queryFn: async () => {
      const params: any = {}
      if (frameworkFilter !== 'all') {
        params.framework = frameworkFilter
      }
      const response = await controlsApi.list(params)
      return response.data
    },
  })

  const filteredControls = controls?.filter((control: any) => {
    const matchesSearch =
      control.control_code.toLowerCase().includes(search.toLowerCase()) ||
      control.title.toLowerCase().includes(search.toLowerCase()) ||
      control.description.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || control.completion_status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Group controls by category
  const groupedControls = filteredControls?.reduce((acc: any, control: any) => {
    const category = control.category || 'Uncategorized'
    if (!acc[category]) acc[category] = []
    acc[category].push(control)
    return acc
  }, {})

  const hasControls = (controls?.length ?? 0) > 0
  const hasResults = (filteredControls?.length ?? 0) > 0

  if (isLoading) {
    return <PageSkeleton count={4} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Control Library" subtitle="Browse and manage compliance controls" />

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search controls..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
            <Select value={frameworkFilter} onValueChange={setFrameworkFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frameworks</SelectItem>
                <SelectItem value="SOC 2">SOC 2</SelectItem>
                <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                <SelectItem value="GDPR">GDPR</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Controls */}
      {isError ? (
        <ErrorState
          title="Unable to load controls"
          description="We couldn't retrieve the control library right now. Please try again."
          onRetry={() => refetch()}
        />
      ) : !hasControls ? (
        <EmptyState
          icon={Shield}
          title="No controls yet"
          description="Initialize the control library from the dashboard to start building your compliance program."
        />
      ) : !hasResults ? (
        <EmptyState
          icon={Search}
          title="No matching controls"
          description="Try adjusting your search, framework or status filters."
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedControls!).map(([category, categoryControls]: [string, any], index) => (
            <Card key={category} className="animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
              <CardHeader className="border-b border-border/60">
                <CardTitle className="text-base font-semibold">{category}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {categoryControls.map((control: any) => (
                    <Link
                      key={control.id}
                      to={`/controls/${control.id}`}
                      className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-white/5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-medium text-primary">
                            {control.control_code}
                          </span>
                          <Badge className={cn(getSeverityColor(control.severity), 'text-xs')}>
                            {control.severity}
                          </Badge>
                          <Badge className={cn(getStatusColor(control.completion_status), 'text-xs')}>
                            {control.completion_status}
                          </Badge>
                        </div>
                        <h3 className="mt-1.5 truncate font-medium text-foreground">
                          {control.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {control.description}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Upload className="mr-1 h-3 w-3" />
                            {control.evidence_count} evidence
                          </span>
                          <span className="flex items-center">
                            <FileText className="mr-1 h-3 w-3" />
                            {control.task_count} tasks
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
