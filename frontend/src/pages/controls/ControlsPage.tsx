import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { controlsApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter, ChevronRight, FileText, Upload } from 'lucide-react'
import { cn, getStatusColor, getSeverityColor } from '@/lib/utils'

export function ControlsPage() {
  const [search, setSearch] = useState('')
  const [frameworkFilter, setFrameworkFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data: controls, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Control Library</h1>
        <p className="text-gray-500">Browse and manage compliance controls</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search controls..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={frameworkFilter} onValueChange={setFrameworkFilter}>
              <SelectTrigger className="w-full md:w-48">
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
              <SelectTrigger className="w-full md:w-48">
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
        </CardContent>
      </Card>

      {/* Controls List */}
      {groupedControls && Object.keys(groupedControls).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedControls).map(([category, categoryControls]: [string, any]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {categoryControls.map((control: any) => (
                    <Link
                      key={control.id}
                      to={`/controls/${control.id}`}
                      className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
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
                        <h3 className="mt-1 font-medium text-gray-900 truncate">
                          {control.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {control.description}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center">
                            <Upload className="h-3 w-3 mr-1" />
                            {control.evidence_count} evidence
                          </span>
                          <span className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {control.task_count} tasks
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No controls found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}