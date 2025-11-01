import { getUncachableResendClient } from './resend';
import type { 
  Event, 
  InsertEventRegistration,
  InsertPartnerApplication,
  InsertMentorApplication,
  InsertVolunteerApplication
} from '@shared/schema';

interface EmailData {
  name: string;
  email: string;
  message: string;
  type: string;
}

interface EventRegistrationEmailData {
  registration: InsertEventRegistration;
  event: Event;
}

export async function sendContactEmail(data: EmailData): Promise<void> {
  const { name, email, message, type } = data;

  const typeLabels: Record<string, string> = {
    contact: "General Contact",
    partner: "Partnership Inquiry",
    mentor: "Mentor Application",
    volunteer: "Volunteer Interest",
  };

  const subject = `${typeLabels[type] || "Website Contact"} - ${name}`;
  
  const emailBody = `
New submission from Ikoranabuhanga Rigezweho website

Type: ${typeLabels[type] || type}
Name: ${name}
Email: ${email}

Message:
${message}

---
Sent from www.ikoranabuhanga.tech
  `.trim();

  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    await client.emails.send({
      from: fromEmail,
      to: 'info@ikoranabuhanga.tech',
      replyTo: email,
      subject: subject,
      text: emailBody,
    });
    
    console.log(`Email sent successfully to info@ikoranabuhanga.tech - ${typeLabels[type]} from ${name}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

export async function sendEventRegistrationEmail(data: EventRegistrationEmailData): Promise<void> {
  const { registration, event } = data;
  const { name, email } = registration;

  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const confirmationSubject = `Event Registration Confirmation - ${event.title}`;
  
  const confirmationBody = `
Dear ${name},

Thank you for registering for our event!

Event Details:
--------------
Title: ${event.title}
Date: ${eventDate}
Location: ${event.location}
Category: ${event.category}

${event.description}

Your registration has been confirmed. We look forward to seeing you at the event!

If you have any questions, please contact us at info@ikoranabuhanga.tech or call +250 788 331 033.

Best regards,
Ikoranabuhanga Rigezweho Team

---
Building Rwanda's Future through Digital Literacy and Mentorship
www.ikoranabuhanga.tech
  `.trim();

  const notificationSubject = `New Event Registration - ${event.title}`;
  
  const notificationBody = `
New event registration received

Event: ${event.title}
Date: ${eventDate}
Location: ${event.location}

Registrant Details:
------------------
Name: ${name}
Email: ${email}
Phone: ${registration.phone || 'Not provided'}
Organization: ${registration.organization || 'Not provided'}

Current Registrations: ${event.registeredCount}/${event.capacity}

---
Sent from www.ikoranabuhanga.tech
  `.trim();

  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    await Promise.all([
      client.emails.send({
        from: fromEmail,
        to: email,
        subject: confirmationSubject,
        text: confirmationBody,
      }),
      client.emails.send({
        from: fromEmail,
        to: 'info@ikoranabuhanga.tech',
        replyTo: email,
        subject: notificationSubject,
        text: notificationBody,
      })
    ]);
    
    console.log(`Event registration emails sent successfully for ${event.title} - ${name}`);
  } catch (error) {
    console.error("Failed to send event registration email:", error);
    throw error;
  }
}

export async function sendPartnerApplicationEmail(data: InsertPartnerApplication): Promise<void> {
  const { 
    name, 
    email, 
    phone, 
    organizationName, 
    organizationType, 
    location,
    partnershipGoals,
    resourceContribution,
    partnershipTimeline,
    pastCollaboration,
    message 
  } = data;

  const subject = `New Partnership Application - ${organizationName}`;
  
  const emailBody = `
New Partnership Application Received
=====================================

CONTACT INFORMATION
-------------------
Name: ${name}
Email: ${email}
Phone: ${phone}

ORGANIZATION DETAILS
--------------------
Organization: ${organizationName}
Type: ${organizationType}
Location: ${location}

PARTNERSHIP DETAILS
-------------------
Partnership Goals:
${partnershipGoals}

Resource Contributions:
${resourceContribution.join(', ')}

Timeline: ${partnershipTimeline}

${pastCollaboration ? `Past Collaboration Experience:\n${pastCollaboration}\n` : ''}
Additional Message:
${message}

---
Sent from www.ikoranabuhanga.tech
  `.trim();

  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    await client.emails.send({
      from: fromEmail,
      to: 'info@ikoranabuhanga.tech',
      replyTo: email,
      subject: subject,
      text: emailBody,
    });
    
    console.log(`Partner application email sent successfully - ${organizationName}`);
  } catch (error) {
    console.error("Failed to send partner application email:", error);
    throw error;
  }
}

export async function sendMentorApplicationEmail(data: InsertMentorApplication): Promise<void> {
  const { 
    name, 
    email, 
    phone, 
    professionalTitle,
    expertiseAreas,
    yearsOfExperience,
    availability,
    preferredFormat,
    ageGroupPreference,
    languages,
    mentoringGoals,
    message 
  } = data;

  const subject = `New Mentor Application - ${name}`;
  
  const emailBody = `
New Mentor Application Received
================================

CONTACT INFORMATION
-------------------
Name: ${name}
Email: ${email}
Phone: ${phone}

PROFESSIONAL BACKGROUND
-----------------------
Title: ${professionalTitle}
Years of Experience: ${yearsOfExperience}

Expertise Areas:
${expertiseAreas.join(', ')}

MENTORING PREFERENCES
---------------------
Availability:
${availability.join(', ')}

Preferred Format: ${preferredFormat}
Age Group Preference: ${ageGroupPreference}

Languages:
${languages.join(', ')}

Mentoring Goals:
${mentoringGoals}

Additional Message:
${message}

---
Sent from www.ikoranabuhanga.tech
  `.trim();

  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    await client.emails.send({
      from: fromEmail,
      to: 'info@ikoranabuhanga.tech',
      replyTo: email,
      subject: subject,
      text: emailBody,
    });
    
    console.log(`Mentor application email sent successfully - ${name}`);
  } catch (error) {
    console.error("Failed to send mentor application email:", error);
    throw error;
  }
}

export async function sendVolunteerApplicationEmail(data: InsertVolunteerApplication): Promise<void> {
  const { 
    name, 
    email, 
    phone, 
    skills,
    availabilityFrequency,
    timeCommitment,
    locationFlexibility,
    interestAreas,
    previousExperience,
    emergencyContact,
    message 
  } = data;

  const subject = `New Volunteer Application - ${name}`;
  
  const emailBody = `
New Volunteer Application Received
===================================

CONTACT INFORMATION
-------------------
Name: ${name}
Email: ${email}
Phone: ${phone}
${emergencyContact ? `Emergency Contact: ${emergencyContact}\n` : ''}

SKILLS & INTERESTS
------------------
Skills:
${skills.join(', ')}

Areas of Interest:
${interestAreas.join(', ')}

AVAILABILITY
------------
Frequency: ${availabilityFrequency}
Time Commitment: ${timeCommitment}
Location Flexibility: ${locationFlexibility}

${previousExperience ? `PREVIOUS EXPERIENCE\n-------------------\n${previousExperience}\n` : ''}
Additional Message:
${message}

---
Sent from www.ikoranabuhanga.tech
  `.trim();

  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    await client.emails.send({
      from: fromEmail,
      to: 'info@ikoranabuhanga.tech',
      replyTo: email,
      subject: subject,
      text: emailBody,
    });
    
    console.log(`Volunteer application email sent successfully - ${name}`);
  } catch (error) {
    console.error("Failed to send volunteer application email:", error);
    throw error;
  }
}
