import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Shield, CheckCircle2, Award, FileCheck, Users } from "lucide-react";
import dashboardPreview from "@/assets/dashboard-preview.png";

const Hero = () => {
  return (
    <section className="border-b border-border py-24 lg:py-32 bg-gradient-to-b from-muted/30 to-background">
      <div className="container">
        {/* Golden ratio: 38.2% for text, 61.8% for visual impact */}
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left content - 2/5 (40%, close to 38.2%) */}
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-6">
              <Shield className="h-4 w-4 text-primary" />
              Compliance readiness that auditors don't laugh at
            </div>
            
            <h1 className="mb-6 text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
              Prepare for audits.{" "}
              <span className="text-primary">Don't guess.</span>
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              ComplianceCheckpoint helps SaaS teams document controls, track evidence, and export auditor-ready artifacts for SOC 2, ISO 27001, and GDPR.
            </p>
            
            <div className="mb-8 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10">
                  <span className="text-destructive text-xs">✗</span>
                </div>
                No continuous monitoring.
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10">
                  <span className="text-destructive text-xs">✗</span>
                </div>
                No fake "one-click compliance."
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                </div>
                Just structured execution.
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="gap-2">
                Start compliance readiness
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <FileText className="h-4 w-4" />
                View sample export
              </Button>
            </div>
          </div>

          {/* Right content - 3/5 (60%, close to 61.8%) */}
          <div className="lg:col-span-3">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
              <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-accent/30 blur-2xl" />
              
              <div className="relative overflow-hidden rounded-xl border border-border shadow-2xl bg-card">
                <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-destructive/60" />
                  <div className="h-3 w-3 rounded-full bg-chart-1" />
                  <div className="h-3 w-3 rounded-full bg-chart-2" />
                  <span className="ml-2 text-xs text-muted-foreground">ComplianceCheckpoint Dashboard</span>
                </div>
                <img 
                  src={dashboardPreview} 
                  alt="ComplianceCheckpoint dashboard showing controls, evidence status, and audit progress" 
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Trust indicators - using golden ratio spacing */}
        <div className="mt-20 pt-12 border-t border-border">
          <p className="text-center text-sm text-muted-foreground mb-8">Structured readiness for major compliance frameworks</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border bg-card/50">
              <Award className="h-8 w-8 text-chart-1" />
              <span className="text-sm font-medium text-foreground">SOC 2 Type I</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border bg-card/50">
              <Shield className="h-8 w-8 text-chart-2" />
              <span className="text-sm font-medium text-foreground">ISO 27001</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border bg-card/50">
              <FileCheck className="h-8 w-8 text-chart-3" />
              <span className="text-sm font-medium text-foreground">GDPR & DPIA</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border bg-card/50">
              <FileText className="h-8 w-8 text-chart-4" />
              <span className="text-sm font-medium text-foreground">Audit Exports</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border bg-card/50 col-span-2 md:col-span-1">
              <Users className="h-8 w-8 text-chart-5" />
              <span className="text-sm font-medium text-foreground">Auditor Access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
