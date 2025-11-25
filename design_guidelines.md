# Design Guidelines for Ikoranabuhanga Rigezweho®

## Design Approach

**Selected Approach**: Hybrid Reference + Custom Cultural Identity

This website combines the professionalism of educational platforms (like edX, Coursera) with the visual storytelling of social impact sites (like charity: water, TechSoup), enhanced by authentic Rwandan cultural elements through Imigongo geometric patterns. The design must balance corporate credibility with youth-friendly accessibility while honoring Rwanda's cultural heritage.

## Core Design Principles

1. **Cultural Authenticity**: Imigongo patterns as deliberate design elements, not decorative afterthoughts
2. **Youth Empowerment**: Inspiring, forward-looking aesthetic that energizes and motivates
3. **Professional Credibility**: Corporate-tech appearance suitable for partnerships with schools, NGOs, and government
4. **Accessibility First**: Clear hierarchy, readable typography, bilingual-ready structure

---

## Typography System

**Headings**: Poppins (Bold 600-700)
- H1: 2.5rem (mobile) / 4rem (desktop) - Hero headlines
- H2: 2rem (mobile) / 3rem (desktop) - Section headers
- H3: 1.5rem (mobile) / 2rem (desktop) - Subsections
- H4: 1.25rem - Card titles, program names

**Body Text**: Inter (Regular 400, Medium 500)
- Primary: 1rem (16px) - Main content
- Secondary: 0.875rem (14px) - Supporting text, captions
- Small: 0.75rem (12px) - Meta information, labels

**Special Typography**:
- Stats/Numbers: Montserrat Bold at larger sizes (3-4rem) for impact metrics
- Quotes: Poppins Medium, 1.5rem, italic treatment

---

## Layout & Spacing System

**Tailwind Spacing Primitives**: 4, 6, 8, 12, 16, 20, 24
- Micro spacing (between related elements): p-4, gap-4
- Component internal spacing: p-6, py-8
- Section padding: py-12 (mobile), py-20 (desktop)
- Major section breaks: py-24 (desktop)

**Container Strategy**:
- Full-width sections with inner max-w-7xl for content containment
- Text-heavy sections: max-w-4xl for readability
- Grid layouts: 1 column (mobile), 2 columns (tablet), 3-4 columns (desktop)

**Vertical Rhythm**:
- Consistent section padding creates breathing room
- Alternating background treatments (white, light gray) for section distinction
- Generous whitespace around CTAs and key messages

---

## Component Library

### Navigation
- Sticky header with white background, subtle shadow on scroll
- Logo left-aligned, navigation menu right-aligned
- Language toggle (EN/KN) prominently placed in top-right
- Mobile: Hamburger menu with slide-in drawer
- Navigation items transform into Deep Blue (#003DA5) on hover with subtle underline

### Hero Sections
**Home Hero**: Full-viewport (90vh) with large background image of Rwandan students in tech training
- Overlaid with semi-transparent Deep Blue gradient (bottom to top)
- Centered headline (white text) with Poppins Bold
- Subheadline in white, Inter Regular
- Two CTAs side-by-side: Primary (Cyan background, white text), Secondary (white background with Cyan border)
- Buttons have backdrop-blur-md for glass-morphism effect

**Secondary Heroes** (About, Programs pages): Half-height (50vh) with Imigongo pattern background
- Pattern in subtle Deep Blue/Cyan gradient overlay
- White text overlay with clear hierarchy

### Cards
**Program Cards**: Rounded-lg (border-radius: 0.5rem), white background, subtle shadow
- Icon or small image at top (80px height)
- Program title in Deep Blue
- Short description in gray
- "Learn More" link in Cyan with arrow icon
- Hover: lift effect (translate-y-1) with increased shadow

**Impact Stat Cards**: Centered layout with geometric Imigongo border accent
- Large number in Montserrat Bold, Cyan color
- Label below in Deep Blue
- Clean, minimal design

**Testimonial Cards**: Light gray background, rounded corners
- Quote marks in Cyan at top
- Testimonial text in Inter
- Attribution with small circular photo, name, and role

### Buttons
**Primary**: Cyan (#00AEEF) background, white text, px-8 py-4
- Rounded-md (border-radius: 0.375rem)
- Hover: darken Cyan by 10%, slight scale effect (scale-105)

**Secondary**: White background, Cyan border (2px), Cyan text
- Same padding and rounding as primary
- Hover: Cyan background with white text transition

**Tertiary**: Text-only links in Cyan with right arrow icon
- Underline on hover

### Forms
**Input Fields**: 
- Border: Light gray (2px), rounded-md
- Padding: px-4 py-3
- Focus state: Cyan border, subtle shadow
- Label above input in Deep Blue, small Inter Medium

**Form Layout**: Single column on mobile, two-column grid on desktop where logical
- Generous spacing between fields (gap-6)
- Submit button full-width on mobile, auto-width on desktop

### Imigongo Pattern Integration
**Strategic Placement**:
- Hero section backgrounds (subtle, low-opacity overlay)
- Section dividers as decorative elements
- Card borders and accents (single geometric line on left edge)
- Footer background pattern (very subtle, light gray on white)

**Pattern Treatment**:
- Use geometric triangles, diamonds, and chevron patterns
- Two-tone: Deep Blue + Cyan or Light Gray + White
- Opacity: 10-20% for backgrounds, 100% for accent elements
- SVG format for crisp rendering at all sizes

---

## Page-Specific Layouts

### Home Page (8-9 sections)
1. Hero with background image and glass-morphism CTAs
2. Three pillars section (3-column grid with icons and descriptions)
3. Impact statistics (4-column grid of stat cards)
4. Featured programs preview (3 program cards)
5. Quote section (centered, large typography with Imigongo accent)
6. Partner logos carousel (grayscale logos, 4-6 visible)
7. Latest news/events (2-3 cards in horizontal layout)
8. CTA section ("Join Our Mission" with form preview or contact button)
9. Footer with comprehensive links and contact info

### About Page (5-6 sections)
1. Hero with mission statement
2. Story section (two-column: text + photo of founder/team)
3. Vision, Mission, Values (three cards)
4. NST2 & SDG alignment (visual infographic with icons)
5. Founder profile (photo + bio in horizontal card)
6. Download section for concept note

### Programs Page (4-5 sections)
1. Hero introducing programs
2. Digital Literacy Clubs (image-left, content-right layout)
3. ICT Mentorship Program (image-right, content-left layout)
4. Community Engagement (image-left, content-right layout)
5. CTA to get involved

### Get Involved Page (4 sections)
1. Hero with engagement message
2. Three columns: Partner / Mentor / Volunteer (each with icon, description, CTA)
3. Contact form (two-column layout: form + contact details/map placeholder)
4. Impact reminder section

### Resources/News Page (3 sections)
1. Hero
2. Downloadable resources grid (PDF icons with titles)
3. News/blog cards in masonry or grid layout

### Contact Page (2 sections)
1. Contact form and information side-by-side
2. Map placeholder or additional contact methods

---

## Images

**Hero Images Required**:
1. **Home Hero**: Wide-angle shot of Rwandan youth engaged with computers/tablets in classroom setting, vibrant and energetic
2. **Programs Page**: Students collaborating on tech project, hands visible on keyboards
3. **About Page**: Portrait of founder JOSHUA Gasore or team photo in professional setting

**Supporting Images**:
4. Digital Literacy Club activities (students in groups)
5. Mentorship session (professional guiding student)
6. Community awareness event (outdoor or workshop setting)
7. Testimonial photos (circular headshots, 80px diameter)
8. Partner logos (collect from schools, NGOs - grayscale treatment)

**Image Treatment**:
- Aspect ratios: 16:9 for hero images, 4:3 for program cards, 1:1 for testimonials
- Subtle overlay on hero images for text readability
- High-quality, authentic photography showing real Rwandan contexts
- Avoid stock photos where possible; use genuine program photos

---

## Responsive Breakpoints

- Mobile: < 640px (single column, stacked layout)
- Tablet: 640px - 1024px (two columns where appropriate)
- Desktop: > 1024px (multi-column layouts, full grid systems)

**Mobile Optimizations**:
- Simplified navigation (hamburger menu)
- Stacked CTAs (full width)
- Single-column forms
- Reduced hero heights (60-70vh)
- Larger touch targets (min 44px)

---

## Bilingual Considerations

**Language Toggle**: Flag icons or text labels (EN | KN) in top-right header
**Content Structure**: All text wrapped in language-specific containers for easy switching
**RTL Ready**: While Kinyarwanda is LTR, maintain flexible text-align properties
**Font Loading**: Ensure Inter/Poppins support extended Latin characters for Kinyarwanda

---

## Animations & Interactions

Use sparingly and purposefully:
- Fade-in on scroll for section content (intersection observer)
- Smooth scroll behavior for anchor links
- Hover lift on cards (translate-y-1, 0.3s transition)
- Button scale on hover (scale-105)
- Form input focus transitions (border color, shadow)

Avoid: Excessive parallax, auto-playing carousels, heavy JavaScript animations

---

## Footer Design

Multi-column layout (4 columns on desktop, stacked on mobile):
1. **About**: Logo + tagline
2. **Quick Links**: Navigation menu
3. **Programs**: Links to each program
4. **Contact**: Address, phone, email, social icons

Background: Light Gray with subtle Imigongo pattern
Text: Deep Blue for headings, gray for body
Social Icons: Cyan on hover, outlined style