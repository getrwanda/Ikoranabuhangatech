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
import { TableSearch } from "@/components/admin/TableSearch";
import { DateRangePicker } from "@/components/admin/DateRangePicker";
import { TablePagination } from "@/components/admin/TablePagination";
import { useTableFilters } from "@/hooks/useTableFilters";
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

  // Partner filters
  const partnerFilters = useTableFilters({
    data: partners?.data || [],
    searchFields: ["name", "email", "organizationName", "location"],
    dateField: "createdAt",
  });

  // Mentor filters
  const mentorFilters = useTableFilters({
    data: mentors?.data || [],
    searchFields: ["name", "email", "professionalTitle"],
    dateField: "createdAt",
  });

  // Volunteer filters
  const volunteerFilters = useTableFilters({
    data: volunteers?.data || [],
    searchFields: ["name", "email"],
    dateField: "createdAt",
  });

  // Contact filters
  const contactFilters = useTableFilters({
    data: contacts?.data || [],
    searchFields: ["name", "email", "message"],
    dateField: "createdAt",
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
                <CardHeader className="space-y-4">
                  <div className="flex flex-row items-center justify-between">
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
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <TableSearch
                      value={partnerFilters.searchQuery}
                      onChange={partnerFilters.setSearchQuery}
                      placeholder="Search by name, email, organization..."
                    />
                    <DateRangePicker
                      value={partnerFilters.dateRange}
                      onChange={partnerFilters.setDateRange}
                    />
                  </div>
                  {partnerFilters.totalItems > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {partnerFilters.totalItems} result{partnerFilters.totalItems !== 1 ? 's' : ''} found
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {isLoadingPartners ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : partnerFilters.totalItems === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {partnerFilters.searchQuery || partnerFilters.dateRange ? 'No results found' : 'No partner applications yet'}
                    </div>
                  ) : (
                    <>
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
                          {partnerFilters.data.map((app) => (
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
                      {partnerFilters.totalPages > 1 && (
                        <TablePagination
                          currentPage={partnerFilters.currentPage}
                          totalPages={partnerFilters.totalPages}
                          pageSize={partnerFilters.pageSize}
                          totalItems={partnerFilters.totalItems}
                          onPageChange={partnerFilters.setCurrentPage}
                          onPageSizeChange={partnerFilters.setPageSize}
                        />
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mentors" className="space-y-4">
              <Card>
                <CardHeader className="space-y-4">
                  <div className="flex flex-row items-center justify-between">
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
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <TableSearch
                      value={mentorFilters.searchQuery}
                      onChange={mentorFilters.setSearchQuery}
                      placeholder="Search by name, email, title..."
                    />
                    <DateRangePicker
                      value={mentorFilters.dateRange}
                      onChange={mentorFilters.setDateRange}
                    />
                  </div>
                  {mentorFilters.totalItems > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {mentorFilters.totalItems} result{mentorFilters.totalItems !== 1 ? 's' : ''} found
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {isLoadingMentors ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : mentorFilters.totalItems === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {mentorFilters.searchQuery || mentorFilters.dateRange ? 'No results found' : 'No mentor applications yet'}
                    </div>
                  ) : (
                    <>
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
                          {mentorFilters.data.map((app) => (
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
                      {mentorFilters.totalPages > 1 && (
                        <TablePagination
                          currentPage={mentorFilters.currentPage}
                          totalPages={mentorFilters.totalPages}
                          pageSize={mentorFilters.pageSize}
                          totalItems={mentorFilters.totalItems}
                          onPageChange={mentorFilters.setCurrentPage}
                          onPageSizeChange={mentorFilters.setPageSize}
                        />
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="volunteers" className="space-y-4">
              <Card>
                <CardHeader className="space-y-4">
                  <div className="flex flex-row items-center justify-between">
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
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <TableSearch
                      value={volunteerFilters.searchQuery}
                      onChange={volunteerFilters.setSearchQuery}
                      placeholder="Search by name, email..."
                    />
                    <DateRangePicker
                      value={volunteerFilters.dateRange}
                      onChange={volunteerFilters.setDateRange}
                    />
                  </div>
                  {volunteerFilters.totalItems > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {volunteerFilters.totalItems} result{volunteerFilters.totalItems !== 1 ? 's' : ''} found
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {isLoadingVolunteers ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : volunteerFilters.totalItems === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {volunteerFilters.searchQuery || volunteerFilters.dateRange ? 'No results found' : 'No volunteer applications yet'}
                    </div>
                  ) : (
                    <>
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
                          {volunteerFilters.data.map((app) => (
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
                      {volunteerFilters.totalPages > 1 && (
                        <TablePagination
                          currentPage={volunteerFilters.currentPage}
                          totalPages={volunteerFilters.totalPages}
                          pageSize={volunteerFilters.pageSize}
                          totalItems={volunteerFilters.totalItems}
                          onPageChange={volunteerFilters.setCurrentPage}
                          onPageSizeChange={volunteerFilters.setPageSize}
                        />
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4">
              <Card>
                <CardHeader className="space-y-4">
                  <div className="flex flex-row items-center justify-between">
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
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <TableSearch
                      value={contactFilters.searchQuery}
                      onChange={contactFilters.setSearchQuery}
                      placeholder="Search by name, email, message..."
                    />
                    <DateRangePicker
                      value={contactFilters.dateRange}
                      onChange={contactFilters.setDateRange}
                    />
                  </div>
                  {contactFilters.totalItems > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {contactFilters.totalItems} result{contactFilters.totalItems !== 1 ? 's' : ''} found
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {isLoadingContacts ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : contactFilters.totalItems === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {contactFilters.searchQuery || contactFilters.dateRange ? 'No results found' : 'No contact submissions yet'}
                    </div>
                  ) : (
                    <>
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
                          {contactFilters.data.map((contact) => (
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
                      {contactFilters.totalPages > 1 && (
                        <TablePagination
                          currentPage={contactFilters.currentPage}
                          totalPages={contactFilters.totalPages}
                          pageSize={contactFilters.pageSize}
                          totalItems={contactFilters.totalItems}
                          onPageChange={contactFilters.setCurrentPage}
                          onPageSizeChange={contactFilters.setPageSize}
                        />
                      )}
                    </>
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
