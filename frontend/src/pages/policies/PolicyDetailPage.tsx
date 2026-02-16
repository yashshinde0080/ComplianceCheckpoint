import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { policiesApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Edit, Save, X, FileText } from 'lucide-react'
import { cn, getStatusColor, formatDateTime } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export function PolicyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [editedTitle, setEditedTitle] = useState('')
  const [editedStatus, setEditedStatus] = useState('')

  const { data: policy, isLoading } = useQuery({
    queryKey: ['policy', id],
    queryFn: async () => {
      const response = await policiesApi.get(Number(id))
      return response.data
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: { title?: string; content?: string; status?: string }) => {
      return policiesApi.update(Number(id), data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy', id] })
      queryClient.invalidateQueries({ queryKey: ['policies'] })
      setIsEditing(false)
      toast({
        title: 'Policy updated',
        description: 'Your changes have been saved.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.response?.data?.detail || 'Something went wrong',
        variant: 'destructive',
      })
    },
  })

  const handleStartEdit = () => {
    setEditedTitle(policy.title)
    setEditedContent(policy.content)
    setEditedStatus(policy.status)
    setIsEditing(true)
  }

  const handleSave = () => {
    updateMutation.mutate({
      title: editedTitle,
      content: editedContent,
      status: editedStatus,
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedContent('')
    setEditedTitle('')
    setEditedStatus('')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!policy) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Policy not found</p>
        <Button asChild className="mt-4">
          <Link to="/policies">Back to Policies</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <Link
            to="/policies"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors uppercase tracking-widest font-bold"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Policies
          </Link>
          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-2xl md:text-3xl font-bold mt-2 bg-white/5 border-white/10"
            />
          ) : (
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-2 tracking-tight">{policy.title}</h1>
          )}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {isEditing ? (
              <Select value={editedStatus} onValueChange={setEditedStatus}>
                <SelectTrigger className="w-40 bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge className={cn(getStatusColor(policy.status), 'px-3 py-1 uppercase text-[10px] font-bold tracking-wider')}>
                {policy.status}
              </Badge>
            )}
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground/60">
              <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">v{policy.version}</span>
              <span className="flex items-center italic">
                Last updated {formatDateTime(policy.updated_at)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="border-white/10 hover:bg-white/5">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updateMutation.isPending} className="btn-gradient shadow-lg">
                <Save className="h-4 w-4 mr-2" />
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={handleStartEdit} className="btn-gradient shadow-lg">
              <Edit className="h-4 w-4 mr-2" />
              Edit Policy
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
        <CardHeader className="">
          <CardTitle className="flex items-center font-bold text-lg">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Document Viewer
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[600px] font-mono text-sm bg-white/[0.02] border-white/10 p-6 leading-relaxed focus:bg-white/[0.04] transition-colors"
            />
          ) : (
            <div className="prose prose-invert max-w-none bg-white/[0.02] border border-white/5 p-8 rounded-2xl">
              <ReactMarkdown>{policy.content}</ReactMarkdown>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}