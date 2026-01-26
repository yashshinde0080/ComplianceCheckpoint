import { Button } from "@/components/ui/button";
import { ArrowRight, Download, CheckCircle2, Shield, FileCheck, Users } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Main CTA card */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-12 text-center shadow-xl">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-chart-2/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            
            <div className="relative">
              {/* Icon cluster using golden ratio spacing */}
              <div className="flex justify-center gap-4 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-1/10 border border-chart-1/20">
                  <Shield className="h-6 w-6 text-chart-1" />
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 -mt-1">
                  <FileCheck className="h-7 w-7 text-primary" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-3/10 border border-chart-3/20">
                  <Users className="h-6 w-6 text-chart-3" />
                </div>
              </div>

              <h2 className="text-3xl lg:text-4xl font-semibold text-foreground mb-4">
                Get audit-ready without guessing
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                No urgency theater. Just structured execution.
              </p>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center gap-6 mb-10">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  SOC 2 Ready
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  ISO 27001 Controls
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  GDPR Documentation
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="gap-2 px-8" asChild>
                  <a href="http://localhost:5173/register">
                    Start compliance readiness
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download sample SOC 2 export
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
