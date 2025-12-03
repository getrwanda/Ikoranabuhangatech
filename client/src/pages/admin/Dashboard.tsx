import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Users, Mail, Download } from "lucide-react";
import { SubmissionsOverTimeChart } from "@/components/admin/charts/SubmissionsOverTimeChart";
import { ApplicationDistributionChart } from "@/components/admin/charts/ApplicationDistributionChart";
import { DashboardSkeleton } from "@/components/admin/DashboardSkeleton";
import { TrendIndicator } from "@/components/admin/TrendIndicator";
import { DateRangeSelector } from "@/components/admin/DateRangeSelector";
import { DateRange } from "react-day-picker";
import React from "react";

interface DashboardStatsResponse {
  success: boolean;
  data: {
    blogPosts: number;
    events: number;
    partnerApplications: number;
    mentorApplications: number;
    volunteerApplications: number;
    contactSubmissions: number;
    students: number;
    mentorMatches: number;
  };
}

export default function AdminDashboard() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  const { data: stats, isLoading } = useQuery<DashboardStatsResponse>({
    queryKey: ["/api/admin/dashboard-stats"],
  });

  const { data: comparison } = useQuery<{
    success: boolean;
    data: {
      changes: {
        partners: number;
        mentors: number;
        volunteers: number;
        contacts: number;
      };
    };
  }>({
    queryKey: ["/api/admin/dashboard-comparison"],
  });

  const handleExport = () => {
    const queryParams = new URLSearchParams();
    if (dateRange?.from) queryParams.set("startDate", dateRange.from.toISOString());
    if (dateRange?.to) queryParams.set("endDate", dateRange.to.toISOString());

    window.location.href = `/api/admin/export/dashboard?${queryParams.toString()}`;
  };

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
      trend: comparison?.data?.changes?.partners,
    },
    {
      title: "Mentor Applications",
      value: stats?.data?.mentorApplications || 0,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      trend: comparison?.data?.changes?.mentors,
    },
    {
      title: "Volunteer Applications",
      value: stats?.data?.volunteerApplications || 0,
      icon: Users,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      trend: comparison?.data?.changes?.volunteers,
    },
    {
      title: "Contact Submissions",
      value: stats?.data?.contactSubmissions || 0,
      icon: Mail,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
      trend: comparison?.data?.changes?.contacts,
    },
  ];

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h1 className="text-3xl font-heading font-bold text-primary">Dashboard</h1>
              <p className="text-muted-foreground">Welcome to the admin dashboard</p>
            </div>
            <div className="flex items-center space-x-2">
              <DateRangeSelector date={dateRange} setDate={setDateRange} />
              <Button onClick={handleExport} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {isLoading ? (
            <DashboardSkeleton />
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
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold" data-testid={`stat-value-${index}`}>
                        {stat.value}
                      </div>
                      {stat.trend !== undefined && (
                        <TrendIndicator value={stat.trend} />
                      )}
                    </div>
                    {stat.trend !== undefined && (
                      <p className="text-xs text-muted-foreground mt-1">
                        vs. previous 30 days
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-7">
            <SubmissionsOverTimeChart dateRange={dateRange} />
            <ApplicationDistributionChart />
          </div>

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
