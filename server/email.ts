import { getUncachableResendClient } from './resend';
import type { Event, InsertEventRegistration } from '@shared/schema';

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

Current Registrations: ${event.registeredCount + 1}/${event.capacity}

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
