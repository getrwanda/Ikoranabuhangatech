# Ikoranabuhanga Rigezweho® Website

## Project Overview
Modern, responsive, and bilingual-ready website for Ikoranabuhanga Rigezweho®, a Rwandan social enterprise focused on empowering youth through digital literacy, ICT mentorship, and responsible technology use.

## Organization Context
- **Name**: Ikoranabuhanga Rigezweho®
- **Tagline**: Building Rwanda's Future through Digital Literacy and Mentorship
- **Mission**: Nurture a young tech-savvy community equipped with digital skills, mentorship, and ethical ICT awareness
- **Contact**: 
  - Founder: Joe Sure Gasore
  - Phone: +250 788 331 033
  - Email: info@ikoranabuhanga.tech
  - Location: NR24, Rwanda

## Core Focus Areas
1. **Digital Literacy Training** - Hands-on ICT skills through practical learning
2. **ICT Career Guidance & Mentorship** - Connecting students with tech professionals
3. **Community Engagement** - Promoting responsible and ethical technology use

## Tech Stack
- **Frontend**: React with TypeScript, Wouter for routing
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Shadcn UI components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL (via Neon) with Drizzle ORM
- **Email**: Resend for transactional emails
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (React Query v5)

## Design System
### Colors
- **Primary**: Deep Blue (#003DA5 / hsl(203 100% 33%))
- **Accent**: Cyan (#00AEEF / hsl(195 100% 47%))
- **Background**: White (#FFFFFF)
- **Secondary**: Light Gray (#F5F6FA)

### Typography
- **Headings**: Poppins (Bold 600-700)
- **Body**: Inter (Regular 400, Medium 500)
- **Display/Stats**: Montserrat (Bold)

### Cultural Elements
- Imigongo Art Patterns integrated throughout the design
- Geometric patterns (triangles, diamonds, chevrons) in SVG format
- Used subtly in backgrounds, accents, and section dividers

## Project Structure

### Pages
1. **Home** (`/`) - Hero, impact stats, core pillars, partners, quote section
2. **About** (`/about`) - Mission, vision, values, NST2/SDG alignment, founder profile
3. **Programs** (`/programs`) - Digital Literacy Clubs, ICT Mentorship, Community Engagement (with modals)
4. **Events** (`/events`) - Event calendar with category filtering and online registration
5. **Blog** (`/blog`) - News & stories with category filtering and individual post pages
6. **Get Involved** (`/get-involved`) - Partner, Mentor, and Volunteer opportunities with forms
7. **Resources** (`/resources`) - Downloadable materials, news/events, newsletter signup
8. **Contact** (`/contact`) - Contact form and information

### Key Components
- **Navigation**: Sticky header with language toggle (EN/KN), responsive mobile menu
- **Footer**: Multi-column layout with contact info, social links, quick links
- **ImigongoPattern**: SVG pattern component for cultural authenticity
- **ImigongoAccent**: Decorative geometric border accent

### Forms
All forms submit to backend API endpoints:
- Contact form (general inquiries)
- Partnership inquiry form
- Mentor application form
- Volunteer interest form

Forms send data to `/api/contact` endpoint which forwards to `info@ikoranabuhanga.tech`

## Development Commands
- `npm run dev` - Start development server (frontend + backend)
- Frontend runs on Vite dev server
- Backend runs on Express server
- Both served on same port via Vite proxy

## Alignment
### Rwanda NST2 Pillars
1. Economic Transformation - advancing development through technology
2. Social Transformation - equipping citizens with ICT skills
3. Good Governance - enhancing digital literacy for transparent institutions

### UN Sustainable Development Goals
- SDG 4: Quality Education
- SDG 8: Decent Work and Economic Growth
- SDG 9: Industry, Innovation, and Infrastructure

## Impact Metrics
- 1,500+ youth empowered through ICT programs
- 15+ partner schools
- 500+ mentorship connections
- 100% aligned with NST2 and UN SDGs

## Admin Dashboard
The website includes a comprehensive admin panel for content and program management:

### Admin Pages
1. **Dashboard** (`/admin/dashboard`) - Overview with statistics for all entities
2. **Events Management** (`/admin/events`) - Create, edit, and manage events
3. **Blog Management** (`/admin/blog`) - Manage blog posts and news articles
4. **Students Management** (`/admin/students`) - Track students in programs
5. **Mentor Matching** (`/admin/mentor-matching`) - Match students with ICT professional mentors
6. **Settings** (`/admin/settings`) - Account management and password change

### Mentor Matching System
Complete system for connecting students with ICT professionals:
- **Students Database**: Track students with grade level, interests, location, and contact info
- **Mentor Matching**: Create and manage mentor-student matches with:
  - Status tracking (active, completed, paused)
  - Start and end dates
  - Notes and progress tracking
  - Automatic dropdown of available mentors from mentor applications
  - Searchable student list by name or email
- **Dashboard Metrics**: Real-time counts of students and active mentor matches
- **Authentication**: All admin routes protected with requireAuth middleware

### Database Schema
- `users`: Admin user accounts with bcrypt-hashed passwords
- `students`: Student profiles with grade, interests (array), location, contact info
- `mentorMatches`: Matches between students and mentors with status, dates, notes
- Uses PostgreSQL with Drizzle ORM
- All date fields use `z.coerce.date()` for seamless JSON/API compatibility

### Admin Authentication
- **Default Admin User**: username `sudox`
- Password change available in Settings page
- Session-based authentication using Passport.js with PostgreSQL session store
- All admin routes protected with requireAuth middleware

## Future Enhancements
- Full bilingual content implementation (English + Kinyarwanda)
- Newsletter automation
- Analytics integration
- Payment gateway for donations
- Public-facing mentor dashboard for mentors to update match progress

## Recent Completion
- PostgreSQL database integration for form persistence
- Resend email service for form submission notifications
- Production-ready contact, mentor, partner, and volunteer forms
- Event Calendar & Registration System with:
  - Database schema for events and event registrations
  - Category filtering (Digital Literacy, Mentorship, Community Engagement)
  - Online event registration with capacity tracking
  - Email notifications (confirmation to attendees, notification to admin)
  - 12 sample upcoming events seeded in database
- Blog/News System with:
  - Database schema for blog posts with slug-based URLs
  - Category filtering (Success Stories, Digital Literacy Tips, Community News, Events Recap)
  - Responsive blog listing page with featured images
  - Individual blog post pages with rich content display
  - 8 sample blog posts seeded across all categories
- **Mentor Matching Dashboard**:
  - Complete student management system with CRUD operations
  - Mentor-student matching interface with status tracking
  - Integration with existing mentor applications database
  - Dashboard statistics for students and matches
  - Secure admin-only access with authentication
- **Admin Account Management**:
  - Secure password change functionality in Settings page
  - Current password verification before allowing changes
  - Client-side and server-side password validation (minimum 8 characters)
  - Password confirmation matching
  - User-friendly error messages and success notifications
  - Bcrypt password hashing for security
- **Vercel Deployment Architecture** (Latest):
  - Refactored backend to work as proper Vercel serverless function
  - Created `api/index.ts` as Vercel function handler with memoized app initialization
  - Separated `setupApp()` and `startServer()` in `server/index.ts` for dual-mode operation
  - Supports both local development (with Vite HMR) and Vercel serverless deployment
  - Error-resilient initialization with automatic retry on failure
  - Configured `vercel.json` for proper API routing (`/api/*` → serverless function)
  - Frontend routes (`/*`) served from static build output (`dist/public`)
