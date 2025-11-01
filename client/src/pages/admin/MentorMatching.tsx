import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMentorMatchSchema, type MentorMatch, type InsertMentorMatch, type MentorApplicationType, type Student } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";

const matchFormSchema = insertMentorMatchSchema.extend({
  mentorId: z.string().min(1, "Mentor is required"),
  studentId: z.string().min(1, "Student is required"),
  status: z.enum(['active', 'completed', 'paused']),
});

type MatchWithDetails = MentorMatch & {
  mentor?: MentorApplicationType;
  student?: Student;
};

export default function MentorMatching() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<MentorMatch | null>(null);
  const [deletingMatch, setDeletingMatch] = useState<MentorMatch | null>(null);
  const [viewingMatch, setViewingMatch] = useState<MatchWithDetails | null>(null);

  const { data: matches, isLoading: isLoadingMatches } = useQuery<{ success: boolean; data: MentorMatch[] }>({
    queryKey: ["/api/admin/mentor-matches"],
  });

  const { data: mentors, isLoading: isLoadingMentors } = useQuery<{ success: boolean; data: MentorApplicationType[] }>({
    queryKey: ["/api/admin/submissions/mentors"],
  });

  const { data: students, isLoading: isLoadingStudents } = useQuery<{ success: boolean; data: Student[] }>({
    queryKey: ["/api/admin/students"],
  });

  const form = useForm<InsertMentorMatch>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      mentorId: "",
      studentId: "",
      status: "active",
      startDate: new Date(),
      endDate: null,
      notes: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertMentorMatch) => {
      return apiRequest("POST", "/api/admin/mentor-matches", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/mentor-matches"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Mentor match created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create mentor match",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertMentorMatch> }) => {
      return apiRequest("PATCH", `/api/admin/mentor-matches/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/mentor-matches"] });
      setEditingMatch(null);
      form.reset();
      toast({
        title: "Success",
        description: "Mentor match updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update mentor match",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/mentor-matches/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/mentor-matches"] });
      setDeletingMatch(null);
      toast({
        title: "Success",
        description: "Mentor match deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete mentor match",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertMentorMatch) => {
    if (editingMatch) {
      updateMutation.mutate({ id: editingMatch.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (match: MentorMatch) => {
    setEditingMatch(match);
    form.reset({
      mentorId: match.mentorId,
      studentId: match.studentId,
      status: match.status as "active" | "completed" | "paused",
      startDate: new Date(match.startDate),
      endDate: match.endDate ? new Date(match.endDate) : null,
      notes: match.notes || "",
    });
  };

  const handleDelete = (match: MentorMatch) => {
    setDeletingMatch(match);
  };

  const confirmDelete = () => {
    if (deletingMatch) {
      deleteMutation.mutate(deletingMatch.id);
    }
  };

  const closeDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingMatch(null);
    form.reset();
  };

  const handleViewMatch = (match: MentorMatch) => {
    const mentor = mentors?.data?.find((m) => m.id === match.mentorId);
    const student = students?.data?.find((s) => s.id === match.studentId);
    setViewingMatch({ ...match, mentor, student });
  };

  const getMentorName = (mentorId: string) => {
    return mentors?.data?.find((m) => m.id === mentorId)?.name || "Unknown Mentor";
  };

  const getStudentName = (studentId: string) => {
    return students?.data?.find((s) => s.id === studentId)?.name || "Unknown Student";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-heading font-bold text-primary">Mentor Matching Dashboard</h1>
              <p className="text-muted-foreground">Create and manage mentor-student matches</p>
            </div>
            <Dialog open={isCreateDialogOpen || !!editingMatch} onOpenChange={(open) => !open && closeDialog()}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-match">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Match
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingMatch ? "Edit Mentor Match" : "Create New Mentor Match"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="mentorId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mentor</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-mentor">
                                <SelectValue placeholder="Select mentor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingMentors ? (
                                <SelectItem value="loading" disabled>Loading mentors...</SelectItem>
                              ) : mentors?.data?.length === 0 ? (
                                <SelectItem value="none" disabled>No mentors available</SelectItem>
                              ) : (
                                mentors?.data?.map((mentor) => (
                                  <SelectItem key={mentor.id} value={mentor.id}>
                                    {mentor.name} - {mentor.professionalTitle}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="studentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-student">
                                <SelectValue placeholder="Select student" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingStudents ? (
                                <SelectItem value="loading" disabled>Loading students...</SelectItem>
                              ) : students?.data?.length === 0 ? (
                                <SelectItem value="none" disabled>No students available</SelectItem>
                              ) : (
                                students?.data?.map((student) => (
                                  <SelectItem key={student.id} value={student.id}>
                                    {student.name} - {student.school} ({student.grade})
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-status">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="paused">Paused</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              value={field.value instanceof Date ? format(field.value, "yyyy-MM-dd") : ""}
                              onChange={(e) => field.onChange(new Date(e.target.value))}
                              data-testid="input-start-date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              value={field.value instanceof Date ? format(field.value, "yyyy-MM-dd") : ""}
                              onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                              data-testid="input-end-date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea {...field} value={field.value || ""} placeholder="Additional notes about this match" rows={3} data-testid="input-notes" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={closeDialog} data-testid="button-cancel">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-submit">
                        {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingMatch ? "Update" : "Create"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Mentor-Student Matches</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingMatches || isLoadingMentors || isLoadingStudents ? (
                <div className="text-center py-8">Loading...</div>
              ) : matches?.data?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No matches yet</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mentor</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matches?.data?.map((match) => (
                      <TableRow key={match.id} data-testid={`row-match-${match.id}`}>
                        <TableCell className="font-medium" data-testid={`text-mentor-${match.id}`}>
                          {getMentorName(match.mentorId)}
                        </TableCell>
                        <TableCell data-testid={`text-student-${match.id}`}>
                          {getStudentName(match.studentId)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(match.status)} data-testid={`badge-status-${match.id}`}>
                            {match.status}
                          </Badge>
                        </TableCell>
                        <TableCell data-testid={`text-start-date-${match.id}`}>
                          {format(new Date(match.startDate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell data-testid={`text-end-date-${match.id}`}>
                          {match.endDate ? format(new Date(match.endDate), "MMM d, yyyy") : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewMatch(match)}
                              data-testid={`button-view-${match.id}`}
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(match)}
                              data-testid={`button-edit-${match.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(match)}
                              data-testid={`button-delete-${match.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={!!viewingMatch} onOpenChange={() => setViewingMatch(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Match Details</DialogTitle>
            </DialogHeader>
            {viewingMatch && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">Mentor Information</h3>
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{viewingMatch.mentor?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Title</p>
                      <p className="font-medium">{viewingMatch.mentor?.professionalTitle || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{viewingMatch.mentor?.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{viewingMatch.mentor?.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expertise Areas</p>
                      <p className="font-medium">{viewingMatch.mentor?.expertiseAreas?.join(", ") || "N/A"}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">Student Information</h3>
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{viewingMatch.student?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">School</p>
                      <p className="font-medium">{viewingMatch.student?.school || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Grade</p>
                      <p className="font-medium">{viewingMatch.student?.grade || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{viewingMatch.student?.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Learning Goals</p>
                      <p className="font-medium">{viewingMatch.student?.learningGoals?.join(", ") || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold text-primary">Match Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={getStatusColor(viewingMatch.status)}>
                        {viewingMatch.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">{format(new Date(viewingMatch.startDate), "MMMM d, yyyy")}</p>
                    </div>
                    {viewingMatch.endDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">End Date</p>
                        <p className="font-medium">{format(new Date(viewingMatch.endDate), "MMMM d, yyyy")}</p>
                      </div>
                    )}
                  </div>
                  {viewingMatch.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="font-medium">{viewingMatch.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deletingMatch} onOpenChange={() => setDeletingMatch(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this mentor-student match. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} data-testid="button-confirm-delete">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminLayout>
    </ProtectedRoute>
  );
}
