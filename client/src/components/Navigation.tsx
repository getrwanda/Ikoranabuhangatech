import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoUrl from "@assets/logo_1761563218042.png";

export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'KN'>('EN');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/programs', label: 'Programs' },
    { path: '/events', label: 'Events' },
    { path: '/blog', label: 'Blog' },
    { path: '/get-involved', label: 'Get Involved' },
    { path: '/resources', label: 'Resources' },
    { path: '/contact', label: 'Contact' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'KN' : 'EN');
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm'
          : 'bg-background'
      }`}
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-md px-2 py-1 -ml-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" 
            data-testid="link-home"
            aria-label="Ikoranabuhanga Rigezweho - Home"
          >
            <img src={logoUrl} alt="Ikoranabuhanga Rigezweho Logo" className="h-12 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <Button
                  variant="ghost"
                  className={`text-sm font-medium transition-colors ${
                    location === link.path
                      ? 'text-primary'
                      : 'text-foreground/80'
                  }`}
                  data-testid={`link-${link.label.toLowerCase().replace(' ', '-')}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              data-testid="button-language-toggle"
              aria-label={`Switch language to ${language === 'EN' ? 'Kinyarwanda' : 'English'}`}
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">{language}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-11 w-11 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="button-menu-toggle"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden border-t py-4 animate-in slide-in-from-top-4 duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {navLinks.map((link, index) => (
                <Link key={link.path} href={link.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start transition-all duration-200 mobile-nav-item ${
                      location === link.path
                        ? 'bg-secondary text-primary'
                        : 'text-foreground/80'
                    }`}
                    onClick={() => setIsOpen(false)}
                    data-testid={`mobile-link-${link.label.toLowerCase().replace(' ', '-')}`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
