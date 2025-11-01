import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { exportToCSV } from "@/lib/exportCsv";
import type { PartnerApplication, MentorApplicationType, VolunteerApplicationType, Contact } from "@shared/schema";

export default function Submissions() {
  const { data: partners, isLoading: isLoadingPartners } = useQuery<{ success: boolean; data: PartnerApplication[] }>({
    queryKey: ["/api/admin/submissions/partners"],
  });

  const { data: mentors, isLoading: isLoadingMentors } = useQuery<{ success: boolean; data: MentorApplicationType[] }>({
    queryKey: ["/api/admin/submissions/mentors"],
  });

  const { data: volunteers, isLoading: isLoadingVolunteers } = useQuery<{ success: boolean; data: VolunteerApplicationType[] }>({
    queryKey: ["/api/admin/submissions/volunteers"],
  });

  const { data: contacts, isLoading: isLoadingContacts } = useQuery<{ success: boolean; data: Contact[] }>({
    queryKey: ["/api/admin/submissions/contacts"],
  });

  const handleExportPartners = () => {
    if (partners?.data) {
      const exportData = partners.data.map((app) => ({
        Name: app.name,
        Email: app.email,
        Phone: app.phone,
        Organization: app.organizationName,
        "Organization Type": app.organizationType,
        Location: app.location,
        "Partnership Goals": app.partnershipGoals,
        "Resource Contribution": Array.isArray(app.resourceContribution) ? app.resourceContribution.join("; ") : "",
        Timeline: app.partnershipTimeline,
        "Submitted Date": format(new Date(app.createdAt), "MMM d, yyyy HH:mm"),
      }));
      exportToCSV(exportData, "partner-applications");
    }
  };

  const handleExportMentors = () => {
    if (mentors?.data) {
      const exportData = mentors.data.map((app) => ({
        Name: app.name,
        Email: app.email,
        Phone: app.phone,
        "Professional Title": app.professionalTitle,
        "Expertise Areas": Array.isArray(app.expertiseAreas) ? app.expertiseAreas.join("; ") : "",
        "Years of Experience": app.yearsOfExperience,
        Availability: Array.isArray(app.availability) ? app.availability.join("; ") : "",
        "Preferred Format": app.preferredFormat,
        "Age Group": app.ageGroupPreference,
        Languages: Array.isArray(app.languages) ? app.languages.join("; ") : "",
        "Submitted Date": format(new Date(app.createdAt), "MMM d, yyyy HH:mm"),
      }));
      exportToCSV(exportData, "mentor-applications");
    }
  };

  const handleExportVolunteers = () => {
    if (volunteers?.data) {
      const exportData = volunteers.data.map((app) => ({
        Name: app.name,
        Email: app.email,
        Phone: app.phone,
        Skills: Array.isArray(app.skills) ? app.skills.join("; ") : "",
        "Availability Frequency": app.availabilityFrequency,
        "Time Commitment": app.timeCommitment,
        "Location Flexibility": app.locationFlexibility,
        "Interest Areas": Array.isArray(app.interestAreas) ? app.interestAreas.join("; ") : "",
        "Submitted Date": format(new Date(app.createdAt), "MMM d, yyyy HH:mm"),
      }));
      exportToCSV(exportData, "volunteer-applications");
    }
  };

  const handleExportContacts = () => {
    if (contacts?.data) {
      const exportData = contacts.data.map((contact) => ({
        Name: contact.name,
        Email: contact.email,
        Message: contact.message,
        Type: contact.type,
        "Submitted Date": format(new Date(contact.createdAt), "MMM d, yyyy HH:mm"),
      }));
      exportToCSV(exportData, "contact-submissions");
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">Submissions Dashboard</h1>
            <p className="text-muted-foreground">View and manage all form submissions</p>
          </div>

          <Tabs defaultValue="partners" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="partners" data-testid="tab-partners">
                Partners ({partners?.data?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="mentors" data-testid="tab-mentors">
                Mentors ({mentors?.data?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="volunteers" data-testid="tab-volunteers">
                Volunteers ({volunteers?.data?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="contacts" data-testid="tab-contacts">
                Contact ({contacts?.data?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="partners" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Partner Applications</CardTitle>
                  <Button
                    variant="outline"
                    onClick={handleExportPartners}
                    disabled={!partners?.data || partners.data.length === 0}
                    data-testid="button-export-partners"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingPartners ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : partners?.data?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No partner applications yet</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Organization</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Submitted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {partners?.data?.map((app) => (
                          <TableRow key={app.id} data-testid={`row-partner-${app.id}`}>
                            <TableCell className="font-medium" data-testid={`text-name-${app.id}`}>{app.name}</TableCell>
                            <TableCell data-testid={`text-email-${app.id}`}>{app.email}</TableCell>
                            <TableCell data-testid={`text-organization-${app.id}`}>{app.organizationName}</TableCell>
                            <TableCell data-testid={`text-type-${app.id}`}>{app.organizationType}</TableCell>
                            <TableCell data-testid={`text-location-${app.id}`}>{app.location}</TableCell>
                            <TableCell data-testid={`text-date-${app.id}`}>{format(new Date(app.createdAt), "MMM d, yyyy")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mentors" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Mentor Applications</CardTitle>
                  <Button
                    variant="outline"
                    onClick={handleExportMentors}
                    disabled={!mentors?.data || mentors.data.length === 0}
                    data-testid="button-export-mentors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingMentors ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : mentors?.data?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No mentor applications yet</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Experience</TableHead>
                          <TableHead>Expertise</TableHead>
                          <TableHead>Submitted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mentors?.data?.map((app) => (
                          <TableRow key={app.id} data-testid={`row-mentor-${app.id}`}>
                            <TableCell className="font-medium" data-testid={`text-name-${app.id}`}>{app.name}</TableCell>
                            <TableCell data-testid={`text-email-${app.id}`}>{app.email}</TableCell>
                            <TableCell data-testid={`text-title-${app.id}`}>{app.professionalTitle}</TableCell>
                            <TableCell data-testid={`text-experience-${app.id}`}>{app.yearsOfExperience}</TableCell>
                            <TableCell data-testid={`text-expertise-${app.id}`}>
                              {Array.isArray(app.expertiseAreas) ? app.expertiseAreas.slice(0, 2).join(", ") : ""}
                              {Array.isArray(app.expertiseAreas) && app.expertiseAreas.length > 2 ? "..." : ""}
                            </TableCell>
                            <TableCell data-testid={`text-date-${app.id}`}>{format(new Date(app.createdAt), "MMM d, yyyy")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="volunteers" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Volunteer Applications</CardTitle>
                  <Button
                    variant="outline"
                    onClick={handleExportVolunteers}
                    disabled={!volunteers?.data || volunteers.data.length === 0}
                    data-testid="button-export-volunteers"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingVolunteers ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : volunteers?.data?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No volunteer applications yet</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Skills</TableHead>
                          <TableHead>Availability</TableHead>
                          <TableHead>Time Commitment</TableHead>
                          <TableHead>Submitted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {volunteers?.data?.map((app) => (
                          <TableRow key={app.id} data-testid={`row-volunteer-${app.id}`}>
                            <TableCell className="font-medium" data-testid={`text-name-${app.id}`}>{app.name}</TableCell>
                            <TableCell data-testid={`text-email-${app.id}`}>{app.email}</TableCell>
                            <TableCell data-testid={`text-skills-${app.id}`}>
                              {Array.isArray(app.skills) ? app.skills.slice(0, 2).join(", ") : ""}
                              {Array.isArray(app.skills) && app.skills.length > 2 ? "..." : ""}
                            </TableCell>
                            <TableCell data-testid={`text-availability-${app.id}`}>{app.availabilityFrequency}</TableCell>
                            <TableCell data-testid={`text-commitment-${app.id}`}>{app.timeCommitment}</TableCell>
                            <TableCell data-testid={`text-date-${app.id}`}>{format(new Date(app.createdAt), "MMM d, yyyy")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Contact Submissions</CardTitle>
                  <Button
                    variant="outline"
                    onClick={handleExportContacts}
                    disabled={!contacts?.data || contacts.data.length === 0}
                    data-testid="button-export-contacts"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingContacts ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : contacts?.data?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No contact submissions yet</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Submitted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contacts?.data?.map((contact) => (
                          <TableRow key={contact.id} data-testid={`row-contact-${contact.id}`}>
                            <TableCell className="font-medium" data-testid={`text-name-${contact.id}`}>{contact.name}</TableCell>
                            <TableCell data-testid={`text-email-${contact.id}`}>{contact.email}</TableCell>
                            <TableCell data-testid={`text-message-${contact.id}`}>
                              {contact.message.length > 50 ? `${contact.message.substring(0, 50)}...` : contact.message}
                            </TableCell>
                            <TableCell data-testid={`text-type-${contact.id}`}>{contact.type}</TableCell>
                            <TableCell data-testid={`text-date-${contact.id}`}>{format(new Date(contact.createdAt), "MMM d, yyyy")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
