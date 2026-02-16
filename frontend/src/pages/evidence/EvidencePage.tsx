import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { evidenceApi, controlsApi } from '@/lib/api'
import { CardContent } from '@/components/ui/card'
import { MagicBentoCard, MagicBentoGrid } from '@/components/ui/MagicBento'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

  const { data: evidence, isLoading } = useQuery({
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
          <h1 className="text-2xl font-bold text-foreground">Evidence</h1>
          <p className="text-muted-foreground">Manage compliance evidence and artifacts</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
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

      <MagicBentoGrid className="space-y-6">
        {/* Filters */}
        <MagicBentoCard className="magic-bento-card--border-glow animate-fade-in" spotlightColor="132, 0, 255">
          <CardContent className="pt-6 relative z-30">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search evidence..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
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
          </CardContent>
        </MagicBentoCard>

        {/* Evidence List */}
        {filteredEvidence && filteredEvidence.length > 0 ? (
          <MagicBentoCard
            className="magic-bento-card--border-glow animate-fade-in"
            style={{ animationDelay: '100ms' }}
            spotlightColor="132, 0, 255"
          >
            <CardContent className="p-0 relative z-30">
              <div className="divide-y divide-white/5">
                {filteredEvidence.map((item: any) => {
                  const control = controls?.find((c: any) => c.id === item.control_id)
                  return (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 min-h-[90px]">
                      <div className="flex items-center space-x-4">
                        <div className="p-2.5 bg-secondary rounded-xl border border-white/5">
                          <FileText className="h-5 w-5 text-muted-foreground/80" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{item.file_name}</p>
                          <div className="flex items-center gap-2 text-[13px] text-muted-foreground/60">
                            {control && (
                              <span className="font-mono text-primary font-bold opacity-80">
                                {control.control_code}
                              </span>
                            )}
                            <span className="opacity-40">•</span>
                            <span>Version {item.version}</span>
                            <span className="opacity-40">•</span>
                            <span>{formatDateTime(item.created_at)}</span>
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground/80 mt-1.5">{item.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={cn(getStatusColor(item.status), 'uppercase text-[10px] font-bold tracking-wider')}>
                          {item.status}
                        </Badge>
                        {item.status === 'Pending' && (
                          <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/5">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-500/80 hover:text-green-500 hover:bg-green-500/10 h-7 w-7 p-0 transition-all"
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: item.id,
                                  status: 'Accepted',
                                })
                              }
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500/80 hover:text-red-500 hover:bg-red-500/10 h-7 w-7 p-0 transition-all"
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: item.id,
                                  status: 'Rejected',
                                })
                              }
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500/60 hover:text-red-500 hover:bg-red-500/10 h-7 w-7 p-0 transition-all"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this evidence?')) {
                              deleteMutation.mutate(item.id)
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </MagicBentoCard>
        ) : (
          <MagicBentoCard
            className="magic-bento-card--border-glow animate-fade-in"
            style={{ animationDelay: '100ms' }}
            spotlightColor="132, 0, 255"
          >
            <CardContent className="py-12 text-center relative z-30">
              <Upload className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No evidence yet</h3>
              <p className="text-muted-foreground/60 mb-6 max-w-sm mx-auto">
                Upload your first evidence file to verify controls and stay audit-ready.
              </p>
              <Button onClick={() => setUploadDialogOpen(true)} className="btn-gradient shadow-lg">
                <Upload className="h-4 w-4 mr-2" />
                Upload Evidence
              </Button>
            </CardContent>
          </MagicBentoCard>
        )}
      </MagicBentoGrid>
    </div>
  )
}