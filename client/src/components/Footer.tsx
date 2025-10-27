import { Link } from "wouter";
import { Facebook, Linkedin, Youtube, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { ImigongoPattern } from "./ImigongoPattern";
import logoUrl from "@assets/logo_1761563218042.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-secondary border-t">
      <ImigongoPattern opacity={0.05} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <img src={logoUrl} alt="Ikoranabuhanga Rigezweho" className="h-12 w-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Building Rwanda's Future through Digital Literacy and Mentorship
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-home">Home</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-about">About</Link></li>
              <li><Link href="/programs" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-programs">Programs</Link></li>
              <li><Link href="/get-involved" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-get-involved">Get Involved</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Programs</h3>
            <ul className="space-y-2">
              <li><span className="text-sm text-muted-foreground">Digital Literacy Clubs</span></li>
              <li><span className="text-sm text-muted-foreground">ICT Mentorship</span></li>
              <li><span className="text-sm text-muted-foreground">Community Engagement</span></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">NR24, Rwanda</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="tel:+250788331033" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-phone">
                  +250 788 331 033
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="mailto:info@ikoranabuhanga.tech" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-email">
                  info@ikoranabuhanga.tech
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" data-testid="social-link-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" data-testid="social-link-linkedin">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" data-testid="social-link-youtube">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" data-testid="social-link-twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} Ikoranabuhanga Rigezweho®. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
