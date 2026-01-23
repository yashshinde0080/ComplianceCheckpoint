import { Check, X, Building2, Users, Briefcase, Building, MonitorCog, Zap } from "lucide-react";

const builtFor = [
  {
    icon: Building2,
    text: "SaaS founders preparing for first SOC 2",
    color: "text-chart-1"
  },
  {
    icon: Users,
    text: "Small security teams without GRC staff",
    color: "text-chart-2"
  },
  {
    icon: Briefcase,
    text: "Consultants managing compliance for multiple clients",
    color: "text-chart-3"
  }
];

const notBuiltFor = [
  {
    icon: Building,
    text: "Enterprises with dedicated GRC platforms"
  },
  {
    icon: MonitorCog,
    text: "Teams expecting real-time security monitoring"
  },
  {
    icon: Zap,
    text: 'Anyone looking for "certification in 7 days"'
  }
];

const Audience = () => {
  return (
    <section className="border-b border-border py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <Users className="h-4 w-4 text-primary" />
            Target Audience
          </div>
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            Who This Is For <span className="text-muted-foreground">(And Who It's Not)</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            This section filters bad leads. If you're not in the first column, we're not a fit.
          </p>
        </div>

        {/* Golden ratio grid: 61.8% : 38.2% */}
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-8">
          {/* Built for - 5/8 (62.5%, close to 61.8%) */}
          <div className="lg:col-span-5 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Built for:</h3>
            </div>
            <div className="space-y-6">
              {builtFor.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-card border border-border ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <span className="text-foreground font-medium">{item.text}</span>
                  </div>
                  <Check className="h-5 w-5 flex-shrink-0 text-primary mt-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Not built for - 3/8 (37.5%, close to 38.2%) */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-muted/30 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <X className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-muted-foreground">Not built for:</h3>
            </div>
            <div className="space-y-4">
              {notBuiltFor.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg">
                  <item.icon className="h-5 w-5 flex-shrink-0 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Audience;
