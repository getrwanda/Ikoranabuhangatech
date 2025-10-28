import { getUncachableResendClient } from './resend';

interface EmailData {
  name: string;
  email: string;
  message: string;
  type: string;
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
