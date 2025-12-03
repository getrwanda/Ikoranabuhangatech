import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  LogOut,
  Menu,
  Settings,
  History,
  Image as ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { KeyboardShortcuts } from "@/components/admin/KeyboardShortcuts";
import { NotificationBadge } from "@/components/admin/NotificationBadge";
import { useQuery } from "@tanstack/react-query";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lastKey, setLastKey] = useState<string | null>(null);

  // Poll for unread submission counts every 60 seconds
  const { data: unreadCounts } = useQuery<{ success: boolean; data: { total: number } }>({
    queryKey: ["/api/admin/unread-counts"],
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: FileText, label: "Blog Posts", path: "/admin/blog" },
    { icon: ImageIcon, label: "Media Library", path: "/admin/media" },
    { icon: Calendar, label: "Events", path: "/admin/events" },
    { icon: Users, label: "Students", path: "/admin/students" },
    { icon: Users, label: "Mentor Matching", path: "/admin/mentor-matching" },
    { icon: Users, label: "Submissions", path: "/admin/submissions" },
    { icon: History, label: "Activity Log", path: "/admin/activity-log" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      // Navigation shortcuts (g then ...)
      if (e.key === "g") {
        setLastKey("g");
        // Clear after 1 second if no follow-up
        setTimeout(() => setLastKey(null), 1000);
        return;
      }

      if (lastKey === "g") {
        if (e.key === "d") {
          setLocation("/admin/dashboard");
          setLastKey(null);
        } else if (e.key === "s") {
          setLocation("/admin/submissions");
          setLastKey(null);
        }
      }

      // Search shortcut (Ctrl+K)
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lastKey, setLocation]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        toast({
          title: "Logged out",
          description: "You've been successfully logged out.",
        });
        setLocation("/admin/login");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary/20">
      <KeyboardShortcuts />
      <div className="flex">
        <aside
          className={cn(
            "fixed left-0 top-0 h-screen bg-white dark:bg-gray-950 border-r transition-all duration-300 z-40",
            sidebarOpen ? "w-64" : "w-20"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h1 className={cn(
                  "font-heading font-bold text-primary transition-opacity",
                  sidebarOpen ? "opacity-100" : "opacity-0 w-0"
                )}>
                  Admin Panel
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  data-testid="button-toggle-sidebar"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative",
                      location === item.path
                        ? "bg-primary text-white"
                        : "hover:bg-secondary"
                    )}
                    data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className={cn(
                      "transition-opacity",
                      sidebarOpen ? "opacity-100" : "opacity-0 w-0"
                    )}>
                      {item.label}
                    </span>
                    {item.label === "Submissions" && unreadCounts?.data?.total ? (
                      <NotificationBadge count={unreadCounts.data.total} />
                    ) : null}
                  </a>
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="h-5 w-5" />
                <span className={cn(
                  "transition-opacity",
                  sidebarOpen ? "opacity-100" : "opacity-0 w-0"
                )}>
                  Logout
                </span>
              </Button>
            </div>
          </div>
        </aside>

        <main
          className={cn(
            "flex-1 transition-all duration-300",
            sidebarOpen ? "ml-64" : "ml-20"
          )}
        >
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
