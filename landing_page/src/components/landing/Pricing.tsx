import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Building2, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    icon: Zap,
    price: "$99",
    period: "/month",
    description: "For teams preparing for their first audit",
    features: [
      "Single organization",
      "SOC 2 readiness",
      "Unlimited controls & evidence",
      "Basic export formats"
    ],
    cta: "Start with Starter",
    highlighted: false,
    color: "text-chart-1"
  },
  {
    name: "Growth",
    icon: Star,
    price: "$199",
    period: "/month",
    description: "Full compliance coverage with auditor access",
    features: [
      "SOC 2 + ISO 27001 + GDPR",
      "Auditor access portal",
      "Advanced audit exports",
      "Priority support"
    ],
    cta: "Start with Growth",
    highlighted: true,
    color: "text-primary"
  },
  {
    name: "Consultant",
    icon: Building2,
    price: "$399",
    period: "/month",
    description: "For compliance consultants and agencies",
    features: [
      "Multiple organizations",
      "Client isolation",
      "White-label exports",
      "Dedicated account manager"
    ],
    cta: "Start with Consultant",
    highlighted: false,
    color: "text-chart-3"
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="border-b border-border py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <Star className="h-4 w-4 text-primary" />
            Transparent Pricing
          </div>
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            You should not hide this.
          </p>
        </div>

        {/* Golden ratio inspired - middle card is larger (1.618x emphasis) */}
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3 items-start">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative flex flex-col rounded-xl border p-8 transition-all hover:shadow-lg ${
                plan.highlighted 
                  ? 'border-primary bg-gradient-to-b from-card to-primary/5 shadow-xl scale-105 lg:-mt-4 lg:mb-4' 
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    <Star className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-4 ${plan.highlighted ? 'bg-primary/10' : ''}`}>
                  <plan.icon className={`h-6 w-6 ${plan.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="mb-8 flex-1 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${plan.highlighted ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Check className={`h-3 w-3 ${plan.highlighted ? 'text-primary' : 'text-foreground'}`} />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.highlighted ? "default" : "outline"} 
                className="w-full gap-2"
                size="lg"
                asChild
              >
                <a href="http://localhost:5173/register" className="w-full">
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-muted-foreground">
          If you plan to say "Contact sales," you're scared of your own value.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
