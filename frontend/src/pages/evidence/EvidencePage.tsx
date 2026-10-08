import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '@/components/layout/PageHeader'
import { evidenceApi, controlsApi } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Search,
  Trash2
} from 'lucide-react'
import { cn, getStatusColor, formatDateTime } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export function EvidencePage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedControlId, setSelectedControlId] = useState('')
  const [description, setDescription] = useState('')

  const { data: evidence, isLoading, isError, refetch } = useQuery({
    queryKey: ['all-evidence'],
    queryFn: async () => {
      const response = await evidenceApi.list()
      return response.data
    },
  })

  const { data: controls } = useQuery({
    queryKey: ['controls'],
    queryFn: async () => {
      const response = await controlsApi.list()
      return response.data
    },
  })

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile || !selectedControlId) return
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('control_id', selectedControlId)
      formData.append('description', description)
      return evidenceApi.upload(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-evidence'] })
      setUploadDialogOpen(false)
      setSelectedFile(null)
      setSelectedControlId('')
      setDescription('')
      toast({
        title: 'Evidence uploaded',
        description: 'Your evidence has been uploaded successfully.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Upload failed',
        description: error.response?.data?.detail || 'Something went wrong',
        variant: 'destructive',
      })
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return evidenceApi.updateStatus(id, status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-evidence'] })
      toast({
        title: 'Status updated',
        description: 'Evidence status has been updated.',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return evidenceApi.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-evidence'] })
      toast({
        title: 'Evidence deleted',
        description: 'The evidence has been deleted.',
      })
    },
  })

  const filteredEvidence = evidence?.filter((item: any) => {
    const matchesSearch =
      item.file_name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const hasEvidence = (evidence?.length ?? 0) > 0
  const hasResults = (filteredEvidence?.length ?? 0) > 0

  if (isLoading) {
    return <PageSkeleton count={6} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader title="Evidence" subtitle="Manage compliance evidence and artifacts" />
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0">
              <Upload className="mr-2 h-4 w-4" />
              Upload Evidence
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Evidence</DialogTitle>
              <DialogDescription>
                Upload a file as evidence for a control
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Control</Label>
                <Select value={selectedControlId} onValueChange={setSelectedControlId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a control" />
                  </SelectTrigger>
                  <SelectContent>
                    {controls?.map((control: any) => (
                      <SelectItem key={control.id} value={control.id.toString()}>
                        {control.control_code} - {control.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>File</Label>
                <Input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this evidence demonstrates..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setUploadDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => uploadMutation.mutate()}
                disabled={!selectedFile || !selectedControlId || uploadMutation.isPending}
              >
                {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search evidence..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Content */}
      {isError ? (
        <ErrorState
          title="Unable to load evidence"
          description="We couldn't retrieve the evidence list right now. Please try again."
          onRetry={() => refetch()}
        />
      ) : !hasEvidence ? (
        <EmptyState
          icon={Upload}
          title="No evidence yet"
          description="Upload your first piece of evidence to begin building your compliance record."
          action={
            <Button onClick={() => setUploadDialogOpen(true)} className="btn-gradient shadow-lg">
              <Upload className="mr-2 h-4 w-4" />
              Upload Evidence
            </Button>
          }
        />
      ) : !hasResults ? (
        <EmptyState
          icon={Search}
          title="No matching evidence"
          description="Try adjusting your search or status filter to find what you're looking for."
        />
      ) : (
        <div className="page-grid">
          {filteredEvidence!.map((item: any, index: number) => {
            const control = controls?.find((c: any) => c.id === item.control_id)
            return (
              <Card
                key={item.id}
                className="animate-fade-in flex flex-col p-5"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="truncate font-semibold leading-tight text-foreground"
                        title={item.file_name}
                      >
                        {item.file_name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Version {item.version}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      getStatusColor(item.status),
                      'shrink-0 text-[10px] font-bold uppercase tracking-wider'
                    )}
                  >
                    {item.status}
                  </Badge>
                </div>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Control</dt>
                    <dd className="truncate font-mono text-xs font-semibold text-primary">
                      {control?.control_code ?? 'Unlinked'}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Uploaded</dt>
                    <dd className="truncate text-xs text-foreground/80">
                      {formatDateTime(item.created_at)}
                    </dd>
                  </div>
                </dl>

                {item.description && (
                  <p
                    className="mt-3 line-clamp-2 text-sm text-muted-foreground"
                    title={item.description}
                  >
                    {item.description}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-end gap-2 pt-4">
                  {item.status === 'Pending' && (
                    <div className="mr-auto flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-0.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-green-500/80 transition-all hover:bg-green-500/10 hover:text-green-500"
                        title="Accept evidence"
                        onClick={() =>
                          updateStatusMutation.mutate({ id: item.id, status: 'Accepted' })
                        }
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-500/80 transition-all hover:bg-red-500/10 hover:text-red-500"
                        title="Reject evidence"
                        onClick={() =>
                          updateStatusMutation.mutate({ id: item.id, status: 'Rejected' })
                        }
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-red-500/60 transition-all hover:bg-red-500/10 hover:text-red-500"
                    title="Delete evidence"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this evidence?')) {
                        deleteMutation.mutate(item.id)
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
