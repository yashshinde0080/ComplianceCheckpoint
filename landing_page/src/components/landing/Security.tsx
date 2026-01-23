import { Shield, Hash, Lock, Eye, Server, Key, ShieldCheck } from "lucide-react";

const securityFeatures = [
  {
    icon: Server,
    title: "Row-level org isolation",
    description: "Complete data separation between organizations",
    color: "text-chart-1"
  },
  {
    icon: Hash,
    title: "Evidence file hashing",
    description: "Cryptographic verification of all uploads",
    color: "text-chart-2"
  },
  {
    icon: Key,
    title: "Role-based access",
    description: "Founder, Admin, Contributor, Auditor roles",
    color: "text-chart-3"
  },
  {
    icon: Eye,
    title: "Read-only auditor accounts",
    description: "Secure view-only access for auditors",
    color: "text-chart-4"
  }
];

const Security = () => {
  return (
    <section className="border-b border-border py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container">
        {/* Golden ratio layout: 38.2% intro, 61.8% content */}
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-8 items-center">
          {/* Left side - 3/8 */}
          <div className="lg:col-span-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-6">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Security
            </div>
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              Security & Trust
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Say less, mean more.
            </p>
            
            {/* Large security icon */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
              <div className="relative flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-primary/20 bg-card shadow-xl">
                <Shield className="h-20 w-20 text-primary" />
              </div>
            </div>
          </div>

          {/* Right side - 5/8 */}
          <div className="lg:col-span-5">
            <div className="grid sm:grid-cols-2 gap-4">
              {securityFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="group rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/20 transition-all"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-4 group-hover:bg-primary/10 transition-colors`}>
                    <feature.icon className={`h-6 w-6 ${feature.color} group-hover:text-primary transition-colors`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
                <Lock className="h-4 w-4" />
                No "military-grade encryption" nonsense. Just correct security fundamentals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;
