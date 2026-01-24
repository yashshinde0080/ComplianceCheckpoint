import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi, controlsApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500">Track and manage compliance tasks</p>
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
                    value={form.watch('control_id')}
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
                      value={form.watch('priority')}
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

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
      </Card>

      {/* Tasks by Status */}
      {filteredTasks && filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {statusOrder.map((status) => (
            <Card key={status}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{status}</span>
                  <Badge variant="secondary">
                    {tasksByStatus?.[status]?.length || 0}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasksByStatus?.[status]?.map((task: any) => {
                    const control = controls?.find((c: any) => c.id === task.control_id)
                    return (
                      <div
                        key={task.id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">
                              {task.title}
                            </p>
                            {control && (
                              <p className="text-xs text-primary font-mono mt-1">
                                {control.control_code}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 h-6 w-6 p-0"
                            onClick={() => {
                              if (confirm('Delete this task?')) {
                                deleteMutation.mutate(task.id)
                              }
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={cn(getPriorityColor(task.priority), 'text-xs')}>
                            {task.priority}
                          </Badge>
                          {task.due_date && (
                            <span className="text-xs text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
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
                          <SelectTrigger className="mt-2 h-8 text-xs">
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
                    <p className="text-sm text-gray-400 text-center py-4">
                      No tasks
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-gray-500 mb-4">
              Create your first task to track compliance activities
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}