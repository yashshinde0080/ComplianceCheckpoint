import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { controlsApi, evidenceApi, tasksApi } from '@/lib/api'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MagicBentoCard } from '@/components/ui/MagicBento'
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
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Controls
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg font-bold text-primary">
              {control.control_code}
            </span>
            <Badge className={cn(getSeverityColor(control.severity), 'text-xs uppercase font-bold tracking-wider')}>
              {control.severity}
            </Badge>
            <Badge className={cn(getStatusColor(control.completion_status), 'text-xs uppercase font-bold tracking-wider')}>
              {control.completion_status}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-3 tracking-tight">{control.title}</h1>
        </div>
      </div>

      {/* Control Details */}
      <MagicBentoCard className="magic-bento-card--border-glow border-white/5" spotlightColor="132, 0, 255">
        <CardHeader className="relative z-30">
          <CardTitle className="text-lg font-bold">Control Description</CardTitle>
        </CardHeader>
        <CardContent className="relative z-30 space-y-6">
          <p className="text-muted-foreground leading-relaxed">{control.description}</p>

          {control.guidance_text && (
            <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
              <h4 className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Implementation Guidance
              </h4>
              <p className="text-muted-foreground/80 text-sm leading-relaxed">{control.guidance_text}</p>
            </div>
          )}

          {control.evidence_guidance && (
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <h4 className="font-bold text-primary text-sm mb-2 flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Evidence Requirements
              </h4>
              <p className="text-primary/70 text-sm leading-relaxed font-medium">{control.evidence_guidance}</p>
            </div>
          )}
        </CardContent>
      </MagicBentoCard>

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
          <MagicBentoCard className="magic-bento-card--border-glow border-white/5" spotlightColor="132, 0, 255">
            <CardHeader className="relative z-30 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Evidence Library</CardTitle>
                <CardDescription className="text-muted-foreground/60">
                  Documents verifying control implementation
                </CardDescription>
              </div>
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-gradient shadow-lg">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-white/10">
                  <DialogHeader>
                    <DialogTitle>Upload Evidence</DialogTitle>
                    <DialogDescription className="text-muted-foreground/60">
                      Upload a file as evidence for this control
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpload}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="file" className="text-foreground">File</Label>
                        <Input
                          id="file"
                          type="file"
                          className="bg-white/5 border-white/10"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-foreground">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          className="bg-white/5 border-white/10"
                          placeholder="Describe what this evidence demonstrates..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-white/10 hover:bg-white/5"
                        onClick={() => setUploadDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="btn-gradient" disabled={uploadMutation.isPending}>
                        {uploadMutation.isPending ? 'Uploading...' : 'Upload Evidence'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="relative z-30">
              {evidence && evidence.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {evidence.map((item: any) => (
                    <div key={item.id} className="py-4 flex items-center justify-between group/item">
                      <div className="flex items-center space-x-4">
                        <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 transition-colors group-hover/item:border-primary/30">
                          <FileText className="h-5 w-5 text-muted-foreground/80 group-hover/item:text-primary transition-colors" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{item.file_name}</p>
                          <p className="text-xs text-muted-foreground/60 font-medium">
                            {formatDateTime(item.created_at)} • Version {item.version}
                          </p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground/80 mt-1.5 leading-relaxed">{item.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={cn(getStatusColor(item.status), 'uppercase text-[10px] font-bold tracking-wider px-2')}>
                          {item.status}
                        </Badge>
                        {item.status === 'Pending' && (
                          <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/5">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-500/80 hover:text-green-500 hover:bg-green-500/10 h-7 w-7 p-0 transition-all"
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
                              className="text-red-500/80 hover:text-red-500 hover:bg-red-500/10 h-7 w-7 p-0 transition-all"
                              onClick={() =>
                                updateEvidenceStatusMutation.mutate({
                                  evidenceId: item.id,
                                  status: 'Rejected',
                                })
                              }
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-white/[0.02] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                    <Upload className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-foreground font-bold italic">No evidence uploaded yet</p>
                  <p className="text-sm text-muted-foreground/60 mt-2 max-w-[240px] mx-auto leading-relaxed">
                    Upload documents to demonstrate control compliance and satisfy auditors.
                  </p>
                </div>
              )}
            </CardContent>
          </MagicBentoCard>
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          <MagicBentoCard className="magic-bento-card--border-glow border-white/5" spotlightColor="132, 0, 255">
            <CardHeader className="relative z-30 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Implementation Tasks</CardTitle>
                <CardDescription className="text-muted-foreground/60">
                  Step-by-step actions to fulfill this control
                </CardDescription>
              </div>
              <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-gradient shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-white/10">
                  <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                    <DialogDescription className="text-muted-foreground/60">
                      Outline an internal task to complete this requirement
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={taskForm.handleSubmit(handleCreateTask)}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-foreground">Title</Label>
                        <Input
                          id="title"
                          className="bg-white/5 border-white/10"
                          {...taskForm.register('title', { required: true })}
                          placeholder="Task title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-foreground">Description</Label>
                        <Textarea
                          id="description"
                          className="bg-white/5 border-white/10"
                          {...taskForm.register('description')}
                          placeholder="Task description..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="due_date" className="text-foreground">Due Date</Label>
                          <Input
                            id="due_date"
                            type="date"
                            className="bg-white/5 border-white/10"
                            {...taskForm.register('due_date')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priority" className="text-foreground">Priority</Label>
                          <Select
                            value={taskForm.watch('priority')}
                            onValueChange={(value) => taskForm.setValue('priority', value)}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-white/10">
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
                        className="border-white/10 hover:bg-white/5"
                        onClick={() => setTaskDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="btn-gradient" disabled={createTaskMutation.isPending}>
                        {createTaskMutation.isPending ? 'Creating...' : 'Add Task'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="relative z-30">
              {tasks && tasks.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {tasks.map((task: any) => (
                    <div key={task.id} className="py-4 group/task">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">{task.title}</h4>
                            <Badge className={cn(getStatusColor(task.status), 'uppercase text-[9px] font-bold tracking-tight')}>
                              {task.status}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-sm text-muted-foreground/80 mt-1.5 leading-relaxed">{task.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-3">
                            <Badge className={cn(
                              task.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                task.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20' :
                                  'bg-green-500/10 text-green-400 border-green-500/20',
                              'text-[10px] font-bold tracking-wider'
                            )}>
                              {task.priority}
                            </Badge>
                            {task.due_date && (
                              <p className="text-[11px] text-muted-foreground/40 font-medium flex items-center">
                                <Clock className="h-2.5 w-2.5 mr-1" />
                                {formatDate(task.due_date)}
                              </p>
                            )}
                          </div>
                        </div>
                        <Select
                          value={task.status}
                          onValueChange={(status) =>
                            updateTaskMutation.mutate({ taskId: task.id, status })
                          }
                        >
                          <SelectTrigger className="w-32 h-8 text-xs bg-white/5 border-white/10 group-hover/task:border-primary/40 transition-colors">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-white/10">
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
                <div className="text-center py-12">
                  <div className="bg-white/[0.02] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                    <CheckCircle className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-foreground font-bold italic">No tasks created yet</p>
                  <p className="text-sm text-muted-foreground/60 mt-2 max-w-[240px] mx-auto leading-relaxed">
                    Create internal tasks to track your journey toward full compliance.
                  </p>
                </div>
              )}
            </CardContent>
          </MagicBentoCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}