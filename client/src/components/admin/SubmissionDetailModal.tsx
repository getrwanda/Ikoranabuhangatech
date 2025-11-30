import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Copy, Mail, Calendar, MapPin, Building, User, Briefcase, Clock, Heart, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { PartnerApplication, MentorApplicationType, VolunteerApplicationType, Contact } from "@shared/schema";

type SubmissionType = "partner" | "mentor" | "volunteer" | "contact";

interface SubmissionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: SubmissionType;
  data: PartnerApplication | MentorApplicationType | VolunteerApplicationType | Contact | null;
}

export function SubmissionDetailModal({ isOpen, onClose, type, data }: SubmissionDetailModalProps) {
  const { toast } = useToast();

  if (!data) return null;

  const handleCopyEmail = () => {
    if (data.email) {
      navigator.clipboard.writeText(data.email);
      toast({
        title: "Email copied",
        description: "Email address copied to clipboard",
      });
    }
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "N/A";
    return format(new Date(date), "PPP p");
  };

  const renderField = (icon: React.ReactNode, label: string, value: React.ReactNode) => (
    <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="mt-1 text-muted-foreground">{icon}</div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none text-muted-foreground">{label}</p>
        <div className="text-sm font-medium">{value || "N/A"}</div>
      </div>
    </div>
  );

  const renderArrayField = (icon: React.ReactNode, label: string, values: string[] | null) => (
    <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="mt-1 text-muted-foreground">{icon}</div>
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium leading-none text-muted-foreground">{label}</p>
        <div className="flex flex-wrap gap-2">
          {values && values.length > 0 ? (
            values.map((v, i) => (
              <Badge key={i} variant="secondary" className="font-normal">
                {v}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">None selected</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case "partner":
        const partner = data as PartnerApplication;
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField(<Building className="h-4 w-4" />, "Organization", partner.organizationName)}
              {renderField(<Briefcase className="h-4 w-4" />, "Type", partner.organizationType)}
              {renderField(<MapPin className="h-4 w-4" />, "Location", partner.location)}
              {renderField(<Calendar className="h-4 w-4" />, "Timeline", partner.partnershipTimeline)}
            </div>
            
            <div className="space-y-4 mt-4">
              {renderArrayField(<Heart className="h-4 w-4" />, "Resource Contributions", partner.resourceContribution)}
              
              {renderField(<User className="h-4 w-4" />, "Partnership Goals", 
                <p className="whitespace-pre-wrap text-muted-foreground">{partner.partnershipGoals}</p>
              )}
              
              {partner.pastCollaboration && renderField(<Clock className="h-4 w-4" />, "Past Collaboration", partner.pastCollaboration)}
            </div>
          </>
        );

      case "mentor":
        const mentor = data as MentorApplicationType;
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField(<Briefcase className="h-4 w-4" />, "Title", mentor.professionalTitle)}
              {renderField(<Clock className="h-4 w-4" />, "Experience", mentor.yearsOfExperience)}
              {renderField(<User className="h-4 w-4" />, "Age Preference", mentor.ageGroupPreference)}
              {renderField(<Calendar className="h-4 w-4" />, "Preferred Format", mentor.preferredFormat)}
            </div>

            <div className="space-y-4 mt-4">
              {renderArrayField(<GraduationCap className="h-4 w-4" />, "Expertise Areas", mentor.expertiseAreas)}
              {renderArrayField(<Clock className="h-4 w-4" />, "Availability", mentor.availability)}
              {renderArrayField(<User className="h-4 w-4" />, "Languages", mentor.languages)}
              
              {renderField(<User className="h-4 w-4" />, "Mentoring Goals", 
                <p className="whitespace-pre-wrap text-muted-foreground">{mentor.mentoringGoals}</p>
              )}
            </div>
          </>
        );

      case "volunteer":
        const volunteer = data as VolunteerApplicationType;
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField(<Clock className="h-4 w-4" />, "Frequency", volunteer.availabilityFrequency)}
              {renderField(<Clock className="h-4 w-4" />, "Time Commitment", volunteer.timeCommitment)}
              {renderField(<MapPin className="h-4 w-4" />, "Location Flexibility", volunteer.locationFlexibility)}
            </div>

            <div className="space-y-4 mt-4">
              {renderArrayField(<Briefcase className="h-4 w-4" />, "Skills", volunteer.skills)}
              {renderArrayField(<Heart className="h-4 w-4" />, "Interest Areas", volunteer.interestAreas)}
              
              {volunteer.previousExperience && renderField(<User className="h-4 w-4" />, "Previous Experience", volunteer.previousExperience)}
              {volunteer.emergencyContact && renderField(<User className="h-4 w-4" />, "Emergency Contact", volunteer.emergencyContact)}
            </div>
          </>
        );

      case "contact":
        const contact = data as Contact;
        return (
          <div className="grid grid-cols-1 gap-4">
            {renderField(<Briefcase className="h-4 w-4" />, "Inquiry Type", contact.type)}
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between mr-8">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl">{data.name}</DialogTitle>
              <Badge variant="outline" className="capitalize">
                {type}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              {formatDate(data.createdAt)}
            </span>
          </div>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Mail className="h-4 w-4" />
            {data.email}
            {'phone' in data && (
              <>
                <span className="mx-2">•</span>
                <span className="flex items-center gap-2">
                  {/* Phone icon could go here */}
                  {data.phone}
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6 pt-2">
          <div className="space-y-6">
            {/* Main Content based on type */}
            {renderContent()}

            {/* Common Message Field */}
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Message</h4>
              <div className="bg-muted/30 p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                {data.message}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 border-t bg-muted/10">
          <Button variant="outline" onClick={handleCopyEmail}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Email
          </Button>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
