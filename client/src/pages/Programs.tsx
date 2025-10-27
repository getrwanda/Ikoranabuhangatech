import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImigongoPattern, ImigongoAccent } from "@/components/ImigongoPattern";
import { BookOpen, Users, Megaphone, Check, Calendar, Target, Award } from "lucide-react";

export default function Programs() {
  const programs = [
    {
      icon: BookOpen,
      title: "Digital Literacy Clubs",
      subtitle: "Ikoranabuhanga Clubs",
      description: "Hands-on ICT training clubs established in schools to build foundational digital skills, coding, and creativity.",
      image: "bg-gradient-to-br from-primary/20 to-accent/20",
      features: [
        "Weekly training sessions",
        "Peer-to-peer learning",
        'Monthly "Digital Challenges"',
        "Toolkits and manuals for sustainability",
      ],
      impact: "Over 1,000 students trained across Rwanda",
      details: "Our Digital Literacy Clubs provide students with hands-on experience in computing fundamentals, digital tools, and creative problem-solving. Each club meets weekly for structured learning sessions that combine theory with practical application. Students work on real-world projects, participate in coding challenges, and develop presentations showcasing their learning. The program emphasizes peer-to-peer teaching, allowing advanced students to mentor their classmates and build leadership skills.",
    },
    {
      icon: Users,
      title: "ICT Career Guidance & Mentorship Program",
      subtitle: "Connecting Education to Industry",
      description: "Connecting students with ICT professionals to bridge the gap between education and industry.",
      image: "bg-gradient-to-br from-accent/20 to-primary/20",
      features: [
        "Career days and guest speaker events",
        "Field visits to tech companies",
        "Online mentorship platform",
        "Guidance on digital entrepreneurship",
      ],
      impact: "500+ students mentored and inspired toward ICT careers",
      details: "This program creates meaningful connections between students and working ICT professionals. Through one-on-one mentorship relationships, career exploration events, and company visits, students gain firsthand insight into technology careers. Mentors provide guidance on educational pathways, skill development, and career planning. The program also includes workshops on digital entrepreneurship, helping students understand how to create technology-based businesses and become job creators rather than just job seekers.",
    },
    {
      icon: Megaphone,
      title: "Community Engagement & Awareness",
      subtitle: "Responsible Technology Use",
      description: "Raising awareness on digital safety, responsible use, and inclusive technology adoption.",
      image: "bg-gradient-to-br from-primary/15 to-accent/15",
      features: [
        "Digital Awareness Week campaigns",
        "Workshops for parents and teachers",
        "Community outreach events",
        "Online safety education",
      ],
      impact: "Reaching thousands in communities across Rwanda",
      details: "Our community engagement initiatives extend beyond students to reach parents, teachers, and community leaders. Digital Awareness Week brings together stakeholders to discuss the benefits and challenges of technology adoption. We conduct workshops on digital safety, online privacy, and ethical technology use. These sessions help communities understand how to maximize the benefits of technology while minimizing risks, ensuring that Rwanda's digital transformation is inclusive and sustainable.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-accent">
        <ImigongoPattern opacity={0.15} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-white mb-6">
              Our Programs
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
              Comprehensive initiatives empowering Rwandan youth with digital skills and opportunities
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 max-w-6xl mx-auto">
            {programs.map((program, index) => {
              const Icon = program.icon;
              const isReverse = index % 2 === 1;
              
              return (
                <div
                  key={index}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                    isReverse ? 'lg:flex-row-reverse' : ''
                  }`}
                  data-testid={`program-${index}`}
                >
                  <div className={isReverse ? 'lg:order-2' : ''}>
                    <Card className={`${program.image} border-2 relative overflow-hidden min-h-[300px] flex items-center justify-center`}>
                      <ImigongoPattern opacity={0.08} />
                      <CardContent className="p-8 relative z-10 text-center">
                        <Icon className="h-24 w-24 text-primary mx-auto" />
                      </CardContent>
                    </Card>
                  </div>

                  <div className={isReverse ? 'lg:order-1' : ''}>
                    <div className="mb-4">
                      <Icon className="h-10 w-10 text-primary mb-3" />
                      <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-2">
                        {program.title}
                      </h2>
                      <p className="text-accent font-medium text-lg">{program.subtitle}</p>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {program.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      {program.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-secondary rounded-md p-4 mb-6 flex items-center gap-3">
                      <Award className="h-8 w-8 text-accent flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Impact</p>
                        <p className="font-semibold text-foreground">{program.impact}</p>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="lg" className="gap-2" data-testid={`button-learn-more-${index}`}>
                          Learn More
                          <Target className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="font-heading text-2xl flex items-center gap-3">
                            <Icon className="h-8 w-8 text-primary" />
                            {program.title}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-muted-foreground leading-relaxed">
                            {program.details}
                          </p>
                          
                          <div>
                            <h4 className="font-heading font-semibold text-lg mb-3">Key Features</h4>
                            <div className="space-y-2">
                              {program.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                  <span className="text-muted-foreground">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-secondary rounded-md p-6">
                            <h4 className="font-heading font-semibold text-lg mb-2 flex items-center gap-2">
                              <Award className="h-6 w-6 text-accent" />
                              Impact Achieved
                            </h4>
                            <p className="text-muted-foreground">{program.impact}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-6">
              Ready to Get Involved?
            </h2>
            <ImigongoAccent className="w-24 mx-auto mb-8" />
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Join us in empowering Rwandan youth with digital skills and mentorship opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild data-testid="button-partner-cta">
                <a href="/get-involved">Partner With Us</a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-mentor-cta">
                <a href="/get-involved">Become a Mentor</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
