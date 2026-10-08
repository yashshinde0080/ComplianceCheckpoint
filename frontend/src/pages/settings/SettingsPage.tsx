import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '@/components/layout/PageHeader'
import { organizationApi } from '@/lib/api'
import { useAuth } from '@/app/providers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { PageSkeleton } from '@/components/common/PageStates'
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
import { cn } from '@/lib/utils'

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
    return <PageSkeleton count={3} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Settings" subtitle="Manage your organization and account settings" />

      <div className="space-y-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <User className="h-5 w-5 text-primary" />
              Account Information
            </CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Name
                </Label>
                <p className="truncate font-semibold text-foreground" title={user?.full_name}>
                  {user?.full_name}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email
                </Label>
                <p className="truncate font-semibold text-foreground" title={user?.email}>
                  {user?.email}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  System Role
                </Label>
                <div>
                  <Badge className="border-primary/20 bg-primary/20 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {user?.role}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Building className="h-5 w-5 text-primary" />
              Organization Profile
            </CardTitle>
            <CardDescription>Configure your professional environment</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Organization Name
                  </Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    defaultValue={organization?.name}
                    placeholder="Your Company Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Industry
                  </Label>
                  <Select
                    value={watchedIndustry || organization?.industry}
                    onValueChange={(value) => form.setValue('industry', value)}
                  >
                    <SelectTrigger id="industry">
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
                  <Label htmlFor="employee_count" className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Employee Count
                  </Label>
                  <Input
                    id="employee_count"
                    type="number"
                    {...form.register('employee_count')}
                    defaultValue={organization?.employee_count}
                    placeholder="e.g., 50"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="btn-gradient shadow-lg" disabled={updateMutation.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {updateMutation.isPending ? 'Syncing...' : 'Save Settings'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Compliance Frameworks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Shield className="h-5 w-5 text-success" />
              Compliance Frameworks
            </CardTitle>
            <CardDescription>Select targets to activate specialized libraries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
              {COMPLIANCE_FRAMEWORKS.map((framework) => {
                const isSelected = selectedFrameworks.includes(framework.value)
                return (
                  <button
                    key={framework.value}
                    type="button"
                    onClick={() => toggleFramework(framework.value)}
                    className={cn(
                      'flex items-center justify-between gap-2 rounded-xl border p-4 text-left transition-all',
                      isSelected
                        ? 'border-primary/40 bg-primary/10'
                        : 'border-border/60 bg-white/[0.02] hover:border-white/20'
                    )}
                  >
                    <span
                      className={cn(
                        'truncate text-sm font-semibold transition-colors',
                        isSelected ? 'text-primary' : 'text-foreground/80'
                      )}
                    >
                      {framework.label}
                    </span>
                    {isSelected && (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary shadow-glow-sm">
                        <Check className="h-3 w-3 text-white" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => updateMutation.mutate(form.getValues())}
                variant="outline"
                disabled={updateMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                Update Frameworks
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20 bg-destructive/[0.04]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-destructive">
              System Termination
            </CardTitle>
            <CardDescription>Permanent administrative actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-5 md:flex-row md:items-center">
              <div className="min-w-0">
                <h4 className="font-semibold text-destructive">Delete Organization</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  This action will wipe all controls, evidence, and audit logs. This cannot be undone.
                </p>
              </div>
              <Button
                variant="destructive"
                className="shrink-0"
                onClick={() => {
                  toast({
                    title: 'Demo Protection Active',
                    description: 'Organizational deletion is disabled in the prototype environment.',
                    variant: 'destructive',
                  })
                }}
              >
                Terminate Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
