import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { auditsApi } from '@/lib/api'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MagicBentoCard, MagicBentoGrid } from '@/components/ui/MagicBento'
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
          <h1 className="text-2xl font-bold text-foreground">Audit Export</h1>
          <p className="text-muted-foreground">Generate audit-ready compliance reports</p>
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
                className="border-white/10 hover:bg-white/5"
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

      <MagicBentoGrid className="space-y-6">
        {/* Info Card */}
        <MagicBentoCard className="magic-bento-card--border-glow border-primary/20 animate-fade-in" spotlightColor="132, 0, 255">
          <CardContent className="pt-6 relative z-30">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Audit-Ready Exports</h3>
                <p className="text-muted-foreground/80 mt-1.5 leading-relaxed">
                  Generate comprehensive reports that include all controls, policies,
                  evidence, and task completion status. These exports can be shared
                  directly with auditors to demonstrate your compliance posture.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-muted-foreground/80">
                    <FileText className="h-3 w-3 mr-1.5" />
                    HTML Reports
                  </Badge>
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-muted-foreground/80">
                    <FileArchive className="h-3 w-3 mr-1.5" />
                    ZIP Archive
                  </Badge>
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-success/60">
                    <CheckCircle className="h-3 w-3 mr-1.5" />
                    Verified Mapping
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </MagicBentoCard>

        {/* Exports List */}
        {exports && exports.length > 0 ? (
          <MagicBentoCard
            className="magic-bento-card--border-glow border-white/5 animate-fade-in"
            style={{ animationDelay: '100ms' }}
            spotlightColor="132, 0, 255"
          >
            <CardHeader className="relative z-30">
              <CardTitle className="text-lg font-bold">Export History</CardTitle>
              <CardDescription className="text-muted-foreground/60">
                Your previously generated audit documentation
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-30">
              <div className="divide-y divide-white/5">
                {exports.map((exp: any) => (
                  <div
                    key={exp.id}
                    className="py-5 flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 group-hover:border-primary/30 transition-colors">
                        {exp.export_type === 'ZIP' ? (
                          <FileArchive className="h-6 w-6 text-muted-foreground/80 group-hover:text-primary transition-colors" />
                        ) : (
                          <FileText className="h-6 w-6 text-muted-foreground/80 group-hover:text-primary transition-colors" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-foreground">
                            {getFrameworkName(exp.framework_id)} Report
                          </span>
                          <Badge className={cn(getStatusColor(exp.status), 'uppercase text-[10px] font-bold tracking-wider px-2')}>
                            {exp.status}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-white/10 text-muted-foreground/60">
                            {exp.export_type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground/40 mt-1.5 font-medium">
                          Initiated {formatDateTime(exp.created_at)}
                          {exp.generated_at && (
                            <span className="opacity-80"> • Ready {formatDateTime(exp.generated_at)}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                        {getStatusIcon(exp.status)}
                      </div>
                      {exp.status === 'Ready' && (
                        <Button
                          size="sm"
                          className="bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all text-xs h-8 px-4 font-bold"
                          onClick={() => handleDownload(
                            exp.id,
                            `audit_export_${exp.id}.${exp.export_type === 'ZIP' ? 'zip' : 'html'}`
                          )}
                        >
                          <Download className="h-3.5 w-3.5 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </MagicBentoCard>
        ) : (
          <MagicBentoCard
            className="magic-bento-card--border-glow border-white/5 animate-fade-in"
            style={{ animationDelay: '100ms' }}
            spotlightColor="132, 0, 255"
          >
            <CardContent className="py-12 text-center relative z-30">
              <div className="bg-white/[0.02] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                <Download className="h-10 w-10 text-muted-foreground/20" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No exports yet</h3>
              <p className="text-muted-foreground/60 mb-8 max-w-sm mx-auto leading-relaxed">
                Generate your first audit export to share organized compliance evidence with your auditors.
              </p>
              <Button onClick={() => setExportDialogOpen(true)} className="btn-gradient shadow-lg px-8 py-6 h-auto text-base">
                <Plus className="h-5 w-5 mr-2" />
                Create First Export
              </Button>
            </CardContent>
          </MagicBentoCard>
        )}

        {/* Tips Card */}
        <MagicBentoCard
          className="magic-bento-card--border-glow border-white/5 bg-secondary/20 animate-fade-in"
          style={{ animationDelay: '200ms' }}
          spotlightColor="132, 0, 255"
        >
          <CardHeader className="relative z-30">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Auditor Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-30">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'ZIP Archives', desc: 'Include all evidence files organized by control for direct verification.' },
                { title: 'HTML Summary', desc: 'A clean browser-ready overview of your entire compliance posture.' },
                { title: 'Control Mapping', desc: 'Detailed relationships between controls, policies, and evidence.' },
                { title: 'Audit Trail', desc: 'Persistent versioning and timestamps for every exported artifact.' }
              ].map((tip, i) => (
                <li key={i} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="bg-success/10 p-1.5 h-fit rounded border border-success/20">
                    <CheckCircle className="h-3.5 w-3.5 text-success" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{tip.title}</h4>
                    <p className="text-muted-foreground/60 text-xs mt-1 leading-relaxed">{tip.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </MagicBentoCard>
      </MagicBentoGrid>
    </div>
  )
}