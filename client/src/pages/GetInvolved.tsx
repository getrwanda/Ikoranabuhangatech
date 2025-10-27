import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ImigongoPattern, ImigongoAccent } from "@/components/ImigongoPattern";
import { Handshake, Users, Heart, Mail, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  type: z.string(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function GetInvolved() {
  const [activeForm, setActiveForm] = useState<'partner' | 'mentor' | 'volunteer'>('partner');
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      type: activeForm,
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const endpoints: Record<typeof activeForm, string> = {
        partner: "/api/partner-inquiry",
        mentor: "/api/mentor-application",
        volunteer: "/api/volunteer-application",
      };
      
      return await apiRequest("POST", endpoints[activeForm], data);
    },
    onSuccess: () => {
      const messages: Record<typeof activeForm, string> = {
        partner: "Thank you for your partnership inquiry. We'll get back to you soon.",
        mentor: "Thank you for your mentor application. We'll contact you shortly.",
        volunteer: "Thank you for your volunteer interest. We'll be in touch soon.",
      };
      
      toast({
        title: "Submission Received!",
        description: messages[activeForm],
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send submission. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    submitMutation.mutate(data);
  };

  const opportunities = [
    {
      id: 'partner',
      icon: Handshake,
      title: "Partner With Us",
      description: "We collaborate with schools, NGOs, and government agencies to advance digital education. Let's work together to empower Rwandan youth with essential 21st-century skills.",
      color: "text-primary",
      benefits: [
        "Expand digital literacy in your community",
        "Access to training materials and resources",
        "Joint impact reporting and visibility",
        "Technical support and capacity building",
      ],
    },
    {
      id: 'mentor',
      icon: Users,
      title: "Become a Mentor",
      description: "ICT professionals and entrepreneurs can mentor students, share knowledge, and guide the next generation of tech leaders.",
      color: "text-accent",
      benefits: [
        "Make a lasting impact on young lives",
        "Share your expertise and experience",
        "Flexible mentoring schedule",
        "Join a community of changemakers",
      ],
    },
    {
      id: 'volunteer',
      icon: Heart,
      title: "Volunteer or Donate",
      description: "Join our movement by volunteering your time or supporting our training and mentorship activities. Every contribution helps expand access to technology and opportunity.",
      color: "text-primary",
      benefits: [
        "Contribute to youth empowerment",
        "Support program sustainability",
        "Tax-deductible contributions",
        "Regular impact updates",
      ],
    },
  ];

  const activeOpportunity = opportunities.find(o => o.id === activeForm);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-accent">
        <ImigongoPattern opacity={0.15} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-white mb-6">
              Get Involved
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
              Join us in building Rwanda's digital future
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {opportunities.map((opportunity, index) => {
              const Icon = opportunity.icon;
              const isActive = activeForm === opportunity.id;
              
              return (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all duration-300 hover-elevate active-elevate-2 ${
                    isActive ? 'border-2 border-primary shadow-lg' : 'border-2'
                  }`}
                  onClick={() => setActiveForm(opportunity.id as typeof activeForm)}
                  data-testid={`card-opportunity-${opportunity.id}`}
                >
                  <CardHeader>
                    <div className={`${opportunity.color} mb-3`}>
                      <Icon className="h-10 w-10" />
                    </div>
                    <CardTitle className="font-heading text-xl">{opportunity.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {opportunity.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      variant={isActive ? "default" : "outline"}
                      data-testid={`button-select-${opportunity.id}`}
                    >
                      {isActive ? "Selected" : "Learn More"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-2">
              <CardHeader className="space-y-4">
                {activeOpportunity && (
                  <>
                    <div className="flex items-center gap-4">
                      <div className={`${activeOpportunity.color}`}>
                        <activeOpportunity.icon className="h-12 w-12" />
                      </div>
                      <div>
                        <CardTitle className="font-heading text-2xl mb-2">
                          {activeOpportunity.title}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {activeOpportunity.description}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="bg-secondary rounded-md p-6">
                      <h3 className="font-heading font-semibold text-lg mb-4">Benefits</h3>
                      <ul className="space-y-2">
                        {activeOpportunity.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-primary text-xl">•</span>
                            <span className="text-muted-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardHeader>

              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} data-testid="input-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your interest and how you'd like to contribute..."
                              className="min-h-32"
                              {...field}
                              data-testid="input-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gap-2"
                      disabled={submitMutation.isPending}
                      data-testid="button-submit-form"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-6">
              Questions?
            </h2>
            <ImigongoAccent className="w-24 mx-auto mb-6" />
            <p className="text-lg text-muted-foreground mb-8">
              Reach out to us directly at{" "}
              <a href="mailto:info@ikoranabuhanga.tech" className="text-primary hover:underline font-medium" data-testid="link-email-direct">
                info@ikoranabuhanga.tech
              </a>
              {" "}or call us at{" "}
              <a href="tel:+250788331033" className="text-primary hover:underline font-medium" data-testid="link-phone-direct">
                +250 788 331 033
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
