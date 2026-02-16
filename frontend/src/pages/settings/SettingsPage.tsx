import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { organizationApi } from '@/lib/api'
import { useAuth } from '@/app/providers'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MagicBentoCard, MagicBentoGrid } from '@/components/ui/MagicBento'
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
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your organization and account settings</p>
      </div>

      <MagicBentoGrid className="space-y-6">
        {/* User Info */}
        <MagicBentoCard className="magic-bento-card--border-glow animate-fade-in min-h-[200px]" spotlightColor="132, 0, 255">
          <CardHeader className="relative z-30">
            <CardTitle className="flex items-center text-lg font-bold">
              <User className="h-5 w-5 mr-2 text-primary" />
              Account Information
            </CardTitle>
            <CardDescription className="text-muted-foreground/60">
              Your personal account details
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label className="text-foreground/40 text-[10px] uppercase font-bold tracking-widest">Name</Label>
                <p className="font-bold text-foreground">{user?.full_name}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-foreground/40 text-[10px] uppercase font-bold tracking-widest">Email</Label>
                <p className="font-bold text-foreground">{user?.email}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-foreground/40 text-[10px] uppercase font-bold tracking-widest">System Role</Label>
                <div className="mt-1">
                  <Badge className="bg-primary/20 text-primary border-primary/20 text-[10px] font-bold uppercase tracking-wider">
                    {user?.role}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </MagicBentoCard>

        {/* Organization Settings */}
        <MagicBentoCard
          className="magic-bento-card--border-glow animate-fade-in"
          style={{ animationDelay: '100ms' }}
          spotlightColor="132, 0, 255"
        >
          <CardHeader className="relative z-30">
            <CardTitle className="flex items-center text-lg font-bold">
              <Building className="h-5 w-5 mr-2 text-primary" />
              Organization Profile
            </CardTitle>
            <CardDescription className="text-muted-foreground/60">
              Configure your professional environment
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-30">
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-bold text-xs uppercase tracking-wider">Organization Name</Label>
                <Input
                  id="name"
                  className="bg-white/5 border-white/10 text-foreground focus:border-primary/50 transition-colors"
                  {...form.register('name')}
                  defaultValue={organization?.name}
                  placeholder="Your Company Name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-foreground font-bold text-xs uppercase tracking-wider">Industry</Label>
                  <Select
                    value={watchedIndustry || organization?.industry}
                    onValueChange={(value) => form.setValue('industry', value)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-foreground">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employee_count" className="text-foreground font-bold text-xs uppercase tracking-wider">Employee Count</Label>
                  <Input
                    id="employee_count"
                    type="number"
                    className="bg-white/5 border-white/10 text-foreground"
                    {...form.register('employee_count')}
                    defaultValue={organization?.employee_count}
                    placeholder="e.g., 50"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="btn-gradient shadow-lg px-8" disabled={updateMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateMutation.isPending ? 'Syncing...' : 'Save Settings'}
                </Button>
              </div>
            </form>
          </CardContent>
        </MagicBentoCard>

        {/* Compliance Targets */}
        <MagicBentoCard
          className="magic-bento-card--border-glow animate-fade-in"
          style={{ animationDelay: '200ms' }}
          spotlightColor="132, 0, 255"
        >
          <CardHeader className="relative z-30">
            <CardTitle className="flex items-center text-lg font-bold">
              <Shield className="h-5 w-5 mr-2 text-success" />
              Compliance Frameworks
            </CardTitle>
            <CardDescription className="text-muted-foreground/60">
              Select targets to activate specialized libraries
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COMPLIANCE_FRAMEWORKS.map((framework) => {
                const isSelected = selectedFrameworks.includes(framework.value)
                return (
                  <button
                    key={framework.value}
                    type="button"
                    onClick={() => toggleFramework(framework.value)}
                    className={`
                      p-5 rounded-2xl border transition-all relative group
                      ${isSelected
                        ? 'border-primary/40 bg-primary/10'
                        : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold transition-colors ${isSelected ? 'text-primary' : 'text-foreground/80'}`}>
                        {framework.label}
                      </span>
                      {isSelected && (
                        <div className="bg-primary p-1 rounded-full shadow-glow-sm">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="mt-8">
              <Button
                onClick={() => updateMutation.mutate(form.getValues())}
                className="bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all w-full md:w-auto h-11 px-8 font-bold"
                disabled={updateMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Update Frameworks
              </Button>
            </div>
          </CardContent>
        </MagicBentoCard>

        {/* Danger Zone */}
        <MagicBentoCard
          className="magic-bento-card--border-glow border-red-900/20 bg-red-950/10 animate-fade-in"
          style={{ animationDelay: '300ms' }}
          spotlightColor="239, 68, 68"
        >
          <CardHeader className="relative z-30">
            <CardTitle className="text-red-500 font-bold tracking-tight">System Termination</CardTitle>
            <CardDescription className="text-red-900/60 font-medium">
              Permanent administrative actions
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-red-500/5 rounded-2xl border border-red-500/10">
              <div>
                <h4 className="font-bold text-red-500">Delete Organization</h4>
                <p className="text-xs text-red-900/80 mt-1 leading-relaxed">
                  This action will wipe all controls, evidence, and audit logs. This cannot be undone.
                </p>
              </div>
              <Button
                variant="destructive"
                className="px-8 shadow-lg shadow-red-900/40"
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
        </MagicBentoCard>
      </MagicBentoGrid>
    </div>
  )
}