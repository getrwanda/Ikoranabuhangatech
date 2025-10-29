import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImigongoPattern } from "@/components/ImigongoPattern";
import { Calendar, User, ArrowLeft, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import type { BlogPost } from "@shared/schema";

function BlogPostSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <Skeleton className="h-8 w-32 mb-8" />
      <Skeleton className="h-12 w-full mb-4" />
      <Skeleton className="h-6 w-3/4 mb-8" />
      <div className="flex gap-4 mb-8">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="w-full h-96 mb-8" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data: postData, isLoading, error } = useQuery<{ success: boolean; data: BlogPost }>({
    queryKey: ["/api/blog", slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch blog post");
      }
      return response.json();
    },
    enabled: !!slug,
  });

  const post = postData?.data;

  const categoryLabels: Record<string, { label: string; color: string }> = {
    "success-stories": { label: "Success Stories", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
    "digital-literacy-tips": { label: "Digital Literacy Tips", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" },
    "community-news": { label: "Community News", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100" },
    "events-recap": { label: "Events Recap", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative min-h-[30vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-accent">
        <ImigongoPattern opacity={0.15} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link href="/blog">
              <Button variant="ghost" className="text-white hover:text-white/90 mb-8" data-testid="button-back-to-blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="max-w-4xl mx-auto">
              <Alert variant="destructive" className="mb-8">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load blog post. The post may not exist or there was an error loading it.
                </AlertDescription>
              </Alert>
              <Link href="/blog">
                <Button data-testid="button-back-after-error">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          )}

          {isLoading && <BlogPostSkeleton />}

          {post && (
            <article className="max-w-4xl mx-auto">
              <div className="mb-8">
                <Badge 
                  className={categoryLabels[post.category]?.color || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"}
                  data-testid="badge-category"
                >
                  {categoryLabels[post.category]?.label || post.category}
                </Badge>
              </div>

              <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-primary mb-6" data-testid="heading-title">
                {post.title}
              </h1>

              <div className="flex flex-wrap gap-6 mb-12 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span data-testid="text-author">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span data-testid="text-date">
                    {post.publishedAt 
                      ? format(new Date(post.publishedAt), "MMMM dd, yyyy")
                      : format(new Date(post.createdAt), "MMMM dd, yyyy")}
                  </span>
                </div>
              </div>

              {post.featuredImage && (
                <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-12">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                    data-testid="img-featured"
                  />
                </div>
              )}

              <div className="prose prose-lg dark:prose-invert max-w-none mb-12" data-testid="content-article">
                <p className="text-xl text-muted-foreground mb-8 font-medium">
                  {post.excerpt}
                </p>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </div>
              </div>

              <div className="border-t pt-8">
                <Link href="/blog">
                  <Button data-testid="button-back-bottom">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                  </Button>
                </Link>
              </div>
            </article>
          )}
        </div>
      </section>
    </div>
  );
}
