# Cyberwise Ethical Hacking Bootcamp LMS - Design Guidelines

## Design Approach

**System-Based with Custom Enhancement**: This educational platform combines Material Design principles for data-dense interfaces with custom cybersecurity-themed aesthetics. The design balances professional credibility with modern, tech-forward visual language appropriate for an ethical hacking bootcamp.

**Key Design Principles**:
- Authority & Trust: Professional layout establishing credibility for cybersecurity education
- Clarity Over Complexity: Information hierarchy that prioritizes learning outcomes
- Dark Sophistication: Modern dark theme with high contrast for extended screen time
- Progressive Disclosure: Layered information architecture preventing cognitive overload

---

## Core Design Elements

### A. Typography

**Font Families**:
- Primary: Inter (body text, UI elements, data displays)
- Accent: Poppins (headings, CTAs, section titles)

**Type Scale**:
- Display (H1): Poppins 4xl-6xl font-bold (hero headlines)
- Heading 1 (H2): Poppins 3xl-4xl font-semibold (page titles)
- Heading 2 (H3): Poppins 2xl font-semibold (section headers)
- Heading 3 (H4): Poppins xl font-medium (card titles, module names)
- Body Large: Inter lg font-normal (introductory paragraphs)
- Body: Inter base font-normal (content, descriptions)
- Body Small: Inter sm font-normal (metadata, timestamps, hints)
- Caption: Inter xs font-medium (labels, badges, status indicators)
- Monospace: font-mono text-sm (admission numbers, technical data)

---

### B. Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 20, 24** for consistent rhythm
- Tight spacing: p-2, gap-2 (inline elements, compact lists)
- Standard spacing: p-4, gap-4, mb-6 (cards, form fields)
- Comfortable spacing: p-8, gap-8, mb-12 (sections, page padding)
- Generous spacing: py-16, py-20, py-24 (section separators, hero areas)

**Grid Systems**:
- Dashboard: 12-column grid (lg:grid-cols-12) for flexible widget layouts
- Course Cards: 1/2/3 column responsive (grid-cols-1 md:grid-cols-2 xl:grid-cols-3)
- Module Content: Single column max-w-4xl for readability
- Admin Tables: Full-width with horizontal scroll on mobile

**Container Strategy**:
- Public pages: max-w-7xl mx-auto px-4 (marketing content)
- Dashboard: Full-width with sidebar navigation
- Content areas: max-w-6xl for optimal reading
- Forms: max-w-2xl centered for focus

---

### C. Component Library

#### Navigation
**Public Header**: Sticky navigation with logo left, links center, "Apply for Access" CTA right. Hamburger menu on mobile.

**Dashboard Sidebar**: Fixed left sidebar (256px desktop) with collapsible sections:
- User profile card at top (avatar, name, admission number)
- Main navigation icons + labels
- Secondary actions at bottom
- Mobile: Drawer overlay

**Breadcrumbs**: Show path for deep navigation (Dashboard > My Courses > Ethical Hacking 101 > Module 3)

#### Cards & Containers

**Course Card**: Image thumbnail top (16:9 ratio), title, category badge, progress bar, "Open Course" button. Subtle hover lift effect.

**Module Card**: Border-left accent (4px), module number badge, title, objectives list, start date, status indicator, "Start Module" button (disabled until release date).

**Module Prelude Card**: Distinct visual treatment with gradient border, video thumbnail or resource icon, "Available Before Module Starts" badge, embedded player or link.

**Dashboard Widget Cards**: Glassmorphic style with subtle backdrop blur, minimal borders, internal padding p-6, header with icon + title, content area, optional footer actions.

**Assignment Card**: File upload dropzone with dashed border, supported formats list, max size indicator, submission history timeline below.

#### Forms & Inputs

**Text Inputs**: Full-width with floating labels, border-2 with focus ring, helper text below, error states with red accent.

**File Upload**: Drag-drop zone with browse button, file preview thumbnails, progress bars during upload, remove option per file.

**Buttons**:
- Primary: Solid background, medium font-weight, px-6 py-3, rounded-lg
- Secondary: Border-2 outline style, same padding
- Danger: Red accent for delete/reject actions
- Icon Buttons: Square p-2, rounded for utility actions

**Status Badges**: Rounded-full px-3 py-1 text-xs font-semibold (Submitted, Graded, Pending, Approved)

#### Data Display

**Progress Bars**: h-2 rounded-full with gradient fill, percentage label above or inline.

**Tables**: Striped rows, sticky header, sortable columns, action column right-aligned, responsive horizontal scroll.

**Timeline**: Vertical line with dot markers for assignment history, submission feedback.

**Calendar Panel**: Month view with highlighted deadline dates, hover tooltips for events.

#### Notifications & Alerts

**Toast Notifications**: Bottom-right positioned, slide-in animation, icon + message + dismiss, auto-dismiss after 5s.

**Announcement Banner**: Full-width at dashboard top, dismissible, icon + title + description.

**Empty States**: Centered icon + heading + description + CTA for pages with no content.

#### Modals & Overlays

**Confirmation Dialogs**: Centered overlay with backdrop blur, icon + heading + message + action buttons.

**Module Prelude Modal**: Large modal for video playback or resource viewing before module unlock.

**Grade Feedback Modal**: Assignment details + feedback text area + grade input + submit.

---

### D. Page-Specific Layouts

#### Home Page (Public)
**Hero Section**: Full-width gradient background, centered content max-w-4xl, large heading (Poppins 5xl-6xl), subheading, dual CTAs ("Apply for Access" primary + "View Course Outline" secondary), cybersecurity-themed abstract illustration or tech imagery.

**Course Overview**: 2-column layout (text left, feature image right on desktop), bullet points with checkmark icons, NetAcad badges/logos.

**NetAcad Links Section**: Card grid with course thumbnail, title, "Access Course" + "Download Labs" buttons.

**FAQ Section**: Accordion components with question as button, answer expands below.

**Contact Section**: 2-column (contact form left, info card right with email, WhatsApp, office hours).

**Footer**: 3-column (About, Quick Links, Legal including Privacy Policy), social icons, copyright.

#### Application Form
**Single-page Form**: Centered max-w-2xl, progress indicator at top, grouped sections (Personal Info, Experience, Upload), inline validation, confirmation step before submit.

#### Login Page
**Centered Card**: max-w-md, logo at top, "Login with Admission Number" heading, username (admission number) field, password field with show/hide toggle, "Admin Reset Only" helper text, login button full-width.

**First-Time Login Flow**: Modal overlay forcing password change with strength meter, requirements checklist (8 chars, uppercase, lowercase, number, special char).

#### Student Dashboard
**Grid Layout**: Sidebar left, main content area with 12-column grid, widget cards spanning different column widths:
- Next Module: col-span-8 (prominent placement)
- Calendar: col-span-4
- Active Module: col-span-6
- Notifications: col-span-6
- Quick Links: col-span-12 (icon grid at bottom)

**Learning Stream**: Feed-style vertical layout with time-ordered cards.

#### My Courses
**Filter Bar**: Sticky top position with search input, category dropdown, sort dropdown, view toggle (grid/list).

**Course Grid**: Responsive 1-2-3 column, each card clickable, hover state scales slightly.

#### Module Page
**Header**: Module number, title, objectives in bordered section, release date badge, estimated time.

**Prelude Section**: If admin added, prominent placement with distinct styling (gradient border, video embed or resource link).

**Lesson List**: Numbered items with icons (video, reading, lab), clickable to external NetAcad links or embedded content.

**Assignments Section**: Cards per assignment with due date countdown, submission status, upload button.

#### Certificate Display
**Full-Page View**: Certificate template with professional layout, border treatment, student name large (Poppins 3xl), course name, completion date, italicized signature in elegant script-style font (alternative: Poppins italic semibold styled to look formal), download PDF button.

#### Admin Panel
**Table-Heavy Layout**: Full-width tables with filters, bulk actions toolbar, pagination, export CSV button, quick action buttons per row (Approve, Reject, View Details).

**Application Review Modal**: Student details in structured format, CV preview if uploaded, approve/reject buttons generate admission number automatically.

---

## Images

**Hero Image**: Full-width background - abstract cybersecurity visualization (network nodes, shield iconography, circuit patterns) with gradient overlay ensuring text readability. Alternatively, ethical hacker working at multiple screens (professional stock photo). Image should convey technology, security, and expertise.

**Course Thumbnails**: 16:9 ratio images for each course - use NetAcad course branding or related cybersecurity imagery (lock and key, code editor, network diagrams).

**Module Prelude**: Video thumbnails or placeholder for resource links - should preview content type.

**Empty State Illustrations**: Custom or library illustrations for "No courses yet", "No assignments", "No notifications" states.

**Certificate Background**: Subtle watermark or border pattern suggesting security/technology theme, non-intrusive.

---

## Accessibility & Interaction

- Focus visible states with 2px offset ring on all interactive elements
- Keyboard navigation support throughout with skip links
- ARIA labels for icon-only buttons and complex widgets
- Form validation immediate on blur, comprehensive on submit
- Loading states with skeleton screens or spinners for async operations
- Disabled state opacity-50 with cursor-not-allowed
- High contrast text ensuring WCAG AA compliance minimum

---

This design system creates a professional, modern educational platform that balances visual appeal with functional clarity, appropriate for a cybersecurity bootcamp requiring both credibility and technical sophistication.