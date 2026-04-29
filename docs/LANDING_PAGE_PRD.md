# Mizan Landing Site - Product Requirements Document

**Version**: 1.0
**Product**: Mizan Marketing Site
**URL**: mizan.dev (or mizan.vercel.app)
**Purpose**: First impression for hackathon judges + future users
**Build Time**: 6-8 hours

---

## 1. Positioning

**Voice**: Infrastructure company (not a hackathon project)
**Reference**: Kite, Stripe, Plaid homepages
**Tone**: Declarative, categorical, ambitious-but-grounded

### The opening line:
> **"Agentic payment infrastructure for SMEs"**

Not "We help you..." or "The easiest way to..." — just state what it is.

---

## 2. Page Structure

**Single-page scroll** with **9 sections** + footer:

```
1. Hero              — 5-second category claim
2. Thesis            — The manifesto (2 paragraphs)
3. Built on ArcPay   — Attribution + credibility
4. The Problem       — Dubai SME pain
5. The Substrate     — Code snippet solution
6. How It Works      — 3-layer architecture
7. Five Corridors    — Visual map
8. By the Numbers    — Live stats
9. Agentic Economy   — Track 4 framing
10. Footer           — Links + attribution
```

Plus separate pages:
- `/docs` — Quickstart, architecture, agents
- `/playground` — (Stretch) Interactive code editor

---

## 3. Section-by-Section Specs

### 3.1 Hero Section

**Purpose**: State the category claim in 5 seconds

**Layout** (Desktop 1440px):
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  MIZAN                             Demo · GitHub · Docs      │
│  ─────                                                       │
│                                                              │
│                                                              │
│         Agentic payment infrastructure                       │
│         for SMEs.                                            │
│                                                              │
│         Mizan is the first system that lets autonomous       │
│         agents authenticate corridors, route value across    │
│         chains, and settle SME payments in stablecoins—      │
│         independently, transparently, instantly.             │
│                                                              │
│         [  Watch the Demo →  ]    GitHub ↗                   │
│                                                              │
│                                                              │
│         ┌──────────────────────────────────────────────┐    │
│         │  $ npm install @mizan/sdk                    │    │
│         │                                              │    │
│         │  import { mizan } from '@mizan/sdk'          │    │
│         │                                              │    │
│         │  await mizan                                 │    │
│         │    .corridor('uae-to-philippines')           │    │
│         │    .pay({ to: 'pedro@studio.dev',           │    │
│         │           amount: 850 })                     │    │
│         │                                              │    │
│         │  // Settled on Arc in 3 seconds.            │    │
│         └──────────────────────────────────────────────┘    │
│                                                              │
│         Built on ArcPay (3 prior Arc Hackathon awards).     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Motion Sequence** (on page load, 1200ms total):

1. **0-200ms**: Dark background → lime spotlight gradient blooms from top-right
2. **200-500ms**: "MIZAN" letters fade in one-by-one (50ms stagger)
3. **400-700ms**: Tagline fades up from 12px below
4. **600-900ms**: Code snippet card slides up + fades in
5. **800-1100ms**: CTA buttons fade in
6. **1000-1200ms**: "Built on ArcPay" credit fades in

**Ambient motion** (after load):
- Lime spotlight breathes (6s ease-in-out, opacity 20% to 30%)
- Code snippet has subtle syntax highlighting glow

**Components**:
```tsx
<HeroSection>
  <LimeSpotlight />  {/* Animated gradient */}
  <Logo>MIZAN</Logo>
  <Tagline>Agentic payment infrastructure for SMEs.</Tagline>
  <Subhead>Mizan is the first system that...</Subhead>
  <CTAGroup>
    <Button variant="primary">Watch the Demo →</Button>
    <Button variant="ghost">GitHub ↗</Button>
  </CTAGroup>
  <CodeSnippet />
  <AttributionCredit>Built on ArcPay...</AttributionCredit>
</HeroSection>
```

**Code Snippet Card**:
- Background: `--ivory` (inverse)
- Syntax highlighting: Keywords in lime, strings dimmed
- Copy button in top-right
- Subtle box shadow
- Width: 720px (desktop), full-width (mobile)

---

### 3.2 Thesis Section (The Manifesto)

**Purpose**: Earn the abstraction. Explain why this matters.

**Layout**:
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   ▎ THESIS                                                   │
│                                                              │
│                                                              │
│   The next generation of SMEs will operate as networks       │
│   of autonomous agents. Procurement agents will negotiate    │
│   with vendor agents. Treasury agents will rebalance         │
│   capital across chains. CFO agents will run payroll         │
│   without a human in the monthly loop.                       │
│                                                              │
│   The financial primitives those agents need do not yet      │
│   exist. Wallets exist. Stablecoins exist. Cross-chain       │
│   bridges exist. But there is no substrate that lets an      │
│   agent describe a payment in terms an SME finance lead      │
│   would recognize—by corridor, by counterparty, by           │
│   compliance posture, by reasoning trace.                    │
│                                                              │
│   Mizan is that substrate.                                   │
│                                                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Typography**:
- Label: 11px uppercase lime
- Body: 19px / 32px line-height (generous breathing room)
- Closing line "Mizan is that substrate.": 28px, display weight

**Why this section exists**:
- Makes the hero's category claim credible
- Quotable (judges will screenshot this)
- Differentiates from feature-listy hackathon sites

---

### 3.3 Built on ArcPay (Attribution Panel)

**Purpose**: Transparent credit + credibility boost

**Layout**:
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   ▎ INFRASTRUCTURE STANDS ON INFRASTRUCTURE                 │
│                                                              │
│   Mizan extends ArcPay—the 3-award-winning Arc SDK by       │
│   Himess (MIT, January 2026 Arc Hackathon: Best Dev Tools,  │
│   Best Trustless AI Agent, Best Gateway-Based Micropayments)│
│                                                              │
│   ArcPay solved the payment-primitive layer. Mizan adds     │
│   the layers above it that agents and SMEs need:            │
│                                                              │
│   ▸ Corridor configurations     5 UAE → Global lanes        │
│   ▸ Multi-agent orchestration   LangGraph, 5 specialists    │
│   ▸ SME demo application        Dubai agency payroll, e2e   │
│                                                              │
│   See the full attribution and originality table →          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Styling**:
- Inverse background (`--ivory`, not `--ink`)
- Stands out visually as a "credit block"
- 1px lime border
- Link to `/attribution` page

---

### 3.4 The Problem

**Purpose**: Make the pain specific and visceral

**Layout**: Two columns (left: copy, right: "chaos" visualization)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  THE PROBLEM                                                 │
│                                                              │
│                                                              │
│  ┌─────────────────────────┐  ┌────────────────────────────┐│
│  │                         │  │ ┌──────┐ ┌──────┐ ┌──────┐ ││
│  │ A Dubai agency pays     │  │ │ Wise │ │PayPal│ │ Bank │ ││
│  │ 12 freelancers across   │  │ └──────┘ └──────┘ └──────┘ ││
│  │ 6 countries.            │  │                            ││
│  │                         │  │ ┌─────────────────────────┐││
│  │ Two hours, every month. │  │ │ Excel: Q1 PAY           │││
│  │                         │  │ │  Pedro  $850            │││
│  │ 3 to 7% in fees.        │  │ │  Amaka $1200            │││
│  │                         │  │ └─────────────────────────┘││
│  │ 1 to 4 days to settle.  │  │                            ││
│  │                         │  │ "Did Pedro get his money?" ││
│  │ Zero structured audit.  │  │                            ││
│  │                         │  │                            ││
│  └─────────────────────────┘  └────────────────────────────┘│
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Right side "chaos" visualization**:
- CSS-only collage of browser tabs, Excel rows, Slack snippets
- Pixel-art or monochrome style
- Reads as "too many tools"

---

### 3.5 The Substrate (Solution)

**Purpose**: Show the code that "solves" it

**Layout**: Centered, bigger code snippet than hero

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  THE SUBSTRATE                                               │
│                                                              │
│                                                              │
│            One function. Five corridors.                     │
│            Settled on Arc.                                   │
│                                                              │
│            An agent describes a payment. Mizan resolves      │
│            the corridor, quotes the FX, evaluates the        │
│            rules, routes via CCTP, and persists every        │
│            decision.                                         │
│                                                              │
│            ┌────────────────────────────────────────────┐   │
│            │  // Pay 12 freelancers across 6 countries  │   │
│            │  // in 18 seconds.                         │   │
│            │                                            │   │
│            │  const run = await mizan.agent.payroll({   │   │
│            │    invoices: this_week,                    │   │
│            │    rules: 'strict'                         │   │
│            │  })                                        │   │
│            │                                            │   │
│            │  // Returns:                               │   │
│            │  // {                                      │   │
│            │  //   total: 4230.17,                      │   │
│            │  //   recipients: 6,                       │   │
│            │  //   chains: ['arc','base','solana'],     │   │
│            │  //   reasoning: '...',                    │   │
│            │  //   tx: ['0xa3f...', ...]                │   │
│            │  // }                                      │   │
│            └────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Code card**: Same styling as hero but larger (900px width)

---

### 3.6 How It Works (Architecture Diagram)

**Purpose**: Show the 3 layers with attribution badges

**Layout**:
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  HOW IT WORKS                                                │
│                                                              │
│  Three layers. Clean separation. Visible attribution.        │
│                                                              │
│                                                              │
│   ┌──────────────────────────────────────────────────────┐  │
│   │  KAIZ DEMO APP                          ✦ NEW        │  │
│   │  Next.js · Tailwind · Supabase                        │  │
│   │  9 screens of Dubai SME payroll UX                    │  │
│   └──────────────────────────────────────────────────────┘  │
│                              │                               │
│   ┌──────────────────────────────────────────────────────┐  │
│   │  MIZAN ORCHESTRATION                    ✦ NEW        │  │
│   │  Python · FastAPI · LangGraph · Claude                │  │
│   │  5 agents · corridor resolver · FX · reasoning log    │  │
│   └──────────────────────────────────────────────────────┘  │
│                              │                               │
│   ┌──────────────────────────────────────────────────────┐  │
│   │  ARCPAY SDK (FORK)                      ▿ INHERITED  │  │
│   │  TypeScript · Solidity · Circle · CCTP · x402         │  │
│   │  3 prior Arc Hackathon awards · MIT · attribution    │  │
│   └──────────────────────────────────────────────────────┘  │
│                              │                               │
│   ┌──────────────────────────────────────────────────────┐  │
│   │  ARC TESTNET    +    CIRCLE APIs                      │  │
│   └──────────────────────────────────────────────────────┘  │
│                                                              │
│   ✦ NEW: Mizan-original code                                │
│   ▿ INHERITED: Forked from ArcPay with full attribution     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Styling**:
- Each layer is a card with subtle drop shadow
- 1px lime lines connecting layers
- Badges (✦ NEW / ▿ INHERITED) in lime/dimmed
- Footnote explaining the badges

**Component**:
```tsx
<ArchitectureDiagram>
  <Layer badge="new" title="KAIZ DEMO APP">
    <Tech>Next.js · Tailwind · Supabase</Tech>
    <Description>9 screens of Dubai SME payroll UX</Description>
  </Layer>
  <Connector />
  <Layer badge="new" title="MIZAN ORCHESTRATION">
    ...
  </Layer>
  ...
</ArchitectureDiagram>
```

---

### 3.7 The Five Corridors (Visual Map)

**Purpose**: Show geographic reach + specific corridors

**Layout**:
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  THE FIVE CORRIDORS                                          │
│                                                              │
│                                                              │
│       [Stylized world map: Dubai → 5 lines outward]         │
│                                                              │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐│
│  │ UAE→PHILIPPINES │  │ UAE→INDIA       │  │ UAE→EGYPT    ││
│  │                 │  │                 │  │              ││
│  │ AED → PHP       │  │ AED → INR       │  │ AED → EGP    ││
│  │ Chain: Arc      │  │ Chain: Arc      │  │ Chain: Arc   ││
│  │ Settle: ~3s     │  │ Settle: ~3s     │  │ Settle: ~3s  ││
│  │ Fee: 1.0%       │  │ Fee: 1.0%       │  │ Fee: 0.8%    ││
│  └─────────────────┘  └─────────────────┘  └──────────────┘│
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ UAE→PAKISTAN    │  │ UAE→NIGERIA     │                  │
│  │                 │  │                 │                  │
│  │ AED → PKR       │  │ AED → NGN       │                  │
│  │ Chain: Arc      │  │ Chain: Arc      │                  │
│  │ Settle: ~3s     │  │ Settle: ~3s     │                  │
│  │ Fee: 1.2%       │  │ Fee: 1.5%       │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                              │
│  Each corridor is a JSON config encoding currency, FX       │
│  source, default chain, claim flow, and compliance hooks.   │
│                                                              │
│  Custom corridors can be registered at runtime.             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Map**:
- Simple SVG with abstract continents
- Lime arcs animate from Dubai to each destination on scroll-into-view
- OR: Dot matrix world map (more editorial)

**Corridor cards**:
- Flag emoji (🇵🇭, 🇮🇳, etc.)
- Currency pair
- Key stats (chain, settlement time, fee)
- 3-column grid on desktop, stack on mobile

---

### 3.8 By the Numbers (Live Stats)

**Purpose**: Show completion metrics from COMPLETION_TRACKER.md

**Layout**:
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  BY THE NUMBERS                                              │
│                                                              │
│                                                              │
│   5 / 5           5 / 5           80+                        │
│   corridors       agents          tests                      │
│                                                              │
│   50+             4               30+                        │
│   on-chain txs    chains via CCTP x402 calls                │
│                                                              │
│   5 / 5                                                      │
│   smart contracts deployed                                   │
│                                                              │
│                                                              │
│   All numbers verified on Arc testnet.                       │
│   Last updated: [auto-rendered date]                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Styling**:
- Inverse panel (`--ivory` background)
- Huge mono numbers (72px font size)
- Label below each number (13px)
- Reads like a "score card"

**Data source**:
- Read COMPLETION_TRACKER.md at build time
- OR: Static numbers (update manually)

---

### 3.9 Built for the Agentic Economy (Track 4)

**Purpose**: Frame Mizan for Track 4 submission

**Layout**: Two columns (left: copy, right: reasoning log sample)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  BUILT FOR THE AGENTIC ECONOMY                               │
│                                                              │
│                                                              │
│  ┌─────────────────────────┐  ┌──────────────────────────┐ │
│  │                         │  │ {                        │ │
│  │ Five LangGraph agents   │  │   "agent": "payables",   │ │
│  │ orchestrate every       │  │   "action": "propose",   │ │
│  │ payment.                │  │   "reasoning": "Pulled 8 │ │
│  │                         │  │     invoices due in 7    │ │
│  │ Supervisor              │  │     days. Excluded 2:    │ │
│  │ Classifier              │  │     Sparrow (new vendor, │ │
│  │ Treasurer               │  │     rule R3) and Pedro   │ │
│  │ Payables                │  │     (in PR-0043).        │ │
│  │ Gatekeeper              │  │     Treasury sufficient. │ │
│  │                         │  │     Routing: 4 Arc       │ │
│  │ Every decision logged.  │  │     direct, 2 CCTP.",    │ │
│  │ Every reasoning chain   │  │   "tools_called": [...]  │ │
│  │ persisted.              │  │ }                        │ │
│  │                         │  │                          │ │
│  │ When the agent acts,    │  │                          │ │
│  │ you can read why.       │  │                          │ │
│  └─────────────────────────┘  └──────────────────────────┘ │
│                                                              │
│  Tools the agents pay for autonomously via x402:             │
│  · OCR for invoice classification    · FX rate quotes       │
│  · Sanctions screening               · Identity lookups     │
│                                                              │
│  Sub-cent payments. USDC-denominated. Settled on Arc.        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Right column**:
- Stylized JSON of an agent action
- Mono font, subtle syntax highlighting
- Shows actual reasoning text

---

### 3.10 Footer

**Layout**:
```
┌──────────────────────────────────────────────────────────────┐
│  MIZAN                                                       │
│  ─────                                                       │
│                                                              │
│  PRODUCT          BUILD            CREDIT        LEGAL       │
│  Demo             GitHub           ArcPay        MIT License │
│  Playground       Docs             Attribution  Privacy      │
│  Architecture     Tracker          Roadmap                   │
│                                                              │
│  ────────────────────────────────────────────────────        │
│                                                              │
│  Mizan extends ArcPay (Himess, MIT, 3 Arc Hackathon awards).│
│  Built for Stablecoins Commerce Stack Challenge—Ignyte ×    │
│  Circle × Arc—submitted to Track 1 (Cross-Border) and       │
│  Track 4 (Agentic Economy).                                 │
│                                                              │
│  Testnet only. Educational and demo purposes.               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

4 columns, then attribution text, then disclaimer.

---

## 4. Design System

### 4.1 Color Palette (Same as Kaiz)

```css
--ink-deep: #060A14;        /* Page background (darker than Kaiz) */
--ink: #0A0E1A;
--ink-2: #131824;
--ink-3: #1C212E;

--ivory: #F8F8F6;
--ivory-2: #D4D4D0;
--ivory-3: #A8A8A0;

--lime: #E8FF4A;
--lime-dim: #C4DC3E;
--lime-glow-strong: rgba(232, 255, 74, 0.30);  /* Hero spotlight */
```

### 4.2 Typography

**Fonts**:
- **Display**: Basel Grotesk (or fallback to Inter with tighter spacing)
- **Body**: Inter
- **Mono**: IBM Plex Mono

**Sizes**:
```css
--hero-h1: 88px / 92px / -0.03em / 500;  /* Desktop */
--hero-h1-mobile: 56px / 60px;
--section-h2: 48px / 56px / -0.02em / 500;
--body-l: 19px / 30px;
--label: 11px uppercase;
```

### 4.3 Motion

**Principles**:
- Subtle, not distracting
- Enhances meaning (spotlight = focus, slide-up = reveal)
- Respects `prefers-reduced-motion`

**Framer Motion variants**:
```tsx
const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

---

## 5. Tech Stack

```json
{
  "framework": "Next.js 15 (App Router)",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "animation": "Framer Motion",
  "icons": "Lucide React",
  "fonts": "next/font (self-hosted)",
  "deployment": "Vercel"
}
```

---

## 6. File Structure

```
apps/landing/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Main landing page
│   ├── docs/
│   │   ├── layout.tsx              # Docs layout
│   │   ├── page.tsx                # Docs index
│   │   ├── quickstart/page.tsx
│   │   ├── corridors/page.tsx
│   │   ├── agents/page.tsx
│   │   └── architecture/page.tsx
│   └── attribution/page.tsx
│
├── components/
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ThesisSection.tsx
│   │   ├── AttributionPanel.tsx
│   │   ├── ProblemSection.tsx
│   │   ├── SubstrateSection.tsx
│   │   ├── ArchitectureDiagram.tsx
│   │   ├── CorridorsMap.tsx
│   │   ├── StatsPanel.tsx
│   │   ├── AgenticEconomySection.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── CodeSnippet.tsx
│   │   ├── Button.tsx
│   │   └── Badge.tsx
│   └── effects/
│       ├── LimeSpotlight.tsx
│       └── GrainOverlay.tsx
│
├── lib/
│   └── utils.ts
│
└── public/
    ├── logo.svg
    └── og.png                      # OG image (1200×630)
```

---

## 7. Build Phases

### Phase 1: Foundation (1.5 hours)

- [ ] Next.js setup
- [ ] Tailwind config
- [ ] Font loading (Basel Grotesk / Inter / IBM Plex Mono)
- [ ] Base layout
- [ ] Design tokens (colors, typography)

### Phase 2: Hero + Thesis (2 hours)

- [ ] Hero section with spotlight
- [ ] Logo animation
- [ ] Code snippet card
- [ ] Thesis section
- [ ] Attribution panel

### Phase 3: Problem → Agentic Economy (2.5 hours)

- [ ] Problem section
- [ ] Substrate section
- [ ] Architecture diagram
- [ ] Corridors map + cards
- [ ] Stats panel
- [ ] Agentic economy section

### Phase 4: Footer + Docs (1 hour)

- [ ] Footer
- [ ] `/docs` layout
- [ ] 4 docs pages (quickstart, corridors, agents, architecture)

### Phase 5: Polish (1 hour)

- [ ] Mobile responsive
- [ ] OG image
- [ ] SEO meta tags
- [ ] Performance optimization

**Total**: 8 hours

---

## 8. Key Components Implementation

### 8.1 LimeSpotlight Component

```tsx
'use client';

import { motion } from 'framer-motion';

export function LimeSpotlight() {
  return (
    <motion.div
      className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.2, 0.3, 0.2] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      style={{
        background: 'radial-gradient(circle, var(--lime-glow-strong) 0%, transparent 70%)',
        filter: 'blur(100px)'
      }}
    />
  );
}
```

### 8.2 CodeSnippet Component

```tsx
'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CodeSnippet({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-ivory text-ink p-6 rounded-xl font-mono text-sm max-w-3xl">
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 p-2 hover:bg-ink/5 rounded-lg transition"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      <pre className="overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}
```

### 8.3 ArchitectureDiagram Component

```tsx
export function ArchitectureDiagram() {
  const layers = [
    {
      badge: 'new',
      title: 'KAIZ DEMO APP',
      tech: 'Next.js · Tailwind · Supabase',
      description: '9 screens of Dubai SME payroll UX'
    },
    {
      badge: 'new',
      title: 'MIZAN ORCHESTRATION',
      tech: 'Python · FastAPI · LangGraph · Claude',
      description: '5 agents · corridor resolver · FX · reasoning log'
    },
    {
      badge: 'inherited',
      title: 'ARCPAY SDK (FORK)',
      tech: 'TypeScript · Solidity · Circle · CCTP · x402',
      description: '3 Arc Hackathon awards · MIT · attribution preserved'
    },
    {
      badge: null,
      title: 'ARC TESTNET + CIRCLE APIs',
      tech: '',
      description: 'USDC · Wallets · CCTP · Gateway · Nanopayments'
    }
  ];

  return (
    <div className="space-y-4">
      {layers.map((layer, i) => (
        <div key={i}>
          <div className="bg-ink-3 p-6 rounded-xl border border-lime/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-medium">{layer.title}</h3>
              {layer.badge && (
                <Badge variant={layer.badge === 'new' ? 'lime' : 'dim'}>
                  {layer.badge === 'new' ? '✦ NEW' : '▿ INHERITED'}
                </Badge>
              )}
            </div>
            {layer.tech && <p className="text-ivory-2 text-sm mb-1">{layer.tech}</p>}
            <p className="text-ivory-3 text-sm">{layer.description}</p>
          </div>
          {i < layers.length - 1 && (
            <div className="h-8 w-px bg-lime/30 mx-auto" />
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## 9. Responsive Design

### Breakpoints:
- Mobile: < 640px
- Tablet: 640px – 1024px
- Desktop: ≥ 1024px

### Mobile Changes:
- Hero H1: 88px → 56px
- Code snippets: Horizontal scroll
- Architecture: Stack vertically
- Corridor cards: 1 column
- Stats: 2×3 grid instead of 3×2
- Two-column sections → single column

---

## 10. SEO & Meta

```tsx
// app/layout.tsx
export const metadata = {
  title: 'Mizan — Agentic payment infrastructure for SMEs',
  description: 'The first system that lets autonomous agents authenticate corridors, route value across chains, and settle SME payments in stablecoins on Arc.',
  openGraph: {
    title: 'Mizan — Agentic payment infrastructure for SMEs',
    description: 'Corridor primitives. Multi-agent orchestration. Settled on Arc.',
    images: ['/og.png'],
    url: 'https://mizan.dev'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mizan — Agentic payment infrastructure for SMEs',
    description: 'Corridor primitives. Multi-agent orchestration. Settled on Arc.',
    images: ['/og.png']
  }
};
```

**OG Image** (`/og.png`):
- 1200×630px
- Dark background
- MIZAN logo top-left
- Hero tagline centered
- "Built on ArcPay" credit bottom
- Lime spotlight in corner

---

## 11. Performance

### Targets:
- Lighthouse Performance: 95+
- First Contentful Paint: < 1.0s
- Time to Interactive: < 1.5s
- Total page weight: < 200KB (excluding fonts)

### Optimizations:
- Use Next.js Image for all images
- Lazy load below-the-fold sections
- Minimize client JS (mostly Server Components)
- Self-host fonts with `next/font`
- Enable Vercel Edge caching

---

## 12. Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd apps/landing
vercel

# Production
vercel --prod

# Custom domain (if available)
vercel domains add mizan.dev
```

**Environment variables**: None needed (static site)

---

## Conclusion

The landing site is the **first impression**. It must:

1. ✅ State the category claim in 5 seconds (hero)
2. ✅ Earn the abstraction (thesis)
3. ✅ Show transparent attribution (ArcPay credit)
4. ✅ Demonstrate the value (problem → solution)
5. ✅ Prove technical depth (architecture diagram)
6. ✅ Show geographic scope (5 corridors)
7. ✅ Display real metrics (stats panel)
8. ✅ Frame for both tracks (Track 1 + Track 4 sections)

**Build it in 8 hours. Make it memorable. Win the hackathon.**

The hero and thesis sections are the most important—nail those, and the rest follows.
