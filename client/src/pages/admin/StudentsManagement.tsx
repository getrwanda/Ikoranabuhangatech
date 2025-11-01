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
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertStudentSchema, type Student, type InsertStudent } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";

const studentFormSchema = insertStudentSchema.extend({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  school: z.string().min(2, "School name is required"),
  grade: z.string().min(1, "Grade is required"),
  location: z.string().min(2, "Location is required"),
});

export default function StudentsManagement() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  const { data: students, isLoading } = useQuery<{ success: boolean; data: Student[] }>({
    queryKey: ["/api/admin/students"],
  });

  const form = useForm<InsertStudent>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      school: "",
      grade: "",
      learningGoals: [],
      interests: [],
      location: "",
      parentContact: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertStudent) => {
      return apiRequest("POST", "/api/admin/students", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/students"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Student created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create student",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertStudent> }) => {
      return apiRequest("PATCH", `/api/admin/students/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/students"] });
      setEditingStudent(null);
      form.reset();
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update student",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/students/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/students"] });
      setDeletingStudent(null);
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertStudent) => {
    if (editingStudent) {
      updateMutation.mutate({ id: editingStudent.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    form.reset({
      name: student.name,
      email: student.email,
      phone: student.phone || "",
      school: student.school,
      grade: student.grade,
      learningGoals: student.learningGoals,
      interests: student.interests,
      location: student.location,
      parentContact: student.parentContact || "",
    });
  };

  const handleDelete = (student: Student) => {
    setDeletingStudent(student);
  };

  const confirmDelete = () => {
    if (deletingStudent) {
      deleteMutation.mutate(deletingStudent.id);
    }
  };

  const closeDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingStudent(null);
    form.reset();
  };

  const learningGoalOptions = [
    { id: "web-dev", label: "Web Development" },
    { id: "mobile-dev", label: "Mobile Development" },
    { id: "programming", label: "Programming Basics" },
    { id: "data-science", label: "Data Science" },
    { id: "cybersecurity", label: "Cybersecurity" },
    { id: "ui-ux", label: "UI/UX Design" },
    { id: "digital-literacy", label: "Digital Literacy" },
    { id: "networking", label: "Networking" },
  ];

  const interestOptions = [
    { id: "coding", label: "Coding" },
    { id: "design", label: "Design" },
    { id: "gaming", label: "Gaming" },
    { id: "robotics", label: "Robotics" },
    { id: "ai", label: "Artificial Intelligence" },
    { id: "tech-entrepreneurship", label: "Tech Entrepreneurship" },
    { id: "content-creation", label: "Content Creation" },
    { id: "social-media", label: "Social Media" },
  ];

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-heading font-bold text-primary">Students Management</h1>
              <p className="text-muted-foreground">Manage student profiles</p>
            </div>
            <Dialog open={isCreateDialogOpen || !!editingStudent} onOpenChange={(open) => !open && closeDialog()}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-student">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingStudent ? "Edit Student" : "Create New Student"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter student's full name" data-testid="input-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="student@example.com" data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ""} placeholder="+250..." data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="school"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="School name" data-testid="input-school" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="grade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade/Level</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., S3, University Year 1" data-testid="input-grade" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="City, District" data-testid="input-location" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parentContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent/Guardian Contact (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} placeholder="Parent phone or email" data-testid="input-parent-contact" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="learningGoals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Learning Goals</FormLabel>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {learningGoalOptions.map((option) => (
                              <div key={option.id} className="flex items-center space-x-2">
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || [];
                                    if (checked) {
                                      field.onChange([...current, option.id]);
                                    } else {
                                      field.onChange(current.filter((val) => val !== option.id));
                                    }
                                  }}
                                  data-testid={`checkbox-goal-${option.id}`}
                                />
                                <label className="text-sm">{option.label}</label>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="interests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interest Areas</FormLabel>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {interestOptions.map((option) => (
                              <div key={option.id} className="flex items-center space-x-2">
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || [];
                                    if (checked) {
                                      field.onChange([...current, option.id]);
                                    } else {
                                      field.onChange(current.filter((val) => val !== option.id));
                                    }
                                  }}
                                  data-testid={`checkbox-interest-${option.id}`}
                                />
                                <label className="text-sm">{option.label}</label>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={closeDialog} data-testid="button-cancel">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-submit">
                        {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingStudent ? "Update" : "Create"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Students</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : students?.data?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No students yet</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students?.data?.map((student) => (
                      <TableRow key={student.id} data-testid={`row-student-${student.id}`}>
                        <TableCell className="font-medium" data-testid={`text-name-${student.id}`}>{student.name}</TableCell>
                        <TableCell data-testid={`text-email-${student.id}`}>{student.email}</TableCell>
                        <TableCell data-testid={`text-school-${student.id}`}>{student.school}</TableCell>
                        <TableCell data-testid={`text-grade-${student.id}`}>{student.grade}</TableCell>
                        <TableCell data-testid={`text-location-${student.id}`}>{student.location}</TableCell>
                        <TableCell data-testid={`text-date-${student.id}`}>{format(new Date(student.createdAt), "MMM d, yyyy")}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(student)}
                              data-testid={`button-edit-${student.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(student)}
                              data-testid={`button-delete-${student.id}`}
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

        <AlertDialog open={!!deletingStudent} onOpenChange={() => setDeletingStudent(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the student profile for "{deletingStudent?.name}". This action cannot be undone.
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
