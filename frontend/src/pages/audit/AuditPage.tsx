import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '@/components/layout/PageHeader'
import { auditsApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { EmptyState, ErrorState, PageSkeleton } from '@/components/common/PageStates'
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

const BEST_PRACTICES = [
  { title: 'ZIP Archives', desc: 'Include all evidence files organized by control for direct verification.' },
  { title: 'HTML Summary', desc: 'A clean browser-ready overview of your entire compliance posture.' },
  { title: 'Control Mapping', desc: 'Detailed relationships between controls, policies, and evidence.' },
  { title: 'Audit Trail', desc: 'Persistent versioning and timestamps for every exported artifact.' },
]

export function AuditPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [selectedFramework, setSelectedFramework] = useState('')
  const [exportType, setExportType] = useState('PDF')

  const { data: exports, isLoading, isError, refetch } = useQuery({
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
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
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
    return <PageSkeleton count={3} />
  }

  const hasExports = (exports?.length ?? 0) > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader title="Audit Export" subtitle="Generate audit-ready compliance reports" />
        <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
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
                <p className="text-xs text-muted-foreground">
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
                className="btn-gradient shadow-lg"
                disabled={!selectedFramework || exportMutation.isPending}
              >
                {exportMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

      {isError ? (
        <ErrorState
          title="Unable to load exports"
          description="We couldn't retrieve your audit exports right now. Please try again."
          onRetry={() => refetch()}
        />
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[3fr_4fr_3fr]">
          {/* LEFT — Audit-Ready Exports */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-foreground">Audit-Ready Exports</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Generate comprehensive reports that include all controls, policies,
                  evidence, and task completion status. Share them directly with auditors
                  to demonstrate your compliance posture.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge variant="outline" className="border-white/10 bg-white/5 text-muted-foreground">
                <FileText className="mr-1.5 h-3 w-3" />
                HTML Reports
              </Badge>
              <Badge variant="outline" className="border-white/10 bg-white/5 text-muted-foreground">
                <FileArchive className="mr-1.5 h-3 w-3" />
                ZIP Archive
              </Badge>
              <Badge variant="outline" className="border-success/20 bg-success/5 text-success">
                <CheckCircle className="mr-1.5 h-3 w-3" />
                Verified Mapping
              </Badge>
            </div>
            <Button
              onClick={() => setExportDialogOpen(true)}
              className="btn-gradient mt-6 w-full shadow-lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Export
            </Button>
          </Card>

          {/* CENTER — Export status / empty state */}
          {hasExports ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Export History</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your previously generated audit documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-white/5">
                  {exports!.map((exp: any) => (
                    <div
                      key={exp.id}
                      className="flex flex-wrap items-center justify-between gap-4 py-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/5">
                          {exp.export_type === 'ZIP' ? (
                            <FileArchive className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="truncate font-semibold text-foreground">
                              {getFrameworkName(exp.framework_id)} Report
                            </span>
                            <Badge
                              className={cn(
                                getStatusColor(exp.status),
                                'px-2 text-[10px] font-bold uppercase tracking-wider'
                              )}
                            >
                              {exp.status}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-white/10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                            >
                              {exp.export_type}
                            </Badge>
                          </div>
                          <p className="mt-1.5 text-xs font-medium text-muted-foreground">
                            Initiated {formatDateTime(exp.created_at)}
                            {exp.generated_at && (
                              <span> • Ready {formatDateTime(exp.generated_at)}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        {getStatusIcon(exp.status)}
                        {exp.status === 'Ready' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs font-semibold"
                            onClick={() => handleDownload(
                              exp.id,
                              `audit_export_${exp.id}.${exp.export_type === 'ZIP' ? 'zip' : 'html'}`
                            )}
                          >
                            <Download className="mr-2 h-3.5 w-3.5" />
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
            <EmptyState
              icon={Download}
              title="No exports yet"
              description="Generate your first audit export to share organized compliance evidence with your auditors."
              className="h-full min-h-[320px]"
              action={
                <Button
                  onClick={() => setExportDialogOpen(true)}
                  className="btn-gradient shadow-lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Export
                </Button>
              }
            />
          )}

          {/* RIGHT — Auditor Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <CheckCircle className="h-5 w-5 text-primary" />
                Auditor Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {BEST_PRACTICES.map((tip) => (
                  <li
                    key={tip.title}
                    className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4"
                  >
                    <div className="h-fit rounded border border-success/20 bg-success/10 p-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-success" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-foreground">{tip.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {tip.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
