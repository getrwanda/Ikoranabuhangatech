import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  organization: string;
  quote: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Marie Uwimana",
    role: "Program Graduate",
    organization: "ICT Mentorship Program 2023",
    quote: "The digital literacy training I received opened up a world of opportunities. I now have the confidence and skills to pursue a career in technology.",
    initials: "MU",
  },
  {
    name: "Jean Claude Nkusi",
    role: "Mentor",
    organization: "Tech Industry Professional",
    quote: "Being part of this mentorship program allows me to give back to the community and help shape the next generation of Rwandan tech leaders.",
    initials: "JN",
  },
  {
    name: "Grace Mutesi",
    role: "Student",
    organization: "Partner School",
    quote: "Through Ikoranabuhanga Rigezweho, I learned not just technical skills, but also how to use technology responsibly and ethically.",
    initials: "GM",
  },
  {
    name: "David Mugisha",
    role: "School Administrator",
    organization: "Kigali Secondary School",
    quote: "The partnership has transformed how our students engage with technology. We've seen remarkable improvements in their digital competencies.",
    initials: "DM",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-secondary relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            What People Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from students, mentors, and partners about their experiences with our programs
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                  <div className="p-4">
                    <Card className="border-2 h-full card-hover-lift">
                      <CardContent className="p-8">
                        <Quote className="h-8 w-8 text-primary mb-4 opacity-50" />
                        <p className="text-lg text-foreground mb-6 italic leading-relaxed">
                          "{testimonial.quote}"
                        </p>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border-2 border-primary">
                            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                              {testimonial.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">
                              {testimonial.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {testimonial.role}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {testimonial.organization}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
