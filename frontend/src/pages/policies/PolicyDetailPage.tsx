import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { policiesApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
        <div>
          <Link
            to="/policies"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Policies
          </Link>
          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-2xl font-bold mt-2"
            />
          ) : (
            <h1 className="text-2xl font-bold text-gray-900">{policy.title}</h1>
          )}
          <div className="flex items-center gap-3 mt-2">
            {isEditing ? (
              <Select value={editedStatus} onValueChange={setEditedStatus}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge className={cn(getStatusColor(policy.status))}>
                {policy.status}
              </Badge>
            )}
            <span className="text-sm text-gray-500">Version {policy.version}</span>
            <span className="text-sm text-gray-500">
              Last updated {formatDateTime(policy.updated_at)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updateMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={handleStartEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Policy
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Policy Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[600px] font-mono text-sm"
            />
          ) : (
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-gray-50 p-6 rounded-lg">
                {policy.content}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}