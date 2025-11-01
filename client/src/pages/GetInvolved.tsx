import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ImigongoPattern, ImigongoAccent } from "@/components/ImigongoPattern";
import { Handshake, Users, Heart, Mail, Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { insertPartnerApplicationSchema, insertMentorApplicationSchema, insertVolunteerApplicationSchema } from "@shared/schema";

type FormType = 'partner' | 'mentor' | 'volunteer';

// Partner Form
type PartnerFormData = z.infer<typeof insertPartnerApplicationSchema>;

function PartnerApplicationForm() {
  const { toast } = useToast();

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(insertPartnerApplicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      organizationName: "",
      organizationType: "",
      location: "",
      partnershipGoals: "",
      resourceContribution: [],
      partnershipTimeline: "",
      pastCollaboration: "",
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: PartnerFormData) => {
      return await apiRequest("POST", "/api/partner-inquiry", data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Thank you for your partnership inquiry. We'll get back to you soon.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send submission. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resourceOptions = [
    { id: "funding", label: "Financial Support" },
    { id: "facilities", label: "Training Facilities/Venues" },
    { id: "equipment", label: "Equipment/Technology" },
    { id: "expertise", label: "Technical Expertise" },
    { id: "volunteers", label: "Volunteer Support" },
    { id: "materials", label: "Training Materials" },
  ];

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-primary">
            <Handshake className="h-12 w-12" />
          </div>
          <div>
            <CardTitle className="font-heading text-2xl">Partner With Us</CardTitle>
            <CardDescription>Let's collaborate to empower Rwandan youth</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => submitMutation.mutate(data))} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-lg">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} data-testid="input-partner-name" />
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
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+250 788 123 456" {...field} data-testid="input-partner-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@organization.org" {...field} data-testid="input-partner-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-lg">Organization Details</h3>
              
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC Foundation" {...field} data-testid="input-org-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="organizationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-org-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="school">School</SelectItem>
                          <SelectItem value="ngo">NGO/Non-Profit</SelectItem>
                          <SelectItem value="government">Government Agency</SelectItem>
                          <SelectItem value="business">Private Business</SelectItem>
                          <SelectItem value="foundation">Foundation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location/Region *</FormLabel>
                      <FormControl>
                        <Input placeholder="Kigali, Rwanda" {...field} data-testid="input-partner-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-lg">Partnership Details</h3>
              
              <FormField
                control={form.control}
                name="partnershipGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partnership Goals *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What would you like to achieve through this partnership?"
                        className="min-h-24"
                        {...field}
                        data-testid="input-partnership-goals"
                      />
                    </FormControl>
                    <FormDescription>
                      Describe your objectives and how you envision collaborating with us
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resourceContribution"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Resources You Can Contribute *</FormLabel>
                      <FormDescription>
                        Select all that apply
                      </FormDescription>
                    </div>
                    <div className="space-y-2">
                      {resourceOptions.map((resource) => (
                        <FormField
                          key={resource.id}
                          control={form.control}
                          name="resourceContribution"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={resource.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(resource.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, resource.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== resource.id
                                            )
                                          );
                                    }}
                                    data-testid={`checkbox-resource-${resource.id}`}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {resource.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="partnershipTimeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Timeline *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-timeline">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate (1-2 months)</SelectItem>
                        <SelectItem value="short-term">Short-term (3-6 months)</SelectItem>
                        <SelectItem value="medium-term">Medium-term (6-12 months)</SelectItem>
                        <SelectItem value="long-term">Long-term (1+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pastCollaboration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Past Collaboration Experience (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Have you partnered with similar organizations before? Please share your experience."
                        className="min-h-20"
                        {...field}
                        value={field.value || ""}
                        data-testid="input-past-collaboration"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any other details you'd like to share..."
                        className="min-h-24"
                        {...field}
                        data-testid="input-partner-message"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2"
              disabled={submitMutation.isPending}
              data-testid="button-submit-partner"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5" />
                  Submit Partnership Inquiry
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Mentor Form (Multi-step)
type MentorFormData = z.infer<typeof insertMentorApplicationSchema>;

function MentorApplicationForm() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const form = useForm<MentorFormData>({
    resolver: zodResolver(insertMentorApplicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      professionalTitle: "",
      expertiseAreas: [],
      yearsOfExperience: "",
      availability: [],
      preferredFormat: "",
      ageGroupPreference: "",
      languages: [],
      mentoringGoals: "",
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: MentorFormData) => {
      return await apiRequest("POST", "/api/mentor-application", data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Thank you for your mentor application. We'll contact you shortly.",
      });
      form.reset();
      setStep(1);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send submission. Please try again.",
        variant: "destructive",
      });
    },
  });

  const expertiseOptions = [
    { id: "web-dev", label: "Web Development" },
    { id: "mobile-dev", label: "Mobile Development" },
    { id: "data-science", label: "Data Science" },
    { id: "cybersecurity", label: "Cybersecurity" },
    { id: "networking", label: "Networking" },
    { id: "ui-ux", label: "UI/UX Design" },
    { id: "entrepreneurship", label: "Tech Entrepreneurship" },
    { id: "digital-marketing", label: "Digital Marketing" },
  ];

  const availabilityOptions = [
    { id: "weekday-mornings", label: "Weekday Mornings" },
    { id: "weekday-afternoons", label: "Weekday Afternoons" },
    { id: "weekday-evenings", label: "Weekday Evenings" },
    { id: "weekends", label: "Weekends" },
  ];

  const languageOptions = [
    { id: "kinyarwanda", label: "Kinyarwanda" },
    { id: "english", label: "English" },
    { id: "french", label: "French" },
    { id: "swahili", label: "Swahili" },
  ];

  const nextStep = async () => {
    const fields = step === 1 
      ? ["name", "email", "phone", "professionalTitle"] as const
      : [];
    
    const isValid = await form.trigger(fields);
    if (isValid) {
      setStep(step + 1);
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-accent">
            <Users className="h-12 w-12" />
          </div>
          <div>
            <CardTitle className="font-heading text-2xl">Become a Mentor</CardTitle>
            <CardDescription>Guide the next generation of tech leaders</CardDescription>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-accent' : 'bg-secondary'}`} />
          <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-accent' : 'bg-secondary'}`} />
          <span className="text-sm text-muted-foreground ml-2">Step {step} of 2</span>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => submitMutation.mutate(data))} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg">Personal Information</h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} data-testid="input-mentor-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} data-testid="input-mentor-email" />
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
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="+250 788 123 456" {...field} data-testid="input-mentor-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="professionalTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Title/Current Role *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Software Engineer, IT Manager" {...field} data-testid="input-professional-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full gap-2"
                  data-testid="button-mentor-next"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg">Mentoring Details</h3>

                <FormField
                  control={form.control}
                  name="expertiseAreas"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Areas of Expertise *</FormLabel>
                        <FormDescription>Select all that apply</FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {expertiseOptions.map((expertise) => (
                          <FormField
                            key={expertise.id}
                            control={form.control}
                            name="expertiseAreas"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={expertise.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(expertise.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, expertise.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== expertise.id
                                              )
                                            );
                                      }}
                                      data-testid={`checkbox-expertise-${expertise.id}`}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-sm">
                                    {expertise.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearsOfExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-experience">
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0-2">0-2 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availability"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Availability *</FormLabel>
                        <FormDescription>When can you mentor?</FormDescription>
                      </div>
                      <div className="space-y-2">
                        {availabilityOptions.map((avail) => (
                          <FormField
                            key={avail.id}
                            control={form.control}
                            name="availability"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={avail.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(avail.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, avail.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== avail.id
                                              )
                                            );
                                      }}
                                      data-testid={`checkbox-availability-${avail.id}`}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {avail.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Mentoring Format *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-format">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="in-person">In-Person</SelectItem>
                          <SelectItem value="virtual">Virtual/Online</SelectItem>
                          <SelectItem value="hybrid">Hybrid (Both)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ageGroupPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Age Group *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-age-group">
                            <SelectValue placeholder="Select age group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="secondary">Secondary School (13-18)</SelectItem>
                          <SelectItem value="university">University (18-25)</SelectItem>
                          <SelectItem value="young-professional">Young Professionals (25+)</SelectItem>
                          <SelectItem value="any">Any Age Group</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="languages"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Languages *</FormLabel>
                        <FormDescription>What languages can you mentor in?</FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {languageOptions.map((lang) => (
                          <FormField
                            key={lang.id}
                            control={form.control}
                            name="languages"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={lang.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(lang.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, lang.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== lang.id
                                              )
                                            );
                                      }}
                                      data-testid={`checkbox-language-${lang.id}`}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {lang.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mentoringGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mentoring Goals *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What do you hope to achieve as a mentor?"
                          className="min-h-24"
                          {...field}
                          data-testid="input-mentoring-goals"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us more about yourself and why you want to be a mentor..."
                          className="min-h-24"
                          {...field}
                          data-testid="input-mentor-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 gap-2"
                    data-testid="button-mentor-back"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gap-2"
                    disabled={submitMutation.isPending}
                    data-testid="button-submit-mentor"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Volunteer Form (Multi-step)
type VolunteerFormData = z.infer<typeof insertVolunteerApplicationSchema>;

function VolunteerApplicationForm() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const form = useForm<VolunteerFormData>({
    resolver: zodResolver(insertVolunteerApplicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      skills: [],
      availabilityFrequency: "",
      timeCommitment: "",
      locationFlexibility: "",
      interestAreas: [],
      previousExperience: "",
      emergencyContact: "",
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: VolunteerFormData) => {
      return await apiRequest("POST", "/api/volunteer-application", data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Thank you for your volunteer interest. We'll be in touch soon.",
      });
      form.reset();
      setStep(1);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send submission. Please try again.",
        variant: "destructive",
      });
    },
  });

  const skillsOptions = [
    { id: "teaching", label: "Teaching/Training" },
    { id: "facilitation", label: "Event Facilitation" },
    { id: "logistics", label: "Logistics/Organization" },
    { id: "fundraising", label: "Fundraising" },
    { id: "social-media", label: "Social Media Management" },
    { id: "content-creation", label: "Content Creation" },
    { id: "photography", label: "Photography/Videography" },
    { id: "translation", label: "Translation" },
  ];

  const interestAreasOptions = [
    { id: "digital-literacy", label: "Digital Literacy Training" },
    { id: "mentorship", label: "Student Mentorship" },
    { id: "events", label: "Event Support" },
    { id: "community", label: "Community Outreach" },
    { id: "admin", label: "Administrative Support" },
    { id: "fundraising-events", label: "Fundraising Events" },
  ];

  const nextStep = async () => {
    const fields = step === 1 
      ? ["name", "email", "phone"] as const
      : [];
    
    const isValid = await form.trigger(fields);
    if (isValid) {
      setStep(step + 1);
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-primary">
            <Heart className="h-12 w-12" />
          </div>
          <div>
            <CardTitle className="font-heading text-2xl">Volunteer With Us</CardTitle>
            <CardDescription>Make a difference in youth empowerment</CardDescription>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-secondary'}`} />
          <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-secondary'}`} />
          <span className="text-sm text-muted-foreground ml-2">Step {step} of 2</span>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => submitMutation.mutate(data))} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg">Personal Information</h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} data-testid="input-volunteer-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} data-testid="input-volunteer-email" />
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
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="+250 788 123 456" {...field} data-testid="input-volunteer-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Name and phone number" {...field} value={field.value || ""} data-testid="input-emergency-contact" />
                      </FormControl>
                      <FormDescription>
                        Name and contact information of someone we can reach in case of emergency
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full gap-2"
                  data-testid="button-volunteer-next"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg">Volunteer Details</h3>

                <FormField
                  control={form.control}
                  name="skills"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Your Skills *</FormLabel>
                        <FormDescription>Select all that apply</FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {skillsOptions.map((skill) => (
                          <FormField
                            key={skill.id}
                            control={form.control}
                            name="skills"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={skill.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(skill.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, skill.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== skill.id
                                              )
                                            );
                                      }}
                                      data-testid={`checkbox-skill-${skill.id}`}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-sm">
                                    {skill.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interestAreas"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Areas of Interest *</FormLabel>
                        <FormDescription>What would you like to help with?</FormDescription>
                      </div>
                      <div className="space-y-2">
                        {interestAreasOptions.map((area) => (
                          <FormField
                            key={area.id}
                            control={form.control}
                            name="interestAreas"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={area.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(area.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, area.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== area.id
                                              )
                                            );
                                      }}
                                      data-testid={`checkbox-interest-${area.id}`}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {area.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availabilityFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability Frequency *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-frequency">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="events-only">Events Only</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeCommitment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Commitment *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-time-commitment">
                            <SelectValue placeholder="Select time commitment" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1-2-hours">1-2 hours per session</SelectItem>
                          <SelectItem value="3-4-hours">3-4 hours per session</SelectItem>
                          <SelectItem value="half-day">Half day</SelectItem>
                          <SelectItem value="full-day">Full day</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="locationFlexibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Flexibility *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-location-flexibility">
                            <SelectValue placeholder="Select flexibility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="kigali-only">Kigali Only</SelectItem>
                          <SelectItem value="kigali-nearby">Kigali and Nearby Areas</SelectItem>
                          <SelectItem value="any-location">Any Location in Rwanda</SelectItem>
                          <SelectItem value="remote-only">Remote/Virtual Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="previousExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Volunteer Experience (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share any relevant volunteer experience..."
                          className="min-h-20"
                          {...field}
                          value={field.value || ""}
                          data-testid="input-previous-experience"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why Do You Want to Volunteer? *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your motivation and what you hope to contribute..."
                          className="min-h-24"
                          {...field}
                          data-testid="input-volunteer-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 gap-2"
                    data-testid="button-volunteer-back"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gap-2"
                    disabled={submitMutation.isPending}
                    data-testid="button-submit-volunteer"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Main Get Involved Page
export default function GetInvolved() {
  const [activeForm, setActiveForm] = useState<FormType>('partner');

  const opportunities = [
    {
      id: 'partner' as FormType,
      icon: Handshake,
      title: "Partner With Us",
      description: "Collaborate with schools, NGOs, and government agencies to advance digital education.",
      color: "text-primary",
      benefits: [
        "Expand digital literacy in your community",
        "Access to training materials and resources",
        "Joint impact reporting and visibility",
        "Technical support and capacity building",
      ],
    },
    {
      id: 'mentor' as FormType,
      icon: Users,
      title: "Become a Mentor",
      description: "ICT professionals and entrepreneurs can mentor students and guide the next generation of tech leaders.",
      color: "text-accent",
      benefits: [
        "Make a lasting impact on young lives",
        "Share your expertise and experience",
        "Flexible mentoring schedule",
        "Join a community of changemakers",
      ],
    },
    {
      id: 'volunteer' as FormType,
      icon: Heart,
      title: "Volunteer or Donate",
      description: "Join our movement by volunteering your time or supporting our training and mentorship activities.",
      color: "text-primary",
      benefits: [
        "Contribute to youth empowerment",
        "Support program sustainability",
        "Tax-deductible contributions",
        "Regular impact updates",
      ],
    },
  ];

  const activeOpportunity = opportunities.find(o => o.id === activeForm);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-accent">
        <ImigongoPattern opacity={0.15} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-white mb-6">
              Get Involved
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
              Join us in building Rwanda's digital future
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {opportunities.map((opportunity) => {
              const Icon = opportunity.icon;
              const isActive = activeForm === opportunity.id;
              
              return (
                <Card
                  key={opportunity.id}
                  className={`cursor-pointer transition-all duration-300 hover-elevate active-elevate-2 ${
                    isActive ? 'border-2 border-primary shadow-lg' : 'border-2'
                  }`}
                  onClick={() => setActiveForm(opportunity.id)}
                  data-testid={`card-opportunity-${opportunity.id}`}
                >
                  <CardHeader>
                    <div className={`${opportunity.color} mb-3`}>
                      <Icon className="h-10 w-10" />
                    </div>
                    <CardTitle className="font-heading text-xl">{opportunity.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {opportunity.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      variant={isActive ? "default" : "outline"}
                      data-testid={`button-select-${opportunity.id}`}
                    >
                      {isActive ? "Selected" : "Learn More"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {activeOpportunity && (
            <div className="max-w-4xl mx-auto mb-8 bg-secondary rounded-md p-6">
              <h3 className="font-heading font-semibold text-lg mb-4">Benefits</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {activeOpportunity.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-primary text-xl">•</span>
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            {activeForm === 'partner' && <PartnerApplicationForm />}
            {activeForm === 'mentor' && <MentorApplicationForm />}
            {activeForm === 'volunteer' && <VolunteerApplicationForm />}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-6">
              Questions?
            </h2>
            <ImigongoAccent className="w-24 mx-auto mb-6" />
            <p className="text-lg text-muted-foreground mb-8">
              Reach out to us directly at{" "}
              <a href="mailto:info@ikoranabuhanga.tech" className="text-primary hover:underline font-medium" data-testid="link-email-direct">
                info@ikoranabuhanga.tech
              </a>
              {" "}or call us at{" "}
              <a href="tel:+250788331033" className="text-primary hover:underline font-medium" data-testid="link-phone-direct">
                +250 788 331 033
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
