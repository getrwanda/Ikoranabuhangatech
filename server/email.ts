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

  console.log("Email would be sent to: info@ikoranabuhanga.tech");
  console.log("Subject:", subject);
  console.log("Body:", emailBody);
  console.log("Reply-to:", email);
  
  await new Promise(resolve => setTimeout(resolve, 500));
}
