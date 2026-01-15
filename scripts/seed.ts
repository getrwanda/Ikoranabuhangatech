import 'dotenv/config';
import { db } from "../server/db";
import { 
  users, 
  events, 
  blogPosts, 
  partnerApplications, 
  mentorApplications, 
  volunteerApplications, 
  contactSubmissions,
  students,
  type InsertUser,
  type InsertEvent,
  type InsertBlogPost
} from "../shared/schema";
import bcrypt from "bcrypt";
import { addDays, subDays } from "date-fns";

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // 1. Create Admin User
    console.log("Creating admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser: InsertUser = {
      username: "admin",
      password: hashedPassword,
    };
    
    // Check if admin exists first
    const existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, "admin")
    });

    if (!existingUser) {
        await db.insert(users).values(adminUser);
        console.log("✅ Admin user created (username: admin, password: admin123)");
    } else {
        console.log("ℹ️ Admin user already exists");
    }

    // 2. Create Events
    console.log("Creating events...");
    const sampleEvents: InsertEvent[] = [
      {
        title: "Introduction to Digital Literacy",
        description: "A beginner-friendly workshop covering the basics of computer usage, internet safety, and digital tools.",
        category: "digital-literacy",
        date: addDays(new Date(), 7), // 1 week from now
        location: "Kigali Public Library",
        capacity: 30,
        registeredCount: 5,
      },
      {
        title: "Tech Career Mentorship Session",
        description: "Connect with industry professionals and learn about career paths in software development and data science.",
        category: "mentorship",
        date: addDays(new Date(), 14), // 2 weeks from now
        location: "Norrsken House Kigali",
        capacity: 50,
        registeredCount: 12,
      },
      {
        title: "Community Coding Bootcamp",
        description: "An intensive 3-day boot camp for students interested in learning web development with HTML, CSS, and JavaScript.",
        category: "community-engagement",
        date: subDays(new Date(), 10), // 10 days ago (past event)
        location: "Ikoranabuhanga Hub",
        capacity: 20,
        registeredCount: 20,
      }
    ];

    await db.insert(events).values(sampleEvents);
    console.log(`✅ ${sampleEvents.length} events created`);

    // 3. Create Blog Posts
    console.log("Creating blog posts...");
    const samplePosts: InsertBlogPost[] = [
      {
        title: "Empowering Rural Youth Through Technology",
        slug: "empowering-rural-youth-technology",
        excerpt: "How digital access is transforming lives in rural Rwanda.",
        content: "In recent years, the push for digital inclusion has reached the most remote corners of Rwanda. Through initiatives like the Ikoranabuhanga Clubs, students in rural areas are gaining access to computers and the internet for the first time. This connectivity is not just about technology; it's about opening doors to global knowledge, educational resources, and future career opportunities. Our recent visit to Musanze demonstrated the hunger for learning among these young minds...",
        category: "success-stories",
        author: "Joshua Gasore",
        status: "published",
        publishedAt: subDays(new Date(), 5),
        featuredImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80"
      },
      {
        title: "Top 5 Digital Skills Every Student Needs",
        slug: "top-5-digital-skills",
        excerpt: "Essential skills to prepare for the future job market.",
        content: "As the world becomes increasingly digital, the skills required for the workforce are evolving. Here are the top 5 digital skills every student should verify: 1. Basic Coding & Logic: Understanding how software works. 2. Data Literacy: Being able to read and analyze data. 3. Digital Communication: Effective use of email and collaboration tools. 4. Cybersecurity Awareness: Keeping personal information safe online. 5. Content Creation: Using digital tools to express ideas creatively.",
        category: "digital-literacy-tips",
        author: "Sarah M.",
        status: "published",
        publishedAt: subDays(new Date(), 2),
        featuredImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80"
      },
      {
        title: "Upcoming Community Hackathon",
        slug: "upcoming-community-hackathon",
        excerpt: "Join us for a weekend of innovation and problem solving.",
        content: "We are excited to announce our first annual Community Hackathon! This event will bring together students, mentors, and tech enthusiasts to solve real-world problems facing our local communities. Whether you are a coder, a designer, or just have a great idea, we want you there. Prizes include mentorship opportunities and tech gadgets.",
        category: "community-news",
        author: "Admin",
        status: "draft",
        publishedAt: null,
        featuredImage: "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80"
      }
    ];

    await db.insert(blogPosts).values(samplePosts);
    console.log(`✅ ${samplePosts.length} blog posts created`);

    // 4. Create Applications (Partners, Mentors, Volunteers)
    console.log("Creating applications...");
    
    // Partner
    await db.insert(partnerApplications).values({
      name: "Tech Solutions Ltd",
      email: "contact@techsolutions.rw",
      phone: "+250788123456",
      organizationName: "Tech Solutions Rwanda",
      organizationType: "Private Company",
      location: "Kigali",
      partnershipGoals: "To provide internship opportunities for students.",
      resourceContribution: ["Mentorship", "Funding"],
      partnershipTimeline: "Long-term",
      message: "We are interested in supporting the coding bootcamps."
    });

    // Mentor
    await db.insert(mentorApplications).values({
      name: "Jean Paul",
      email: "jean.paul@email.com",
      phone: "+250788654321",
      professionalTitle: "Senior Software Engineer",
      expertiseAreas: ["Web Development", "Cloud Computing"],
      yearsOfExperience: "5+ years",
      availability: ["Weekends"],
      preferredFormat: "In-person",
      ageGroupPreference: "High School",
      languages: ["English", "Kinyarwanda"],
      mentoringGoals: "To give back to the community and help young coders.",
      message: "I have experience teaching Python and JavaScript."
    });

    // Volunteer
    await db.insert(volunteerApplications).values({
      name: "Alice U.",
      email: "alice@email.com",
      phone: "+250788987654",
      skills: ["Event Planning", "Social Media"],
      availabilityFrequency: "Weekly",
      timeCommitment: "2-4 hours",
      locationFlexibility: "Kigali Only",
      interestAreas: ["Community Outreach"],
      message: "I would love to help organize the next digital awareness campaign."
    });

    console.log("✅ Sample applications created");

    // 5. Contact Submissions
    await db.insert(contactSubmissions).values([
      {
        name: "Prospective Student",
        email: "student@school.rw",
        message: "When is the next intake for the coding club?",
        type: "contact"
      }
    ]);
    console.log("✅ Contact submissions created");
    
    // 6. Students
    await db.insert(students).values([
        {
            name: "Keza Marie",
            email: "keza@student.rw",
            school: "Lycee de Kigali",
            grade: "S4",
            learningGoals: ["Learn Python", "Web Design"],
            interests: ["Robotics", "Coding"],
            location: "Kigali"
        },
        {
            name: "Manzi Eric",
            email: "manzi@student.rw",
            school: "Excella School",
            grade: "S5",
            learningGoals: ["Data Science"],
            interests: ["Math", "AI"],
            location: "Kigali"
        }
    ]);
    console.log("✅ Students created");

    console.log("✨ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
