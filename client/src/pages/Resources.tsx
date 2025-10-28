import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImigongoPattern, ImigongoAccent } from "@/components/ImigongoPattern";
import { Download, FileText, Calendar, Users, Award, ExternalLink } from "lucide-react";

export default function Resources() {
  const documents = [
    {
      title: "Concept Note",
      description: "Comprehensive overview of our mission, programs, and impact strategy",
      type: "PDF",
      size: "2.4 MB",
      icon: FileText,
    },
    {
      title: "Executive Summary",
      description: "One-page overview of Ikoranabuhanga Rigezweho® initiatives",
      type: "PDF",
      size: "850 KB",
      icon: FileText,
    },
    {
      title: "Program Reports",
      description: "Detailed reports on our digital literacy and mentorship programs",
      type: "PDF",
      size: "3.1 MB",
      icon: FileText,
    },
    {
      title: "Digital Literacy Toolkits",
      description: "Training materials and resources for educators and mentors",
      type: "ZIP",
      size: "12.5 MB",
      icon: FileText,
    },
  ];

  const news = [
    {
      title: "Digital Awareness Week 2024 Success",
      date: "March 2024",
      category: "Event",
      description: "Over 500 participants joined our Digital Awareness Week campaign, learning about online safety, digital entrepreneurship, and responsible technology use.",
      image: "bg-gradient-to-br from-primary/20 to-accent/20",
    },
    {
      title: "New Partnership with Tech Hub Kigali",
      date: "February 2024",
      category: "Partnership",
      description: "Excited to announce our collaboration with Tech Hub Kigali to provide students with access to cutting-edge technology and mentorship opportunities.",
      image: "bg-gradient-to-br from-accent/20 to-primary/20",
    },
    {
      title: "1000th Student Milestone Reached",
      date: "January 2024",
      category: "Impact",
      description: "We're proud to announce that we've now trained over 1,000 students through our Digital Literacy Clubs across Rwanda.",
      image: "bg-gradient-to-br from-primary/15 to-accent/15",
    },
    {
      title: "Mentor Training Workshop Series",
      date: "December 2023",
      category: "Training",
      description: "Successfully conducted a series of training workshops for 50 new ICT professional mentors joining our network.",
      image: "bg-gradient-to-br from-accent/15 to-primary/15",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-accent">
        <ImigongoPattern opacity={0.15} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-white mb-6">
              Resources & News
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
              Stay informed about our impact and access our program materials
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
              Download Our Resources
            </h2>
            <ImigongoAccent className="w-24 mx-auto mb-6" />
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Access our comprehensive program documentation, training materials, and impact reports
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {documents.map((doc, index) => {
              const Icon = doc.icon;
              return (
                <Card key={index} className="hover-elevate active-elevate-2 transition-all duration-300 border-2" data-testid={`card-resource-${index}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="bg-secondary rounded-md p-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="secondary">{doc.type}</Badge>
                    </div>
                    <CardTitle className="font-heading text-xl">{doc.title}</CardTitle>
                    <CardDescription>{doc.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{doc.size}</span>
                    <Button className="gap-2" data-testid={`button-download-${index}`}>
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
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
              News & Events
            </h2>
            <ImigongoAccent className="w-24 mx-auto mb-6" />
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Latest updates from our programs and community impact initiatives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {news.map((item, index) => (
              <Card key={index} className="hover-elevate active-elevate-2 transition-all duration-300 overflow-hidden" data-testid={`card-news-${index}`}>
                <div className={`${item.image} h-48 relative`}>
                  <ImigongoPattern opacity={0.1} />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-foreground">{item.category}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{item.date}</span>
                  </div>
                  <CardTitle className="font-heading text-xl">{item.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
              Videos & Activities
            </h2>
            <ImigongoAccent className="w-24 mx-auto mb-6" />
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Watch our programs in action and see the impact of digital literacy and mentorship
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Card className="border-2 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video w-full">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/videoseries?list=UUFsQPyykV-_Yqe7yfocaisA"
                    title="Ikoranabuhanga Rigezweho YouTube Channel"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center mt-6">
              <a 
                href="https://www.youtube.com/channel/UCFsQPyykV-_Yqe7yfocaisA" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2" data-testid="button-youtube-channel">
                  Visit Our YouTube Channel
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-4xl mx-auto border-2 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
            <ImigongoPattern opacity={0.03} />
            <CardContent className="p-8 md:p-12 relative z-10 text-center">
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-foreground mb-4">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Stay updated with our latest programs, success stories, and opportunities to get involved in Rwanda's digital transformation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-md border-2 border-border focus:border-primary focus:outline-none"
                  data-testid="input-newsletter-email"
                />
                <Button size="lg" className="gap-2" data-testid="button-subscribe">
                  Subscribe
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
