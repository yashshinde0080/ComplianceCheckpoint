import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { auditsApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Download, 
  FileText, 
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Info,
  FileArchive
} from 'lucide-react'
import { cn, getStatusColor, formatDateTime } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

const FRAMEWORKS = [
  { id: 1, name: 'SOC 2' },
  { id: 2, name: 'ISO 27001' },
  { id: 3, name: 'GDPR' },
]

export function AuditPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [selectedFramework, setSelectedFramework] = useState('')
  const [exportType, setExportType] = useState('PDF')

  const { data: exports, isLoading } = useQuery({
    queryKey: ['audit-exports'],
    queryFn: async () => {
      const response = await auditsApi.list()
      return response.data
    },
  })

  const exportMutation = useMutation({
    mutationFn: async () => {
      return auditsApi.export({
        framework_id: Number(selectedFramework),
        export_type: exportType,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-exports'] })
      setExportDialogOpen(false)
      setSelectedFramework('')
      toast({
        title: 'Export started',
        description: 'Your audit report is being generated.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Export failed',
        description: error.response?.data?.detail || 'Something went wrong',
        variant: 'destructive',
      })
    },
  })

  const handleDownload = async (exportId: number, fileName: string) => {
    try {
      const response = await auditsApi.download(exportId)
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast({
        title: 'Download started',
        description: 'Your file is being downloaded.',
      })
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Failed to download the export file.',
        variant: 'destructive',
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'Processing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      case 'Failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getFrameworkName = (frameworkId: number) => {
    return FRAMEWORKS.find(f => f.id === frameworkId)?.name || 'Unknown'
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Export</h1>
          <p className="text-gray-500">Generate audit-ready compliance reports</p>
        </div>
        <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Export
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Audit Export</DialogTitle>
              <DialogDescription>
                Create an audit-ready export of your compliance data
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Framework</Label>
                <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a framework" />
                  </SelectTrigger>
                  <SelectContent>
                    {FRAMEWORKS.map((framework) => (
                      <SelectItem key={framework.id} value={framework.id.toString()}>
                        {framework.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Export Type</Label>
                <Select value={exportType} onValueChange={setExportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">HTML Report</SelectItem>
                    <SelectItem value="ZIP">ZIP Archive (with evidence)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {exportType === 'ZIP' 
                    ? 'Includes all evidence files and a summary JSON'
                    : 'Generates an HTML report for viewing/printing'}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setExportDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => exportMutation.mutate()}
                disabled={!selectedFramework || exportMutation.isPending}
              >
                {exportMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Export'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900">Audit-Ready Exports</h3>
              <p className="text-sm text-blue-800 mt-1">
                Generate comprehensive reports that include all controls, policies, 
                evidence, and task completion status. These exports can be shared 
                directly with auditors to demonstrate your compliance posture.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-white">
                  <FileText className="h-3 w-3 mr-1" />
                  HTML Reports
                </Badge>
                <Badge variant="outline" className="bg-white">
                  <FileArchive className="h-3 w-3 mr-1" />
                  ZIP with Evidence
                </Badge>
                <Badge variant="outline" className="bg-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Control Mapping
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exports List */}
      {exports && exports.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Export History</CardTitle>
            <CardDescription>
              Your previously generated audit exports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {exports.map((exp: any) => (
                <div 
                  key={exp.id} 
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {exp.export_type === 'ZIP' ? (
                        <FileArchive className="h-5 w-5 text-gray-600" />
                      ) : (
                        <FileText className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {getFrameworkName(exp.framework_id)} Audit Report
                        </span>
                        <Badge className={cn(getStatusColor(exp.status), 'text-xs')}>
                          {exp.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {exp.export_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Created {formatDateTime(exp.created_at)}
                        {exp.generated_at && (
                          <span> • Completed {formatDateTime(exp.generated_at)}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(exp.status)}
                    {exp.status === 'Ready' && (
                      <Button
                        size="sm"
                        onClick={() => handleDownload(
                          exp.id, 
                          `audit_export_${exp.id}.${exp.export_type === 'ZIP' ? 'zip' : 'html'}`
                        )}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Download className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exports yet</h3>
            <p className="text-gray-500 mb-4">
              Generate your first audit export to share with auditors
            </p>
            <Button onClick={() => setExportDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Export
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tips for Auditors</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                <strong>ZIP exports</strong> include all uploaded evidence files organized by control, 
                making it easy for auditors to verify documentation.
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                <strong>HTML reports</strong> provide a formatted overview of your compliance status 
                that can be viewed in any browser or printed to PDF.
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Control mapping</strong> shows the relationship between controls, 
                policies, evidence, and implementation tasks.
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                Exports include <strong>timestamps and version numbers</strong> for all 
                artifacts to establish an audit trail.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}