import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Golden Retriever Owner",
    content: "ThePetHealthLab helped me identify my dog's allergies early. The symptom checker was incredibly accurate, and my vet was impressed with the detailed report!",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Cat Parent",
    content: "The vaccination tracker is a lifesaver! I never miss important appointments anymore, and the health monitoring features give me peace of mind.",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "Multi-Pet Household",
    content: "Managing health records for three pets was overwhelming until I found this platform. The premium tools are worth every penny!",
    rating: 5,
    avatar: "ER",
  },
  {
    name: "David Thompson",
    role: "First-Time Dog Owner",
    content: "As a new pet parent, this platform taught me so much about pet health. The AI recommendations are spot-on and easy to understand.",
    rating: 5,
    avatar: "DT",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Trusted by Pet Parents Worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of satisfied pet owners who trust ThePetHealthLab for their pet's well-being
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                ))}
              </div>
              
              <p className="text-foreground mb-6 text-lg leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
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

export default Testimonials;
