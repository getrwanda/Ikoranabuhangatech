import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { ImigongoPattern } from "@/components/ImigongoPattern";
import { Calendar, MapPin, Users, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Event } from "@shared/schema";

const registrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  organization: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface EventRegistrationDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EventRegistrationDialog({ event, open, onOpenChange }: EventRegistrationDialogProps) {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      const response = await fetch(`/api/events/${event.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      return response.json();
    },
    onSuccess: () => {
      setSubmitSuccess(true);
      setSubmitError("");
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events/upcoming"] });
      reset();
      
      setTimeout(() => {
        setSubmitSuccess(false);
        onOpenChange(false);
      }, 3000);
    },
    onError: (error: Error) => {
      setSubmitError(error.message);
      setSubmitSuccess(false);
    },
  });

  const onSubmit = (data: RegistrationFormData) => {
    registerMutation.mutate(data);
  };

  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const eventTime = new Date(event.date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const spotsAvailable = event.capacity - event.registeredCount;
  const isFull = spotsAvailable <= 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-primary">
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-5 w-5" />
              <span>{eventDate}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span>{eventTime}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-5 w-5" />
              <span>
                {spotsAvailable > 0 
                  ? `${spotsAvailable} spot${spotsAvailable !== 1 ? 's' : ''} available`
                  : 'Event is full'}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">About this event</h3>
            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          {submitSuccess ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Registration successful! Check your email for confirmation details.
              </AlertDescription>
            </Alert>
          ) : isFull ? (
            <Alert className="bg-orange-50 border-orange-200">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                This event is currently full. Please check back later for availability.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h3 className="font-semibold text-lg">Register for this event</h3>
              
              {submitError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Your full name"
                  disabled={isSubmitting}
                  data-testid="input-registration-name"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="your.email@example.com"
                  disabled={isSubmitting}
                  data-testid="input-registration-email"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="+250 XXX XXX XXX"
                  disabled={isSubmitting}
                  data-testid="input-registration-phone"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">School/Organization (Optional)</Label>
                <Input
                  id="organization"
                  {...register("organization")}
                  placeholder="Your school or organization"
                  disabled={isSubmitting}
                  data-testid="input-registration-organization"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                data-testid="submit-registration"
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Register Now"
                )}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EventCard({ event }: { event: Event }) {
  const [showRegistration, setShowRegistration] = useState(false);

  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const categoryLabels: Record<string, { label: string; color: string }> = {
    "digital-literacy": { label: "Digital Literacy", color: "bg-blue-100 text-blue-800" },
    "mentorship": { label: "Mentorship", color: "bg-purple-100 text-purple-800" },
    "community-engagement": { label: "Community", color: "bg-green-100 text-green-800" },
  };

  const category = categoryLabels[event.category] || { label: event.category, color: "bg-gray-100 text-gray-800" };
  const spotsAvailable = event.capacity - event.registeredCount;
  const isFull = spotsAvailable <= 0;

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge className={category.color}>{category.label}</Badge>
            {isFull && <Badge variant="destructive">Full</Badge>}
          </div>
          <CardTitle className="text-xl font-heading text-primary">
            {event.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {event.description}
          </p>

          <div className="space-y-2 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{eventDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {spotsAvailable > 0 
                  ? `${spotsAvailable} spot${spotsAvailable !== 1 ? 's' : ''} left`
                  : 'Event full'}
              </span>
            </div>
          </div>

          <Button
            onClick={() => setShowRegistration(true)}
            className="w-full mt-auto"
            variant={isFull ? "outline" : "default"}
            data-testid={`register-${event.id}`}
          >
            {isFull ? "View Details" : "Register Now"}
          </Button>
        </CardContent>
      </Card>

      <EventRegistrationDialog
        event={event}
        open={showRegistration}
        onOpenChange={setShowRegistration}
      />
    </>
  );
}

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: eventsData, isLoading, error } = useQuery<{ success: boolean; data: Event[] }>({
    queryKey: ["/api/events/upcoming"],
    queryFn: async () => {
      const response = await fetch("/api/events/upcoming");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      return response.json();
    },
  });

  const events = eventsData?.data || [];

  const filteredEvents = selectedCategory === "all"
    ? events
    : events.filter(event => event.category === selectedCategory);

  const categories = [
    { id: "all", label: "All Events" },
    { id: "digital-literacy", label: "Digital Literacy" },
    { id: "mentorship", label: "Mentorship" },
    { id: "community-engagement", label: "Community Engagement" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-accent">
        <ImigongoPattern opacity={0.15} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-white mb-6">
              Upcoming Events
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
              Join us for workshops, mentorship sessions, and community events designed to empower youth through technology
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="rounded-full"
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                  <Spinner className="mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading events...</p>
                </div>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="max-w-2xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load events. Please try again later.
                </AlertDescription>
              </Alert>
            ) : filteredEvents.length === 0 ? (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="py-16 text-center">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading text-xl mb-2">No events found</h3>
                  <p className="text-muted-foreground">
                    {selectedCategory === "all"
                      ? "There are no upcoming events at the moment. Check back soon!"
                      : "No events in this category. Try selecting a different category."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
