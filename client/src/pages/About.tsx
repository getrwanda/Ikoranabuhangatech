import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImigongoPattern, ImigongoAccent } from "@/components/ImigongoPattern";
import { Award, Lightbulb, Users, Handshake, Target, Eye, Heart, Download } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Integrity",
      description: "Promoting ethical and responsible ICT use.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Encouraging creativity and problem-solving through technology.",
    },
    {
      icon: Users,
      title: "Inclusion",
      description: "Bridging the digital divide for all communities.",
    },
    {
      icon: Handshake,
      title: "Collaboration",
      description: "Partnering with schools, government, and NGOs for shared impact.",
    },
  ];

  const alignments = [
    {
      category: "NST2 Pillars",
      items: [
        { title: "Economic Transformation", desc: "Advancing development through technology" },
        { title: "Social Transformation", desc: "Equipping citizens with ICT skills" },
        { title: "Good Governance", desc: "Enhancing digital literacy for transparent institutions" },
      ],
    },
    {
      category: "UN SDGs",
      items: [
        { title: "SDG 4 – Quality Education", desc: "Ensuring equitable learning opportunities" },
        { title: "SDG 8 – Decent Work", desc: "Enabling employability through digital skills" },
        { title: "SDG 9 – Innovation", desc: "Fostering creativity and infrastructure development" },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-accent">
        <ImigongoPattern opacity={0.15} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-white mb-6">
              About Us
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
              Empowering Rwandan youth to drive national transformation through technology
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-6 text-center">
              Who We Are
            </h2>
            <ImigongoAccent className="w-24 mx-auto mb-8" />
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Ikoranabuhanga Rigezweho® is a Rwandan initiative empowering young people with digital literacy, mentorship, and ethical ICT awareness. Our work contributes to Rwanda's transformation into a knowledge-based economy by fostering innovation and inclusion.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-2" data-testid="card-mission">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-8 w-8 text-primary" />
                  <CardTitle className="font-heading text-2xl">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To equip Rwandan youth with digital skills and mentorship that enable them to succeed in the fast-changing digital economy.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2" data-testid="card-vision">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="h-8 w-8 text-accent" />
                  <CardTitle className="font-heading text-2xl">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  A Rwanda where every young person is digitally literate, ethically aware, and empowered to contribute to national development through technology.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
              Our Values
            </h2>
            <ImigongoAccent className="w-24 mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="hover-elevate active-elevate-2 transition-all duration-300 text-center" data-testid={`card-value-${index}`}>
                  <CardContent className="p-6">
                    <div className="bg-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
              Alignment with National & Global Goals
            </h2>
            <ImigongoAccent className="w-24 mx-auto mb-6" />
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Ikoranabuhanga Rigezweho® supports Rwanda's Vision 2050 and contributes to global sustainable development
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {alignments.map((alignment, idx) => (
              <Card key={idx} className="border-2" data-testid={`card-alignment-${idx}`}>
                <CardHeader>
                  <CardTitle className="font-heading text-2xl text-center mb-4">
                    {alignment.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alignment.items.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <Award className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden" data-testid="card-founder">
              <ImigongoPattern opacity={0.03} />
              <CardContent className="p-8 md:p-12 relative z-10">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-heading font-bold text-3xl">JG</span>
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
                    Joe Sure Gasore
                  </h3>
                  <p className="text-accent font-medium">Founder & Project Lead</p>
                </div>
                <blockquote className="text-center italic text-lg text-muted-foreground leading-relaxed border-l-4 border-primary pl-6">
                  "Our goal is to inspire and equip young Rwandans with the tools, knowledge, and mentorship they need to thrive in the digital age."
                </blockquote>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-6">
              Download Our Resources
            </h2>
            <p className="text-muted-foreground mb-8">
              Learn more about our initiatives and impact through our detailed documentation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" data-testid="button-download-concept">
                <Download className="h-5 w-5" />
                Concept Note (PDF)
              </Button>
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-download-summary">
                <Download className="h-5 w-5" />
                Executive Summary (PDF)
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
