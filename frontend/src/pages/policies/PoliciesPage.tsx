import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { policiesApi } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

  const { data: policies, isLoading } = useQuery({
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
          <h1 className="text-2xl font-bold text-foreground">Policies</h1>
          <p className="text-muted-foreground">Manage your compliance policies</p>
        </div>
        <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Wand2 className="h-4 w-4 mr-2" />
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

      <div className="grid gap-6">
        {/* Policies List */}
        {policies && policies.length > 0 ? (
          <div className="grid gap-4">
            {policies.map((policy: any, index: number) => (
              <Card
                key={policy.id}
                className="animate-fade-in border-white/10 bg-card/50 hover:bg-card/80 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <Link
                          to={`/policies/${policy.id}`}
                          className="font-bold text-lg text-foreground hover:text-primary transition-colors block"
                        >
                          {policy.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-1.5">
                          <Badge className={cn(getStatusColor(policy.status), 'text-[10px] uppercase font-bold tracking-wider')}>
                            {policy.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground/60 font-medium">
                            v{policy.version}
                          </span>
                          <span className="text-xs text-muted-foreground/40 font-medium italic">
                            Updated {formatDate(policy.updated_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500/60 hover:text-red-500 hover:bg-red-500/10 h-9 w-9 transition-all"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this policy?')) {
                            deleteMutation.mutate(policy.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 bg-white/5 border border-white/10 hover:border-primary/40 transition-all" asChild>
                        <Link to={`/policies/${policy.id}`}>
                          <ChevronRight className="h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-white/10 bg-card/50">
            <CardContent className="py-12 text-center">
              <div className="bg-white/[0.02] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                <FileText className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No policies yet</h3>
              <p className="text-muted-foreground/60 mb-6 max-w-sm mx-auto">
                Generate your first policy to establish a solid compliance foundation for your organization.
              </p>
              <Button onClick={() => setGenerateDialogOpen(true)} className="btn-gradient shadow-lg">
                <Wand2 className="h-4 w-4 mr-2" />
                Generate First Policy
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}