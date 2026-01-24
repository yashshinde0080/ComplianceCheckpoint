import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { controlsApi, evidenceApi, tasksApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  ArrowLeft, 
  Upload, 
  Plus, 
  FileText, 
  CheckCircle, 
  XCircle,
  Clock
} from 'lucide-react'
import { cn, getStatusColor, getSeverityColor, formatDate, formatDateTime } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'

export function ControlDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { data: control, isLoading } = useQuery({
    queryKey: ['control', id],
    queryFn: async () => {
      const response = await controlsApi.get(Number(id))
      return response.data
    },
  })

  const { data: evidence } = useQuery({
    queryKey: ['evidence', id],
    queryFn: async () => {
      const response = await evidenceApi.getForControl(Number(id))
      return response.data
    },
  })

  const { data: tasks } = useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => {
      const response = await tasksApi.list({ control_id: Number(id) })
      return response.data
    },
  })

  const uploadMutation = useMutation({
    mutationFn: async (data: { file: File; description: string }) => {
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('control_id', id!)
      formData.append('description', data.description)
      return evidenceApi.upload(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence', id] })
      queryClient.invalidateQueries({ queryKey: ['control', id] })
      setUploadDialogOpen(false)
      setSelectedFile(null)
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

  const createTaskMutation = useMutation({
    mutationFn: async (data: any) => {
      return tasksApi.create({
        ...data,
        control_id: Number(id),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', id] })
      queryClient.invalidateQueries({ queryKey: ['control', id] })
      setTaskDialogOpen(false)
      toast({
        title: 'Task created',
        description: 'Your task has been created successfully.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create task',
        description: error.response?.data?.detail || 'Something went wrong',
        variant: 'destructive',
      })
    },
  })

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: number; status: string }) => {
      return tasksApi.update(taskId, { status })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', id] })
      queryClient.invalidateQueries({ queryKey: ['control', id] })
      toast({
        title: 'Task updated',
        description: 'Task status has been updated.',
      })
    },
  })

  const updateEvidenceStatusMutation = useMutation({
    mutationFn: async ({ evidenceId, status }: { evidenceId: number; status: string }) => {
      return evidenceApi.updateStatus(evidenceId, status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence', id] })
      queryClient.invalidateQueries({ queryKey: ['control', id] })
      toast({
        title: 'Evidence updated',
        description: 'Evidence status has been updated.',
      })
    },
  })

  const taskForm = useForm({
    defaultValues: {
      title: '',
      description: '',
      due_date: '',
      priority: 'Medium',
    },
  })

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (selectedFile) {
      uploadMutation.mutate({
        file: selectedFile,
        description: formData.get('description') as string,
      })
    }
  }

  const handleCreateTask = (data: any) => {
    createTaskMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!control) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Control not found</p>
        <Button asChild className="mt-4">
          <Link to="/controls">Back to Controls</Link>
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
            to="/controls"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Controls
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg font-bold text-primary">
              {control.control_code}
            </span>
            <Badge className={cn(getSeverityColor(control.severity))}>
              {control.severity}
            </Badge>
            <Badge className={cn(getStatusColor(control.completion_status))}>
              {control.completion_status}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{control.title}</h1>
        </div>
      </div>

      {/* Control Details */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{control.description}</p>
          
          {control.guidance_text && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Implementation Guidance</h4>
              <p className="text-gray-600 text-sm">{control.guidance_text}</p>
            </div>
          )}
          
          {control.evidence_guidance && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Evidence Requirements</h4>
              <p className="text-blue-800 text-sm">{control.evidence_guidance}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Evidence and Tasks */}
      <Tabs defaultValue="evidence">
        <TabsList>
          <TabsTrigger value="evidence">
            Evidence ({evidence?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="tasks">
            Tasks ({tasks?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="evidence" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Evidence</CardTitle>
                <CardDescription>
                  Upload documents and artifacts that demonstrate control implementation
                </CardDescription>
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
                      Upload a file as evidence for this control
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpload}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="file">File</Label>
                        <Input
                          id="file"
                          type="file"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Describe what this evidence demonstrates..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setUploadDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={uploadMutation.isPending}>
                        {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {evidence && evidence.length > 0 ? (
                <div className="divide-y">
                  {evidence.map((item: any) => (
                    <div key={item.id} className="py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.file_name}</p>
                          <p className="text-sm text-gray-500">
                            Uploaded {formatDateTime(item.created_at)} • Version {item.version}
                          </p>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn(getStatusColor(item.status))}>
                          {item.status}
                        </Badge>
                        {item.status === 'Pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600"
                              onClick={() =>
                                updateEvidenceStatusMutation.mutate({
                                  evidenceId: item.id,
                                  status: 'Accepted',
                                })
                              }
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600"
                              onClick={() =>
                                updateEvidenceStatusMutation.mutate({
                                  evidenceId: item.id,
                                  status: 'Rejected',
                                })
                              }
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No evidence uploaded yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Upload documents to demonstrate control compliance
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>
                  Track implementation tasks for this control
                </CardDescription>
              </div>
              <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                    <DialogDescription>
                      Create a new task for implementing this control
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={taskForm.handleSubmit(handleCreateTask)}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          {...taskForm.register('title', { required: true })}
                          placeholder="Task title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          {...taskForm.register('description')}
                          placeholder="Task description..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="due_date">Due Date</Label>
                          <Input
                            id="due_date"
                            type="date"
                            {...taskForm.register('due_date')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={taskForm.watch('priority')}
                            onValueChange={(value) => taskForm.setValue('priority', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setTaskDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createTaskMutation.isPending}>
                        {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {tasks && tasks.length > 0 ? (
                <div className="divide-y">
                  {tasks.map((task: any) => (
                    <div key={task.id} className="py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            <Badge className={cn(getStatusColor(task.status), 'text-xs')}>
                              {task.status}
                            </Badge>
                            <Badge className={cn(
                              task.priority === 'High' ? 'bg-red-100 text-red-800' :
                              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800',
                              'text-xs'
                            )}>
                              {task.priority}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          )}
                          {task.due_date && (
                            <p className="text-xs text-gray-400 mt-2 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Due: {formatDate(task.due_date)}
                            </p>
                          )}
                        </div>
                        <Select
                          value={task.status}
                          onValueChange={(status) =>
                            updateTaskMutation.mutate({ taskId: task.id, status })
                          }
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Blocked">Blocked</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No tasks created yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Create tasks to track control implementation
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}