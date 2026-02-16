import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi, controlsApi } from '@/lib/api'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Plus,
  CheckSquare,
  Search,
  Trash2,
  Calendar
} from 'lucide-react'
import { cn, getPriorityColor, formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'

export function TasksPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['all-tasks'],
    queryFn: async () => {
      const response = await tasksApi.list()
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

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      control_id: '',
      due_date: '',
      priority: 'Medium',
    },
  })

  const watchedControlId = form.watch('control_id');
  const watchedPriority = form.watch('priority');

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return tasksApi.create({
        ...data,
        control_id: Number(data.control_id),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] })
      setCreateDialogOpen(false)
      form.reset()
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

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return tasksApi.update(id, { status })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] })
      toast({
        title: 'Task updated',
        description: 'Task status has been updated.',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return tasksApi.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] })
      toast({
        title: 'Task deleted',
        description: 'The task has been deleted.',
      })
    },
  })

  const filteredTasks = tasks?.filter((task: any) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Group tasks by status
  const tasksByStatus = filteredTasks?.reduce((acc: any, task: any) => {
    if (!acc[task.status]) acc[task.status] = []
    acc[task.status].push(task)
    return acc
  }, {})

  const statusOrder = ['Pending', 'In Progress', 'Blocked', 'Completed']

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
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground">Track and manage compliance tasks</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Task</DialogTitle>
              <DialogDescription>
                Create a new compliance task
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    {...form.register('title', { required: true })}
                    placeholder="Task title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Control</Label>
                  <Select
                    value={watchedControlId}
                    onValueChange={(value) => form.setValue('control_id', value)}
                  >
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
                  <Label>Description</Label>
                  <Textarea
                    {...form.register('description')}
                    placeholder="Task description..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      {...form.register('due_date')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={watchedPriority}
                      onValueChange={(value) => form.setValue('priority', value)}
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
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Task'}
                </Button>
              </DialogFooter>
            </form>
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
                  placeholder="Search tasks..."
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
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </MagicBentoCard>

        {/* Tasks by Status */}
        {filteredTasks && filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {statusOrder.map((status, index) => {
              return (
                <MagicBentoCard
                  key={status}
                  className="magic-bento-card--border-glow animate-fade-in min-h-[400px] flex flex-col"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  spotlightColor="132, 0, 255"
                >
                  <CardHeader className="pb-3 relative z-30">
                    <CardTitle className="text-lg flex items-center justify-between font-bold">
                      <span>{status}</span>
                      <Badge variant="secondary" className="bg-white/5 border-white/5 text-muted-foreground/80 font-medium">
                        {tasksByStatus?.[status]?.length || 0}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-30 flex-1">
                    <div className="space-y-3">
                      {tasksByStatus?.[status]?.map((task: any) => {
                        const control = controls?.find((c: any) => c.id === task.control_id)
                        return (
                          <div
                            key={task.id}
                            className="p-3 bg-white/5 rounded-xl border border-white/5"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-foreground text-sm truncate">
                                  {task.title}
                                </p>
                                {control && (
                                  <p className="text-xs text-primary font-mono mt-1 opacity-80">
                                    {control.control_code}
                                  </p>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500/60 hover:text-red-500 hover:bg-red-500/10 h-6 w-6 p-0 transition-all"
                                onClick={() => {
                                  if (confirm('Delete this task?')) {
                                    deleteMutation.mutate(task.id)
                                  }
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-2 mt-3">
                              <Badge className={cn(getPriorityColor(task.priority), 'text-[10px] uppercase font-bold tracking-wider px-1.5 py-0')}>
                                {task.priority}
                              </Badge>
                              {task.due_date && (
                                <span className="text-[10px] text-muted-foreground/60 flex items-center font-medium">
                                  <Calendar className="h-2.5 w-2.5 mr-1" />
                                  {formatDate(task.due_date)}
                                </span>
                              )}
                            </div>

                            <Select
                              value={task.status}
                              onValueChange={(status) =>
                                updateMutation.mutate({ id: task.id, status })
                              }
                            >
                              <SelectTrigger className="mt-3 h-8 text-xs bg-white/5 border-white/10 rounded-lg">
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
                        )
                      })}
                      {(!tasksByStatus?.[status] || tasksByStatus[status].length === 0) && (
                        <p className="text-sm text-muted-foreground/40 text-center py-8 italic">
                          No tasks
                        </p>
                      )}
                    </div>
                  </CardContent>
                </MagicBentoCard>
              );
            })}
          </div>
        ) : (
          <MagicBentoCard className="magic-bento-card--border-glow animate-fade-in" spotlightColor="132, 0, 255">
            <CardContent className="py-12 text-center relative z-30">
              <CheckSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No tasks yet</h3>
              <p className="text-muted-foreground/60 mb-6 max-w-sm mx-auto">
                Create your first task to track compliance activities and stay audit-ready.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)} className="btn-gradient shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Create First Task
              </Button>
            </CardContent>
          </MagicBentoCard>
        )}
      </MagicBentoGrid>
    </div>
  )
}