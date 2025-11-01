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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBlogPostSchema, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";

const blogFormSchema = insertBlogPostSchema.extend({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  author: z.string().min(1, "Author is required"),
});

export default function BlogManagement() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);

  const { data: posts, isLoading } = useQuery<{ success: boolean; data: BlogPost[] }>({
    queryKey: ["/api/admin/blog"],
  });

  const form = useForm<InsertBlogPost>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      author: "",
      featuredImage: "",
      status: "draft",
      publishedAt: null,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      const payload = {
        ...data,
        publishedAt: data.status === "published" ? new Date() : null,
      };
      return apiRequest("POST", "/api/admin/blog", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertBlogPost> }) => {
      const payload = {
        ...data,
        publishedAt: data.status === "published" ? new Date() : null,
      };
      return apiRequest("PATCH", `/api/admin/blog/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      setEditingPost(null);
      form.reset();
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      setDeletingPost(null);
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertBlogPost) => {
    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    form.reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author: post.author,
      featuredImage: post.featuredImage || "",
      status: post.status,
      publishedAt: post.publishedAt,
    });
  };

  const handleDelete = (post: BlogPost) => {
    setDeletingPost(post);
  };

  const confirmDelete = () => {
    if (deletingPost) {
      deleteMutation.mutate(deletingPost.id);
    }
  };

  const closeDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingPost(null);
    form.reset();
  };

  const categories = [
    { value: "success-stories", label: "Success Stories" },
    { value: "digital-literacy-tips", label: "Digital Literacy Tips" },
    { value: "community-news", label: "Community News" },
    { value: "events-recap", label: "Events Recap" },
  ];

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-heading font-bold text-primary">Blog Management</h1>
              <p className="text-muted-foreground">Manage blog posts and content</p>
            </div>
            <Dialog open={isCreateDialogOpen || !!editingPost} onOpenChange={(open) => !open && closeDialog()}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-post">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPost ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter post title" data-testid="input-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="post-url-slug" data-testid="input-slug" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Brief description" rows={2} data-testid="input-excerpt" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Full post content" rows={8} data-testid="input-content" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Author name" data-testid="input-author" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="featuredImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Featured Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} placeholder="https://example.com/image.jpg" data-testid="input-featured-image" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Published</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              {field.value === "published" ? "Post is live" : "Post is draft"}
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value === "published"}
                              onCheckedChange={(checked) => field.onChange(checked ? "published" : "draft")}
                              data-testid="switch-status"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={closeDialog} data-testid="button-cancel">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-submit">
                        {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingPost ? "Update" : "Create"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : posts?.data?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No blog posts yet</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts?.data?.map((post) => (
                      <TableRow key={post.id} data-testid={`row-post-${post.id}`}>
                        <TableCell className="font-medium" data-testid={`text-title-${post.id}`}>{post.title}</TableCell>
                        <TableCell>
                          <Badge variant={post.status === "published" ? "default" : "secondary"} data-testid={`badge-status-${post.id}`}>
                            {post.status}
                          </Badge>
                        </TableCell>
                        <TableCell data-testid={`text-category-${post.id}`}>
                          {categories.find(c => c.value === post.category)?.label || post.category}
                        </TableCell>
                        <TableCell data-testid={`text-author-${post.id}`}>{post.author}</TableCell>
                        <TableCell data-testid={`text-date-${post.id}`}>
                          {post.publishedAt ? format(new Date(post.publishedAt), "MMM d, yyyy") : format(new Date(post.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(post)}
                              data-testid={`button-edit-${post.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(post)}
                              data-testid={`button-delete-${post.id}`}
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

        <AlertDialog open={!!deletingPost} onOpenChange={() => setDeletingPost(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the blog post "{deletingPost?.title}". This action cannot be undone.
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
