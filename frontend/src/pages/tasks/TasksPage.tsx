import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '@/components/layout/PageHeader'
import { tasksApi, controlsApi } from '@/lib/api'
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

  const { data: tasks, isLoading, isError, refetch } = useQuery({
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

  const hasTasks = (tasks?.length ?? 0) > 0
  const hasResults = (filteredTasks?.length ?? 0) > 0

  if (isLoading) {
    return <PageSkeleton count={4} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader title="Tasks" subtitle="Track and manage compliance tasks" />
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      {/* Filter bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
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
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Kanban board */}
      {isError ? (
        <ErrorState
          title="Unable to load tasks"
          description="We couldn't retrieve your tasks right now. Please try again."
          onRetry={() => refetch()}
        />
      ) : !hasTasks ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks yet"
          description="Create your first task to track compliance activities and stay audit-ready."
          action={
            <Button onClick={() => setCreateDialogOpen(true)} className="btn-gradient shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Create First Task
            </Button>
          }
        />
      ) : !hasResults ? (
        <EmptyState
          icon={Search}
          title="No matching tasks"
          description="Try adjusting your search or status filter to find what you're looking for."
        />
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {statusOrder.map((status, index) => (
            <Card
              key={status}
              className="animate-fade-in flex min-h-[420px] flex-col p-4"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="mb-4 flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                <h2 className="truncate text-sm font-semibold text-foreground">{status}</h2>
                <Badge
                  variant="secondary"
                  className="shrink-0 bg-white/5 font-medium text-muted-foreground"
                >
                  {tasksByStatus?.[status]?.length || 0}
                </Badge>
              </div>

              <div className="flex-1 space-y-3">
                {tasksByStatus?.[status]?.map((task: any) => {
                  const control = controls?.find((c: any) => c.id === task.control_id)
                  return (
                    <div
                      key={task.id}
                      className="rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-colors hover:border-border"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground"
                          title={task.title}
                        >
                          {task.title}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 shrink-0 p-0 text-red-500/60 transition-all hover:bg-red-500/10 hover:text-red-500"
                          title="Delete task"
                          onClick={() => {
                            if (confirm('Delete this task?')) {
                              deleteMutation.mutate(task.id)
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {control && (
                        <p className="mt-1 font-mono text-xs text-primary opacity-80">
                          {control.control_code}
                        </p>
                      )}

                      {task.description && (
                        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge
                          className={cn(
                            getPriorityColor(task.priority),
                            'px-1.5 py-0 text-[10px] font-bold uppercase tracking-wider'
                          )}
                        >
                          {task.priority}
                        </Badge>
                        {task.due_date && (
                          <span className="flex items-center text-[10px] font-medium text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
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
                        <SelectTrigger className="mt-3 h-8 w-full text-xs">
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
                  )
                })}
                {(!tasksByStatus?.[status] || tasksByStatus[status].length === 0) && (
                  <p className="py-8 text-center text-xs italic text-muted-foreground/60">
                    No tasks
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
