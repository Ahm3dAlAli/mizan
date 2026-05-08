# Mizan Landing Site

**Marketing site for Mizan - Agentic payment infrastructure for SMEs**

Live at: **http://localhost:3001**

## Overview

The Mizan landing site is a single-page scroll experience designed to introduce hackathon judges and future users to the Mizan platform. It follows the design specifications from the Landing Page PRD and matches the standalone HTML design.

## Structure

### 9 Main Sections

1. **Hero** - Category claim with animated lime spotlight, code snippet
2. **Thesis** - The manifesto explaining why this matters
3. **Attribution** - Clear credit to ArcPay foundation
4. **Problem** - Dubai SME pain point (manual payroll)
5. **Substrate** - Solution with code example
6. **Architecture** - 3-layer system (Kaiz → Mizan → ArcPay)
7. **Corridors** - 5 UAE payment lanes
8. **Stats** - By the numbers (5 agents, 5 corridors, 3s settlement)
9. **Agentic Economy** - Track 1 + Track 4 positioning
10. **Footer** - Links and attribution

## Design System

### Colors

Based on natural/earthy palette:

- **Forest** (`#0a4d3c`) - Primary text color
- **Sand** (`#f6f4ef`) - Light background
- **Ink** (`#0a0e1a`) - Dark background
- **Ivory** (`#f8f8f6`) - Light text
- **Lime** (`#e8ff4a`) - Accent color (CTAs, highlights)

### Typography

- **Body**: -apple-system, BlinkMacSystemFont (system fonts)
- **Code**: ui-monospace, SF Mono (monospace stack)
- **Sizes**: Generous line-height (1.7-2.0) for readability

### Motion

- **Hero spotlight**: 6s breathing animation (opacity 20% → 30%)
- **Section reveals**: Fade up on scroll (Framer Motion)
- **Staggered animations**: Cards/stats appear sequentially

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (port 3001)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **TypeScript** - Type safety

## Key Features

### Hero Section
- Animated lime spotlight gradient
- Code snippet with copy button
- Staggered fade-in animations (logo → tagline → code → CTA)
- Scroll indicator

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid layouts adapt from 1 column (mobile) to 2-4 columns (desktop)

### Performance
- Server Components by default (Next.js 15)
- Client Components only where needed (`'use client'`)
- Framer Motion viewport detection (animate once on scroll)

## Deployment

### Vercel (Recommended)

```bash
cd apps/landing
vercel deploy --prod
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=.next
```

### Self-Hosted

```bash
npm run build
npm start
# Runs on port 3001
```

## File Structure

```
apps/landing/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Main landing page (imports all sections)
│   └── globals.css             # Tailwind directives + global styles
├── components/
│   └── sections/
│       ├── HeroSection.tsx             # Hero with spotlight + code
│       ├── ThesisSection.tsx           # Manifesto
│       ├── AttributionSection.tsx      # ArcPay credit
│       ├── ProblemSection.tsx          # Dubai SME pain
│       ├── SubstrateSection.tsx        # Solution code
│       ├── ArchitectureSection.tsx     # 3-layer system
│       ├── CorridorsSection.tsx        # 5 UAE lanes
│       ├── StatsSection.tsx            # By the numbers
│       ├── AgenticSection.tsx          # Track 1 + 4
│       └── Footer.tsx                  # Links + attribution
├── tailwind.config.ts          # Custom Mizan color palette
├── package.json                # Dependencies
└── README.md                   # This file
```

## Design Philosophy

### Voice: Infrastructure Company

Not a hackathon project - this is positioned as a real infrastructure company. Tone is:
- **Declarative** - "Mizan is..." not "We help you..."
- **Categorical** - State what it is, don't apologize
- **Ambitious-but-grounded** - Big vision, concrete implementation

### Reference Sites
- Kite (RIP) - Category clarity
- Stripe - Code-first hero
- Plaid - Infrastructure positioning

## Sections Deep Dive

### 1. Hero Section

**Key Elements:**
- Lime spotlight (animated gradient) establishes brand
- Category claim in 5 seconds: "Agentic payment infrastructure for SMEs"
- Code snippet shows actual API (not pseudocode)
- "Built on ArcPay" credit visible immediately

**Motion Sequence (1.2s):**
1. 0-200ms: Spotlight blooms
2. 200-500ms: Logo fades in
3. 400-700ms: Tagline slides up
4. 600-900ms: Code snippet appears
5. 800-1100ms: CTA buttons
6. 1000-1200ms: Attribution credit

### 2. Thesis Section

**Purpose:** Earn the abstraction. Explain why agents need this.

**Structure:**
- 2 paragraphs building the case
- Closing line: "Mizan is that substrate." (28px, bold)

**Why it works:**
- Quotable (judges will screenshot)
- Makes hero claim credible
- Differentiates from feature-list sites

### 3. Attribution Section

**Purpose:** Transparent credit + credibility boost

**Key Message:**
- "Mizan extends ArcPay" (not "built from scratch")
- Lists 3 Arc Hackathon awards
- Shows clear separation: Corridors + Agents + Demo (NEW)
- Links to FORK.md for full attribution table

### 4. Problem Section

**Purpose:** Make the pain real

**Structure:**
- Concrete scenario: Dubai agency, 47 freelancers, 12 countries
- 5-step manual process (3 hours, 2-5 days, $520 fees)
- Quote from finance lead (persona validation)

### 5. Substrate Section

**Purpose:** Show the solution as code

**Key Element:**
- 3 lines of code replace 3-hour manual process
- Stats: 3s settlement, 1.0% fees, 100% transparent
- Dark background (inverse from sand) for contrast

### 6. Architecture Section

**Purpose:** Show 3-layer separation

**Visual Hierarchy:**
- Layer 1 (NEW): Kaiz - Lime border
- Layer 2 (NEW): Mizan - Lime border
- Layer 3 (INHERITED): ArcPay - Muted border

**Clarity:** Each layer has tech stack badge, purpose, components

### 7. Corridors Section

**Purpose:** Show 5 payment lanes

**Cards:** UAE → Philippines, India, Egypt, Pakistan, Nigeria
- Each shows FX, fee, settlement time
- Color-coded to match agent colors
- "+" card for expansion hint

### 8. Stats Section

**Purpose:** Quantify the impact

**8 Key Numbers:**
- 5 agents, 5 corridors, 5 Circle products, 5 contracts
- 3s settlement, 1.0% fees
- 28 modules (inherited), 100% transparent

### 9. Agentic Section

**Purpose:** Position for Track 1 + Track 4

**Key Messages:**
- Track 1: Cross-border (5 corridors)
- Track 4: Agentic economy (5 agents)
- Why agents need this (semantic abstractions, reasoning persistence)

### 10. Footer

**Structure:**
- 4 columns: Brand, Product, Resources, Built With
- Bottom bar: ArcPay credit + Circle/Arc links
- All external links open in new tab

## Content Strategy

### For Hackathon Judges

The landing site is optimized for **5-minute evaluation**:

1. **0-30s**: Hero → Understand category
2. **30-90s**: Thesis + Attribution → Credibility check
3. **90-180s**: Problem + Substrate → See value prop
4. **180-240s**: Architecture + Corridors → Technical depth
5. **240-300s**: Stats + Agentic → Track alignment

### Quotable Sections

Designed for screenshots:
- Thesis closing line: "Mizan is that substrate."
- Agentic quote: "Mizan is payment infrastructure for the agentic economy."
- Problem quote: Finance lead persona

## Accessibility

- Semantic HTML (section, nav, header, footer)
- ARIA labels on interactive elements
- Keyboard navigation supported
- Color contrast meets WCAG AA
- Smooth scroll behavior

## Performance Optimizations

- Server Components reduce JavaScript
- Framer Motion viewport detection (animate once)
- No heavy images/videos (text + code only)
- Tailwind JIT compilation (small CSS bundle)

## Future Enhancements

- [ ] `/docs` subpages (Quickstart, Architecture, Agents, API)
- [ ] `/playground` interactive code editor
- [ ] Video embed (demo walkthrough)
- [ ] Case studies section
- [ ] Newsletter signup
- [ ] Dark mode toggle

## Hackathon Context

This landing site is part of the **Mizan** submission for:
- **Stablecoins Commerce Stack Challenge** (Circle × Arc)
- **Track 1**: Cross-Border Payments
- **Track 4**: Agentic Economy
- **Deadline**: July 13, 2026

See main [MIZAN_README.md](/MIZAN_README.md) for full project documentation.

## License

MIT License - See [LICENSE](/LICENSE)

---

**Live Demo**: http://localhost:3001
**GitHub**: https://github.com/Ahm3dAlAli/arcpay-main

Built with ❤️ for the agentic economy.
