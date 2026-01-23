import { Library, FileEdit, Upload, Users, Download, ArrowRight, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Library,
    title: "Structured Control Library",
    description: "Predefined SOC 2, ISO 27001, and GDPR controls with clear intent, evidence requirements, and auditor-facing language.",
    detail: 'Bad controls = failed audits. We don\'t outsource this to "AI."',
    color: "bg-chart-1/10 text-chart-1 border-chart-1/20",
    highlights: ["Clear control intent", "Evidence requirements", "Auditor-facing language"]
  },
  {
    icon: FileEdit,
    title: "Editable Policy Templates",
    description: "Generate policies from proven templates, then edit them. Markdown-based, versioned, with approval status tracked.",
    detail: "Locked policies are amateur hour. Auditors hate them.",
    color: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    highlights: ["Markdown-based", "Version controlled", "Approval tracking"]
  },
  {
    icon: Upload,
    title: "Evidence Collection That Makes Sense",
    description: "Upload evidence per control. Versioned files, hash-verified, status tracked (pending / accepted).",
    detail: 'No more shared drives named "SOC2_FINAL_v7_REALLY_FINAL".',
    color: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    highlights: ["Versioned files", "Hash-verified", "Status tracking"]
  },
  {
    icon: Users,
    title: "Task Ownership & Deadlines",
    description: "Every control maps to an owner, a due date, and a completion state.",
    detail: '"Everyone thought someone else handled it" — not anymore.',
    color: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    highlights: ["Assigned owners", "Clear deadlines", "Completion states"]
  },
  {
    icon: Download,
    title: "Auditor-Ready Export",
    description: "Export a clean package: controls, policies, evidence, and metadata. Hand it to an auditor without embarrassment.",
    detail: "If this isn't instant, your product doesn't work.",
    color: "bg-chart-5/10 text-chart-5 border-chart-5/20",
    highlights: ["PDF & ZIP exports", "Complete metadata", "Audit-ready format"]
  }
];

const Features = () => {
  return (
    <section id="features" className="border-b border-border py-24 bg-muted/20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <Library className="h-4 w-4 text-primary" />
            Product Features
          </div>
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            What You Actually Get
          </h2>
          <p className="text-muted-foreground text-lg">
            Product reality, not marketing. These are the tools that make audits pass.
          </p>
        </div>

        {/* Alternating layout with golden ratio */}
        <div className="mx-auto max-w-6xl space-y-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`grid lg:grid-cols-8 gap-6 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content side - 5/8 (62.5%) */}
              <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="rounded-xl border border-border bg-card p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-5">
                    <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border ${feature.color}`}>
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-3 text-xl font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="mb-4 text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {feature.highlights.map((highlight, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                            <CheckCircle2 className="h-3 w-3 text-primary" />
                            {highlight}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm italic text-muted-foreground border-l-2 border-primary/30 pl-3">
                        {feature.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual indicator side - 3/8 (37.5%) */}
              <div className={`lg:col-span-3 hidden lg:flex items-center justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 ${feature.color.split(' ')[0]}`} />
                  <div className={`relative flex h-32 w-32 items-center justify-center rounded-2xl border-2 ${feature.color} bg-card shadow-lg`}>
                    <feature.icon className="h-16 w-16" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
