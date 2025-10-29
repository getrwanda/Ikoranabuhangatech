import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImigongoPattern } from "@/components/ImigongoPattern";
import { Calendar, User, ArrowRight, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import type { BlogPost } from "@shared/schema";

function BlogPostCard({ post }: { post: BlogPost }) {
  const categoryLabels: Record<string, { label: string; color: string }> = {
    "success-stories": { label: "Success Stories", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
    "digital-literacy-tips": { label: "Digital Literacy Tips", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" },
    "community-news": { label: "Community News", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100" },
    "events-recap": { label: "Events Recap", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" },
  };

  const category = categoryLabels[post.category] || { label: post.category, color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" };
  
  const publishedDate = post.publishedAt 
    ? format(new Date(post.publishedAt), "MMM dd, yyyy")
    : format(new Date(post.createdAt), "MMM dd, yyyy");

  return (
    <Card 
      className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col group"
      data-testid={`blog-card-${post.slug}`}
    >
      {post.featuredImage && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <img 
            src={post.featuredImage} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-testid={`img-${post.slug}`}
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge className={category.color} data-testid={`badge-category-${post.slug}`}>
            {category.label}
          </Badge>
        </div>
        <CardTitle className="text-xl font-heading text-primary line-clamp-2" data-testid={`title-${post.slug}`}>
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-muted-foreground mb-4 line-clamp-3" data-testid={`excerpt-${post.slug}`}>
          {post.excerpt}
        </p>

        <div className="space-y-2 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span data-testid={`author-${post.slug}`}>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span data-testid={`date-${post.slug}`}>{publishedDate}</span>
          </div>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <Button 
            className="w-full mt-auto group/btn"
            data-testid={`link-read-more-${post.slug}`}
          >
            Read More
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function BlogPostSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <Skeleton className="w-full h-48 rounded-t-lg" />
      <CardHeader>
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-10 w-full mt-auto" />
      </CardContent>
    </Card>
  );
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: postsData, isLoading, error } = useQuery<{ success: boolean; data: BlogPost[] }>({
    queryKey: ["/api/blog/published"],
  });

  const posts = postsData?.data || [];

  const filteredPosts = selectedCategory === "all"
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  const categories = [
    { id: "all", label: "All" },
    { id: "success-stories", label: "Success Stories" },
    { id: "digital-literacy-tips", label: "Digital Literacy Tips" },
    { id: "community-news", label: "Community News" },
    { id: "events-recap", label: "Events Recap" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-accent">
        <ImigongoPattern opacity={0.15} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-white mb-6" data-testid="heading-blog">
              Latest News & Stories
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed" data-testid="text-subtitle">
              Discover success stories, digital literacy tips, and updates from our community
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-12 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  data-testid={`filter-${category.id}`}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {error && (
              <Alert variant="destructive" className="mb-8">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load blog posts. Please try again later.
                </AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <BlogPostSkeleton key={i} />
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="blog-grid">
                {filteredPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg" data-testid="text-no-posts">
                  {selectedCategory === "all" 
                    ? "No blog posts available yet. Check back soon!"
                    : `No posts found in this category.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
