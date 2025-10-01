import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Important information about our educational tools
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem 
              value="item-1" 
              className="bg-background border border-border rounded-lg px-6 shadow-sm"
            >
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Are these tools a replacement for veterinary care?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-2">
                No, our tools provide educational information only. Always consult your veterinarian for medical diagnosis and treatment.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem 
              value="item-2" 
              className="bg-background border border-border rounded-lg px-6 shadow-sm"
            >
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                How accurate are your AI health insights?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-2">
                Our tools offer research-based educational information. For medical concerns, always consult your veterinarian.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
