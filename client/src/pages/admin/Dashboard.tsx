import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Users, Mail } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/admin/dashboard-stats"],
  });

  const statsCards = [
    {
      title: "Blog Posts",
      value: stats?.data?.blogPosts || 0,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Events",
      value: stats?.data?.events || 0,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Students",
      value: stats?.data?.students || 0,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Mentor Matches",
      value: stats?.data?.mentorMatches || 0,
      icon: Users,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Partner Applications",
      value: stats?.data?.partnerApplications || 0,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Mentor Applications",
      value: stats?.data?.mentorApplications || 0,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Volunteer Applications",
      value: stats?.data?.volunteerApplications || 0,
      icon: Users,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      title: "Contact Submissions",
      value: stats?.data?.contactSubmissions || 0,
      icon: Mail,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
    },
  ];

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to the admin dashboard</p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {statsCards.map((stat, index) => (
                <Card key={index} data-testid={`stat-card-${index}`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" data-testid={`stat-value-${index}`}>
                      {stat.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a
                  href="/admin/blog"
                  className="block px-4 py-3 rounded-lg hover:bg-secondary transition-colors"
                  data-testid="quick-action-blog"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Create Blog Post</p>
                      <p className="text-sm text-muted-foreground">Add new content to the blog</p>
                    </div>
                  </div>
                </a>
                <a
                  href="/admin/events"
                  className="block px-4 py-3 rounded-lg hover:bg-secondary transition-colors"
                  data-testid="quick-action-events"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Create Event</p>
                      <p className="text-sm text-muted-foreground">Schedule a new event</p>
                    </div>
                  </div>
                </a>
                <a
                  href="/admin/submissions"
                  className="block px-4 py-3 rounded-lg hover:bg-secondary transition-colors"
                  data-testid="quick-action-submissions"
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">View Submissions</p>
                      <p className="text-sm text-muted-foreground">Review form submissions</p>
                    </div>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Total Content Items</span>
                  <span className="font-medium">
                    {(stats?.data?.blogPosts || 0) + (stats?.data?.events || 0)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Total Applications</span>
                  <span className="font-medium">
                    {(stats?.data?.partnerApplications || 0) + 
                     (stats?.data?.mentorApplications || 0) + 
                     (stats?.data?.volunteerApplications || 0)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Total Inquiries</span>
                  <span className="font-medium">{stats?.data?.contactSubmissions || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
