import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { organizationApi } from '@/lib/api'
import { useAuth } from '@/app/providers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Building, User, Shield, Save, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'E-commerce',
  'Education',
  'Manufacturing',
  'Consulting',
  'Other',
]

const COMPLIANCE_FRAMEWORKS = [
  { value: 'SOC 2', label: 'SOC 2' },
  { value: 'ISO 27001', label: 'ISO 27001' },
  { value: 'GDPR', label: 'GDPR' },
  { value: 'HIPAA', label: 'HIPAA' },
  { value: 'PCI DSS', label: 'PCI DSS' },
]

interface Organization {
  name: string
  industry?: string
  employee_count?: number
  compliance_targets?: string[]
}

export function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([])

  const { data: organization, isLoading } = useQuery({
    queryKey: ['organization'],
    queryFn: async (): Promise<Organization> => {
      const response = await organizationApi.get()
      return response.data
    },
  })

  const form = useForm({
    defaultValues: {
      name: '',
      industry: '',
      employee_count: '',
    },
  })

  const watchedIndustry = form.watch('industry');

  // Set form values when organization data loads
  useEffect(() => {
    if (organization) {
      form.reset({
        name: organization.name,
        industry: organization.industry || '',
        employee_count: organization.employee_count?.toString() || '',
      })
      setSelectedFrameworks(organization.compliance_targets || [])
    }
  }, [organization, form])

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return organizationApi.update({
        ...data,
        employee_count: data.employee_count ? Number(data.employee_count) : null,
        compliance_targets: selectedFrameworks,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] })
      toast({
        title: 'Settings saved',
        description: 'Your organization settings have been updated.',
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

  const toggleFramework = (framework: string) => {
    setSelectedFrameworks((prev) =>
      prev.includes(framework)
        ? prev.filter((f) => f !== framework)
        : [...prev, framework]
    )
  }

  const handleSave = (data: any) => {
    updateMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your organization and account settings</p>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your personal account details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-500">Name</Label>
              <p className="font-medium">{user?.full_name}</p>
            </div>
            <div>
              <Label className="text-gray-500">Email</Label>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <Label className="text-gray-500">Role</Label>
              <Badge variant="secondary" className="mt-1">
                {user?.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Organization Settings
          </CardTitle>
          <CardDescription>
            Configure your organization details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                {...form.register('name')}
                defaultValue={organization?.name}
                placeholder="Your Company Name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={watchedIndustry || organization?.industry}
                  onValueChange={(value) => form.setValue('industry', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employee_count">Number of Employees</Label>
                <Input
                  id="employee_count"
                  type="number"
                  {...form.register('employee_count')}
                  defaultValue={organization?.employee_count}
                  placeholder="e.g., 50"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={updateMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Compliance Targets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Compliance Targets
          </CardTitle>
          <CardDescription>
            Select the compliance frameworks you're working towards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {COMPLIANCE_FRAMEWORKS.map((framework) => {
              const isSelected = selectedFrameworks.includes(framework.value)
              return (
                <button
                  key={framework.value}
                  type="button"
                  onClick={() => toggleFramework(framework.value)}
                  className={`
                    p-4 rounded-lg border-2 text-left transition-all
                    ${isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{framework.label}</span>
                    {isSelected && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
          <div className="mt-4">
            <Button
              onClick={() => updateMutation.mutate(form.getValues())}
              disabled={updateMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Compliance Targets
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h4 className="font-medium text-red-900">Delete Organization</h4>
              <p className="text-sm text-red-700">
                Permanently delete your organization and all associated data.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => {
                toast({
                  title: 'Not implemented',
                  description: 'This feature is not available in the demo.',
                  variant: 'destructive',
                })
              }}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}