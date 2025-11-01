import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Programs from "@/pages/Programs";
import Events from "@/pages/Events";
import GetInvolved from "@/pages/GetInvolved";
import Resources from "@/pages/Resources";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import BlogManagement from "@/pages/admin/BlogManagement";
import EventsManagement from "@/pages/admin/EventsManagement";
import Submissions from "@/pages/admin/Submissions";

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");
  
  return (
    <div key={location} className={isAdminRoute ? "" : "page-transition-enter"}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/programs" component={Programs} />
        <Route path="/events" component={Events} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/blog" component={Blog} />
        <Route path="/get-involved" component={GetInvolved} />
        <Route path="/resources" component={Resources} />
        <Route path="/contact" component={Contact} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/blog" component={BlogManagement} />
        <Route path="/admin/events" component={EventsManagement} />
        <Route path="/admin/submissions" component={Submissions} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          {!isAdminRoute && <Navigation />}
          <main className="flex-1">
            <Router />
          </main>
          {!isAdminRoute && <Footer />}
        </div>
        {!isAdminRoute && <ChatWidget />}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
