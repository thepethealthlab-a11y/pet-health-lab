import { Star, Dog, Cat } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Golden Retriever owner",
    content: "This symptom checker helped me know when to rush my dog to the vet. Potentially saved his life!",
    rating: 5,
    icon: Dog,
  },
  {
    name: "Mike R.",
    role: "Cat parent",
    content: "Finally tracking vaccines is so easy. The reminders are perfect timing.",
    rating: 5,
    icon: Cat,
  },
  {
    name: "Jennifer L.",
    role: "Labrador owner",
    content: "The toxic food scanner gives me peace of mind every time I feed my curious puppy.",
    rating: 5,
    icon: Dog,
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-muted/30" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4">
        <header className="text-center max-w-3xl mx-auto mb-12">
          <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Pet Parents Like You
          </h2>
        </header>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12" role="list">
          {testimonials.map((testimonial, index) => {
            const Icon = testimonial.icon;
            return (
              <article
                key={index}
                className="p-6 bg-card rounded-lg border border-border transition-all duration-300 animate-fade-in flex flex-col"
                style={{ animationDelay: `${index * 100}ms` }}
                role="listitem"
                itemScope
                itemType="https://schema.org/Review"
              >
                <div className="flex gap-1 mb-4" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                  <meta itemProp="ratingValue" content={testimonial.rating.toString()} />
                  <meta itemProp="bestRating" content="5" />
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" aria-label="star rating" />
                  ))}
                </div>
                
                <p className="text-foreground mb-6 leading-relaxed flex-grow" itemProp="reviewBody">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3 mt-auto" itemProp="author" itemScope itemType="https://schema.org/Person">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center" aria-label={`${testimonial.name} avatar`}>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground" itemProp="name">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm md:text-base text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">50,000+</span>
            <span>Symptom Checks</span>
          </div>
          <span className="hidden md:inline">|</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">10,000+</span>
            <span>Active Users</span>
          </div>
          <span className="hidden md:inline">|</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">4.8</span>
            <Star className="h-4 w-4 fill-primary text-primary inline" />
            <span>Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
