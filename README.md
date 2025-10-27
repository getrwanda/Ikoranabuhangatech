# Ikoranabuhanga Rigezweho® Website

Official website for Ikoranabuhanga Rigezweho®, a Rwandan social enterprise empowering youth through digital literacy, ICT mentorship, and responsible technology use.

## 🌍 About

Ikoranabuhanga Rigezweho® (Building Rwanda's Future through Digital Literacy and Mentorship) is a youth empowerment initiative that nurtures a young tech-savvy community equipped with digital skills, mentorship, and ethical ICT awareness to drive Rwanda's transformation.

### Mission
To equip Rwandan youth with digital skills and mentorship that enable them to succeed in the fast-changing digital economy.

### Vision
A Rwanda where every young person is digitally literate, ethically aware, and empowered to contribute to national development through technology.

### Core Focus Areas
1. **Digital Literacy Training** - Building ICT skills through practical, hands-on learning
2. **ICT Mentorship & Career Guidance** - Connecting students with tech professionals and industry insights
3. **Community Engagement** - Promoting responsible and ethical technology use across society

### Impact Metrics
- 1,500+ youth empowered through ICT programs
- 15+ partner schools
- 500+ mentorship connections
- 100% aligned with Rwanda NST2 and UN SDGs

## ✨ Features

### Website Features
- **6 Fully Functional Pages**
  - Home: Hero section, impact stats, core pillars, partners
  - About: Mission, vision, values, NST2/SDG alignment, founder profile
  - Programs: Digital Literacy Clubs, ICT Mentorship, Community Engagement
  - Get Involved: Partner, Mentor, and Volunteer opportunities with forms
  - Resources: Downloadable materials, news/events, newsletter signup
  - Contact: Contact form and information

- **Authentic Rwandan Design**
  - Imigongo geometric patterns integrated throughout
  - Deep Blue (#003DA5) and Cyan (#00AEEF) brand colors
  - Poppins/Inter typography for professional look

- **Responsive Layout**
  - Mobile-first design
  - Works seamlessly across all devices

- **Bilingual-Ready Structure**
  - Language toggle in place (English/Kinyarwanda)
  - Content translation can be added easily

- **AI Assistant - Joesure**
  - Interactive chat widget powered by OpenAI
  - Answers questions about technology and programs
  - Provides guidance on getting involved
  - Streaming responses for real-time interaction

### Form Integrations
All forms are connected to backend APIs with validation:
- Contact form (general inquiries)
- Partnership inquiry form
- Mentor application form
- Volunteer interest form

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3 with TypeScript
- **Routing**: Wouter (lightweight routing)
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Shadcn UI components
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (React Query v5)
- **Build Tool**: Vite
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js with TypeScript
- **Storage**: In-memory storage (MemStorage)
- **AI Integration**: OpenAI GPT-4o-mini
- **Development**: tsx for TypeScript execution

### Design System
- **Primary Color**: Deep Blue (#003DA5 / hsl(203 100% 33%))
- **Accent Color**: Cyan (#00AEEF / hsl(195 100% 47%))
- **Background**: White (#FFFFFF)
- **Secondary**: Light Gray (#F5F6FA)
- **Headings**: Poppins (Bold 600-700)
- **Body**: Inter (Regular 400, Medium 500)
- **Display/Stats**: Montserrat (Bold)

## 📁 Project Structure

```
.
├── client/                    # Frontend application
│   ├── public/               # Static assets
│   │   └── favicon.png
│   └── src/
│       ├── components/       # React components
│       │   ├── ui/          # Shadcn UI components
│       │   ├── ChatWidget.tsx     # AI assistant chat widget
│       │   ├── Footer.tsx         # Site footer
│       │   ├── ImigongoPattern.tsx # Rwandan art patterns
│       │   └── Navigation.tsx     # Main navigation
│       ├── hooks/           # Custom React hooks
│       ├── lib/             # Utilities and configurations
│       ├── pages/           # Page components
│       │   ├── Home.tsx
│       │   ├── About.tsx
│       │   ├── Programs.tsx
│       │   ├── GetInvolved.tsx
│       │   ├── Resources.tsx
│       │   └── Contact.tsx
│       ├── App.tsx          # Main app component
│       ├── main.tsx         # Entry point
│       └── index.css        # Global styles
├── server/                   # Backend application
│   ├── email.ts             # Email notification service
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API routes and endpoints
│   ├── storage.ts           # In-memory data storage
│   └── vite.ts              # Vite integration
├── shared/                   # Shared TypeScript types
│   └── schema.ts            # Zod schemas for validation
├── attached_assets/          # Project assets
│   └── logo_*.png           # Organization logo
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager
- OpenAI API key (for AI chat assistant)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ikoranabuhanga-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file or set the following environment variable:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will start on `http://localhost:5000`

### Development Commands

```bash
# Start development server (frontend + backend)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check

# Database push (if using Drizzle ORM)
npm run db:push
```

## 🔌 API Endpoints

### Contact & Forms
- `POST /api/contact` - Submit general contact form
- `POST /api/mentor-application` - Submit mentor application
- `POST /api/partner-inquiry` - Submit partnership inquiry
- `POST /api/volunteer-application` - Submit volunteer application
- `GET /api/contact-submissions` - Retrieve all contact submissions

### AI Chat
- `POST /api/chat` - Chat with Joesure AI assistant (streaming responses)
  - Request body: `{ messages: Array<{role: 'user' | 'assistant', content: string}> }`
  - Response: Server-Sent Events (SSE) stream

## 🎨 Design Guidelines

### Cultural Elements
The website integrates authentic Rwandan Imigongo art patterns:
- Geometric patterns (triangles, diamonds, chevrons)
- Used subtly in backgrounds, accents, and section dividers
- SVG format for scalability and performance

### Brand Identity
- **Professional & Youth-Friendly**: Corporate-tech aesthetic with vibrant accents
- **Accessibility**: WCAG compliant, mobile-friendly design
- **Consistency**: Uniform visual identity across all pages

## 🌐 Alignment with National & Global Goals

### Rwanda NST2 Pillars
1. **Economic Transformation** - Advancing development through technology
2. **Social Transformation** - Equipping citizens with ICT skills
3. **Good Governance** - Enhancing digital literacy for transparent institutions

### UN Sustainable Development Goals
- **SDG 4**: Quality Education
- **SDG 8**: Decent Work and Economic Growth
- **SDG 9**: Industry, Innovation, and Infrastructure

## 📦 Deployment

### Replit Deployment
This project is optimized for Replit:

1. **Environment Setup**
   - Ensure `OPENAI_API_KEY` is set in Replit Secrets
   - Node.js 20 is automatically configured

2. **Publishing**
   - Use Replit's built-in deployment feature
   - The app will be available at a `.replit.app` domain
   - Custom domains can be configured in Replit settings

3. **Production Considerations**
   - All dependencies are automatically installed
   - Workflows restart automatically after changes
   - SSL/TLS is handled by Replit

### Manual Deployment
For other hosting platforms:

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables:
   - `OPENAI_API_KEY`
   - `NODE_ENV=production`

3. Start the production server:
   ```bash
   npm start
   ```

## 🤖 AI Assistant - Joesure

The website features Joesure, an AI-powered assistant that helps visitors:
- Learn about technology and digital literacy
- Get information about programs and services
- Understand how to get involved (partner, mentor, volunteer)
- Explore Rwanda's digital transformation initiatives

**Features:**
- Real-time streaming responses
- Context-aware conversations
- Knowledge about Ikoranabuhanga Rigezweho® mission and impact
- Professional and inspiring tone

**Technical Implementation:**
- OpenAI GPT-4o-mini model
- Server-Sent Events (SSE) for streaming
- Custom system prompt with organization knowledge
- Secure API key management

## 🔮 Future Enhancements

- [ ] Full bilingual content implementation (English + Kinyarwanda)
- [ ] Mentor dashboard for matching students and ICT professionals
- [ ] Blog content management system
- [ ] Newsletter automation
- [ ] Analytics integration (Google Analytics, Plausible)
- [ ] Payment gateway for donations
- [ ] Student portal for program registration
- [ ] Event calendar and booking system
- [ ] Success stories and testimonials section
- [ ] Video content library
- [ ] Social media feed integration

## 📧 Contact Information

**Ikoranabuhanga Rigezweho®**
- **Founder**: Joe Sure Gasore
- **Phone**: +250 788 331 033
- **Email**: info@ikoranabuhanga.tech
- **Website**: www.ikoranabuhanga.tech
- **Location**: NR24, Rwanda

**Social Media**
- Facebook: [Add link]
- LinkedIn: [Add link]
- YouTube: [Add link]
- X (Twitter): [Add link]

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Rwanda NST2 initiative
- United Nations Sustainable Development Goals
- Partner schools and organizations
- Mentors and volunteers
- Youth participants and their families

---

**Built with ❤️ for Rwanda's digital future**

*Last Updated: January 27, 2025*
