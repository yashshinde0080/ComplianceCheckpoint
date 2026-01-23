import { TrendingUp, Cloud, MousePointerClick, LayoutDashboard, FileCheck, FileText, Search, Download, ArrowRight, Sparkles } from "lucide-react";

const othersSell = [
  { icon: TrendingUp, text: "Continuous monitoring" },
  { icon: Cloud, text: "Deep cloud integrations" },
  { icon: MousePointerClick, text: '"Compliance in one click"' },
  { icon: LayoutDashboard, text: "Fancy dashboards" }
];

const whatWorks = [
  { icon: FileCheck, text: "Clear controls" },
  { icon: FileText, text: "Proper documentation" },
  { icon: Search, text: "Traceable evidence" },
  { icon: Download, text: "Clean exports" }
];

const Difference = () => {
  return (
    <section className="border-b border-border py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            Our Approach
          </div>
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            How This Is Different
          </h2>
          <p className="text-muted-foreground text-lg">
            And why that's the point.
          </p>
        </div>

        {/* Golden ratio comparison: 38.2% : 61.8% */}
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-8">
          {/* What others sell - 3/8 (37.5%) */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-muted/30 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-muted/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h3 className="mb-8 text-lg font-medium text-muted-foreground flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold">✗</span>
              What others sell
            </h3>
            <div className="space-y-4 relative">
              {othersSell.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-background/30">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow indicator */}
          <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <ArrowRight className="h-12 w-12 text-primary" />
              <span className="text-sm text-muted-foreground text-center">What actually<br/>matters</span>
            </div>
          </div>

          {/* What works - 5/8 (62.5%) but adjusted for arrow */}
          <div className="lg:col-span-3 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
            <h3 className="mb-8 text-lg font-semibold text-foreground flex items-center gap-3 relative">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">✓</span>
              What actually passes audits
            </h3>
            <div className="space-y-4 relative">
              {whatWorks.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-background/50 border border-border">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quote section with golden ratio padding */}
        <div className="mx-auto mt-16 max-w-3xl">
          <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-8 text-center">
            <blockquote className="text-xl text-foreground mb-4">
              "ComplianceCheckpoint chooses <span className="text-primary font-semibold">boring correctness</span> over theatrical automation."
            </blockquote>
            <p className="text-muted-foreground">
              That's not a positioning weakness. <span className="font-semibold text-foreground">That's the moat.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Difference;
