import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImigongoPattern, ImigongoAccent } from "@/components/ImigongoPattern";
import { BookOpen, Users, Megaphone, ArrowRight, TrendingUp, School, Award } from "lucide-react";

function AnimatedCounter({ value, suffix = "", duration = 2000 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const start = 0;
    const end = value;
    const increment = end / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, value, duration]);

  return (
    <div ref={counterRef} className="font-display font-bold text-4xl md:text-5xl text-primary mb-2">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function Home() {
  const [currentPartner, setCurrentPartner] = useState(0);
  
  const stats = [
    { number: 1500, suffix: "+", label: "Youth Empowered", icon: Users },
    { number: 15, suffix: "+", label: "Partner Schools", icon: School },
    { number: 500, suffix: "+", label: "Mentorship Connections", icon: Award },
    { number: 100, suffix: "%", label: "NST2 & SDG Aligned", icon: TrendingUp },
  ];

  const pillars = [
    {
      icon: BookOpen,
      title: "Digital Literacy Training",
      description: "Building ICT skills through practical, hands-on learning.",
      color: "text-primary",
    },
    {
      icon: Users,
      title: "ICT Mentorship & Career Guidance",
      description: "Connecting students with tech professionals and industry insights.",
      color: "text-accent",
    },
    {
      icon: Megaphone,
      title: "Community Engagement",
      description: "Promoting responsible and ethical technology use across society.",
      color: "text-primary",
    },
  ];

  const partners = [
    "Government of Rwanda",
    "Local Schools",
    "Tech Companies",
    "NGO Partners",
    "International Organizations",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-accent">
        <ImigongoPattern opacity={0.15} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
              Building Rwanda's Future through Digital Literacy and Mentorship
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              We aim to nurture a young tech-savvy community by empowering Rwandan youth with digital skills, mentorship, and ethical ICT values.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/get-involved">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 min-h-14 gap-2 btn-hover-lift" data-testid="button-join-mission">
                  Join Our Mission
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/get-involved">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 min-h-14 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 btn-hover-lift" 
                  data-testid="button-partner"
                >
                  Partner With Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-6">
              Who We Are
            </h2>
            <ImigongoAccent className="w-24 mx-auto mb-6" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ikoranabuhanga Rigezweho® is a Rwandan youth empowerment initiative promoting digital literacy, mentorship, and responsible ICT use. We believe that every young person deserves the opportunity to thrive in the digital economy.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
              Our Core Focus
            </h2>
            <ImigongoAccent className="w-24 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <Card key={index} className="hover-elevate active-elevate-2 card-hover-scale transition-all duration-300 border-2 cursor-pointer" data-testid={`card-pillar-${index}`}>
                  <CardContent className="p-8">
                    <div className={`${pillar.color} mb-4 transition-transform duration-300 hover:scale-110`}>
                      <Icon className="h-12 w-12" />
                    </div>
                    <h3 className="font-heading font-semibold text-xl mb-3 text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
              Our Impact
            </h2>
            <ImigongoAccent className="w-24 mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center border-2 relative overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-stat-${index}`}>
                  <ImigongoPattern opacity={0.03} />
                  <CardContent className="p-8 relative z-10">
                    <Icon className="h-8 w-8 text-accent mx-auto mb-4" />
                    <AnimatedCounter value={stat.number} suffix={stat.suffix} duration={2000} />
                    <div className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary relative overflow-hidden">
        <ImigongoPattern opacity={0.05} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <svg className="h-12 w-12 text-primary mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <blockquote className="font-heading text-2xl sm:text-3xl md:text-4xl font-medium text-foreground italic leading-relaxed">
              "We aim to nurture a young tech-savvy community ready to innovate, lead, and transform Rwanda."
            </blockquote>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
              Our Partners
            </h2>
            <ImigongoAccent className="w-24 mx-auto mb-8" />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              {partners.map((partner, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-base px-6 py-3"
                  data-testid={`badge-partner-${index}`}
                >
                  {partner}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
