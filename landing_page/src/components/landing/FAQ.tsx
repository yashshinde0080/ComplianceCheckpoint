import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Scale, Award, Cloud, Bot, MessageCircleQuestion } from "lucide-react";

const faqs = [
  {
    icon: Scale,
    question: "Is this legal advice?",
    answer: "No. This is documentation and readiness tooling. You still need an auditor."
  },
  {
    icon: Award,
    question: "Will this get me certified?",
    answer: "No. It prepares you so the audit doesn't fail for stupid reasons."
  },
  {
    icon: Cloud,
    question: "Do you integrate with AWS/GCP/GitHub?",
    answer: "No. Evidence is uploaded intentionally. Automation comes later, if ever."
  },
  {
    icon: Bot,
    question: "Is there AI?",
    answer: "No. Controls and policies are written by humans who understand audits."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="border-b border-border py-24 bg-muted/20">
      <div className="container">
        {/* Golden ratio layout */}
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-8">
          {/* Left side intro - 3/8 */}
          <div className="lg:col-span-3">
            <div className="sticky top-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-6">
                <MessageCircleQuestion className="h-4 w-4 text-primary" />
                FAQ
              </div>
              <h2 className="text-3xl font-semibold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Answer the hard questions.
              </p>

              {/* Visual element */}
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-chart-2/10 rounded-full blur-3xl" />
                <div className="relative flex h-32 w-32 items-center justify-center rounded-2xl border-2 border-chart-2/20 bg-card shadow-lg">
                  <HelpCircle className="h-16 w-16 text-chart-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Right side content - 5/8 */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-border bg-card p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-border">
                    <AccordionTrigger className="text-left text-foreground hover:no-underline py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                          <faq.icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-14 pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm text-foreground text-center">
                This honesty builds trust. <span className="text-muted-foreground">Anyone selling otherwise is lying.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
