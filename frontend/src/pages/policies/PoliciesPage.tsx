import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { policiesApi } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { FileText, Wand2, ChevronRight, Trash2 } from 'lucide-react'
import { cn, getStatusColor, formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

const POLICY_TYPES = [
  { value: 'information_security', label: 'Information Security Policy' },
  { value: 'access_control', label: 'Access Control Policy' },
  { value: 'incident_response', label: 'Incident Response Policy' },
  { value: 'data_protection', label: 'Data Protection Policy' },
  { value: 'acceptable_use', label: 'Acceptable Use Policy' },
  { value: 'business_continuity', label: 'Business Continuity Policy' },
  { value: 'vendor_management', label: 'Vendor Management Policy' },
  { value: 'change_management', label: 'Change Management Policy' },
  { value: 'encryption', label: 'Encryption Policy' },
]

export function PoliciesPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false)
  const [selectedPolicyType, setSelectedPolicyType] = useState('')
  const [companyName, setCompanyName] = useState('')

  const { data: policies, isLoading, isError, refetch } = useQuery({
    queryKey: ['policies'],
    queryFn: async () => {
      const response = await policiesApi.list()
      return response.data
    },
  })

  const generateMutation = useMutation({
    mutationFn: async (data: { policy_type: string; company_name?: string }) => {
      return policiesApi.generate(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] })
      setGenerateDialogOpen(false)
      setSelectedPolicyType('')
      setCompanyName('')
      toast({
        title: 'Policy generated',
        description: 'Your policy has been generated successfully.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Generation failed',
        description: error.response?.data?.detail || 'Something went wrong',
        variant: 'destructive',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return policiesApi.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] })
      toast({
        title: 'Policy deleted',
        description: 'The policy has been deleted.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Delete failed',
        description: error.response?.data?.detail || 'Something went wrong',
        variant: 'destructive',
      })
    },
  })

  const handleGenerate = () => {
    if (!selectedPolicyType) return
    generateMutation.mutate({
      policy_type: selectedPolicyType,
      company_name: companyName || undefined,
    })
  }

  if (isLoading) {
    return <PageSkeleton count={4} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader title="Policies" subtitle="Manage your compliance policies" />
        <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0">
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Policy
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Policy</DialogTitle>
              <DialogDescription>
                Select a policy type to generate a template
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="policy_type">Policy Type</Label>
                <Select value={selectedPolicyType} onValueChange={setSelectedPolicyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a policy type" />
                  </SelectTrigger>
                  <SelectContent>
                    {POLICY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name (optional)</Label>
                <Input
                  id="company_name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your Company Name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setGenerateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!selectedPolicyType || generateMutation.isPending}
              >
                {generateMutation.isPending ? 'Generating...' : 'Generate'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Policies List */}
      {isError ? (
        <ErrorState
          title="Unable to load policies"
          description="We couldn't retrieve your policies right now. Please try again."
          onRetry={() => refetch()}
        />
      ) : policies && policies.length > 0 ? (
        <div className="grid gap-4">
          {policies.map((policy: any, index: number) => (
            <Card
              key={policy.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/10 p-3">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <Link
                      to={`/policies/${policy.id}`}
                      className="block truncate text-base font-semibold text-foreground transition-colors hover:text-primary"
                      title={policy.title}
                    >
                      {policy.title}
                    </Link>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3">
                      <Badge className={cn(getStatusColor(policy.status), 'text-[10px] font-bold uppercase tracking-wider')}>
                        {policy.status}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground">
                        v{policy.version}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        Updated {formatDate(policy.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-red-500/60 transition-all hover:bg-red-500/10 hover:text-red-500"
                    title="Delete policy"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this policy?')) {
                        deleteMutation.mutate(policy.id)
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9" asChild>
                    <Link to={`/policies/${policy.id}`}>
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No policies yet"
          description="Generate your first policy to establish a solid compliance foundation for your organization."
          action={
            <Button onClick={() => setGenerateDialogOpen(true)} className="btn-gradient shadow-lg">
              <Wand2 className="mr-2 h-4 w-4" />
              Generate First Policy
            </Button>
          }
        />
      )}
    </div>
  )
}
