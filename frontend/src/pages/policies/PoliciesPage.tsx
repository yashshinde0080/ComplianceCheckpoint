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
          <h1 className="text-2xl font-bold text-gray-900">Policies</h1>
          <p className="text-gray-500">Manage your compliance policies</p>
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

      {/* Policies List */}
      {policies && policies.length > 0 ? (
        <div className="grid gap-4">
          {policies.map((policy: any) => (
            <Card key={policy.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <Link
                        to={`/policies/${policy.id}`}
                        className="font-medium text-gray-900 hover:text-primary"
                      >
                        {policy.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={cn(getStatusColor(policy.status), 'text-xs')}>
                          {policy.status}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          Version {policy.version}
                        </span>
                        <span className="text-xs text-gray-400">
                          Updated {formatDate(policy.updated_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this policy?')) {
                          deleteMutation.mutate(policy.id)
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
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
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No policies yet</h3>
            <p className="text-gray-500 mb-4">
              Generate your first policy to get started
            </p>
            <Button onClick={() => setGenerateDialogOpen(true)}>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Policy
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}