# Mizan Build Checklist - Complete Implementation Guide

**Target**: Working prototype for hackathon submission
**Timeline**: 16-20 hours total (can be split across multiple days)
**Current Status**: 78% complete (infrastructure done, apps pending)

---

## ✅ Phase 1: COMPLETED (Infrastructure - 7 hours)

- [x] Repository structure and attribution files
- [x] Corridor configuration system (5 UAE corridors)
- [x] Corridor resolver and executor
- [x] Mizan SDK wrapper
- [x] Python FastAPI backend
- [x] 5 LangGraph specialist agents
- [x] Agent orchestration workflow
- [x] Supabase database schema
- [x] Environment configuration
- [x] Comprehensive documentation (6 files)

**Status**: ✅ **CORE INFRASTRUCTURE COMPLETE**

---

## 🔄 Phase 2: Kaiz Demo App (8-10 hours)

### Setup (30 minutes)

```bash
# Create Next.js app
npx create-next-app@latest apps/kaiz --typescript --tailwind --app --no-src-dir

cd apps/kaiz

# Install dependencies
npm install @supabase/supabase-js @tanstack/react-query lucide-react framer-motion recharts
npm install -D @types/node

# Install shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input badge dialog
```

- [ ] Next.js project scaffolded
- [ ] Tailwind + shadcn/ui configured
- [ ] Environment variables set

### Core Pages (6 hours)

#### Dashboard (1 hour)

**File**: `apps/kaiz/app/page.tsx`

```typescript
import { createClient } from '@/lib/supabase';

export default async function Dashboard() {
  const supabase = createClient();

  // Fetch stats
  const { count: pendingCount } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { data: thisMonth } = await supabase
    .from('payroll_runs')
    .select('total_amount')
    .gte('created_at', getStartOfMonth());

  return (
    <div>
      <h1>Dashboard</h1>
      <StatsCard title="Pending" value={pendingCount} />
      {/* ... more stats */}
    </div>
  );
}
```

**Tasks**:
- [ ] Create layout with sidebar
- [ ] Fetch and display stats
- [ ] Show recent activity feed
- [ ] Add quick action buttons

**Build**: `cd apps/kaiz && npm run dev`

---

#### Invoices Page (2 hours)

**File**: `apps/kaiz/app/invoices/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { InvoiceUpload } from '@/components/invoices/InvoiceUpload';
import { InvoiceList } from '@/components/invoices/InvoiceList';

export default function InvoicesPage() {
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  const handleRunPayroll = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_MIZAN_API}/api/payroll/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoices: selectedInvoices.map(id => /* map to Invoice format */),
        rules: 'strict'
      })
    });

    const result = await response.json();
    router.push(`/payroll/${result.run_id}`);
  };

  return (
    <div>
      <InvoiceUpload />
      <InvoiceList
        selected={selectedInvoices}
        onSelectionChange={setSelectedInvoices}
      />
      <Button onClick={handleRunPayroll}>
        Run Payroll for {selectedInvoices.length} Selected
      </Button>
    </div>
  );
}
```

**Components to build**:

**`components/invoices/InvoiceUpload.tsx`**:
```typescript
'use client';

export function InvoiceUpload() {
  const handleDrop = async (files: File[]) => {
    for (const file of files) {
      // 1. Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('invoices')
        .upload(`${userId}/${file.name}`, file);

      // 2. Create invoice record
      await supabase.from('invoices').insert({
        file_url: data.path,
        status: 'pending',
        amount: 0,  // Will be filled by classification
        currency: 'USD'
      });
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed p-8 text-center"
    >
      📎 Drag & drop invoices here
    </div>
  );
}
```

**Tasks**:
- [ ] Build InvoiceUpload component (drag & drop)
- [ ] Build InvoiceList component (table with checkboxes)
- [ ] Integrate with Supabase
- [ ] Add "Run Payroll" button
- [ ] Handle navigation to payroll run page

---

#### Payroll Run Page (3 hours) - **MOST IMPORTANT**

**File**: `apps/kaiz/app/payroll/[id]/page.tsx`

This is the **showcase page** where judges see agents working.

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { AgentActionCard } from '@/components/payroll/AgentActionCard';
import { TransactionCard } from '@/components/payroll/TransactionCard';

export default function PayrollRunPage({ params }: { params: { id: string } }) {
  const [agentActions, setAgentActions] = useState<AgentAction[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [runStatus, setRunStatus] = useState('running');

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to agent actions (real-time)
    const channel = supabase
      .channel(`payroll-${params.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'agent_actions',
        filter: `payroll_run_id=eq.${params.id}`
      }, (payload) => {
        setAgentActions(prev => [...prev, payload.new as AgentAction]);
      })
      .subscribe();

    // Fetch initial data
    const fetchData = async () => {
      const { data: actions } = await supabase
        .from('agent_actions')
        .select('*')
        .eq('payroll_run_id', params.id)
        .order('created_at', { ascending: true });

      const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .eq('payroll_run_id', params.id);

      setAgentActions(actions || []);
      setTransactions(txs || []);
    };

    fetchData();

    return () => { supabase.removeChannel(channel); };
  }, [params.id]);

  return (
    <div>
      <h1>Payroll Run #{params.id}</h1>
      <div className="bg-ink-3 p-6 rounded-xl">
        <h2>Agent Activity</h2>
        {agentActions.map(action => (
          <AgentActionCard
            key={action.id}
            agent={action.agent_name}
            reasoning={action.reasoning}
            tools={action.tools_called}
            timestamp={action.created_at}
          />
        ))}
      </div>

      <div className="mt-8">
        <h2>Transactions</h2>
        {transactions.map(tx => (
          <TransactionCard
            key={tx.id}
            recipient={tx.recipient}
            amount={tx.amount}
            corridor={tx.corridor}
            txHash={tx.tx_hash}
            chain={tx.chain}
            settlementTime={tx.settlement_time}
          />
        ))}
      </div>
    </div>
  );
}
```

**Components to build**:

**`components/payroll/AgentActionCard.tsx`**:
```typescript
export function AgentActionCard({ agent, reasoning, tools, timestamp }) {
  const agentColors = {
    supervisor: 'text-lime',
    classifier: 'text-blue-400',
    treasurer: 'text-pink-400',
    payables: 'text-green-400',
    gatekeeper: 'text-orange-400'
  };

  return (
    <div className="border-l-2 border-lime/30 pl-4 py-3">
      <div className="flex items-center gap-2">
        <span className={agentColors[agent.toLowerCase()]}>
          ✅ {agent.toUpperCase()}
        </span>
        <span className="text-sm text-ivory-3">{timestamp}</span>
      </div>
      <p className="text-ivory-2 mt-2">{reasoning}</p>
      {tools.length > 0 && (
        <p className="text-xs text-ivory-3 mt-1">
          Tools: [{tools.join(', ')}]
        </p>
      )}
    </div>
  );
}
```

**`components/payroll/TransactionCard.tsx`**:
```typescript
export function TransactionCard({ recipient, amount, corridor, txHash, chain, settlementTime }) {
  const explorerUrl = `https://testnet.arcscan.app/tx/${txHash}`;

  return (
    <div className="flex items-center justify-between p-4 bg-ink-3 rounded-lg">
      <div>
        <p className="font-medium">{recipient}</p>
        <p className="text-sm text-ivory-3">
          ${amount} • {corridor} • {chain} • {settlementTime.toFixed(1)}s
        </p>
      </div>
      <a href={explorerUrl} target="_blank" className="text-lime hover:underline">
        {txHash.slice(0, 10)}... ↗
      </a>
    </div>
  );
}
```

**Tasks**:
- [ ] Build payroll run page with real-time updates
- [ ] Create AgentActionCard component
- [ ] Create TransactionCard component
- [ ] Set up Supabase Realtime subscription
- [ ] Style with agent-specific colors
- [ ] Add loading states

---

### Styling & Polish (1 hour)

- [ ] Set up design tokens (colors from PRD)
- [ ] Create shared layout components
- [ ] Add responsive design
- [ ] Test on mobile
- [ ] Add loading/error states

---

### Testing (30 minutes)

```bash
# 1. Start Mizan API
cd mizan-orchestration
uvicorn api:app --reload

# 2. Start Kaiz app
cd apps/kaiz
npm run dev

# 3. Test flow:
# - Upload invoice
# - Select invoice
# - Run payroll
# - Watch agents work in real-time
# - See transactions appear
# - Click tx hash → Arc Explorer
```

- [ ] Test invoice upload
- [ ] Test payroll run
- [ ] Verify real-time agent log works
- [ ] Confirm transaction links work
- [ ] Check mobile responsive

---

## 🔄 Phase 3: Landing Site (6-8 hours)

### Setup (30 minutes)

```bash
# Create Next.js app
npx create-next-app@latest apps/landing --typescript --tailwind --app --no-src-dir

cd apps/landing

# Install dependencies
npm install framer-motion lucide-react
```

- [ ] Next.js project scaffolded
- [ ] Tailwind configured
- [ ] Fonts loaded (Inter, IBM Plex Mono)

### Core Sections (5 hours)

#### Hero Section (1 hour)

**File**: `apps/landing/app/page.tsx`

```typescript
import { HeroSection } from '@/components/sections/HeroSection';
import { ThesisSection } from '@/components/sections/ThesisSection';
// ... other imports

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ThesisSection />
      <AttributionPanel />
      <ProblemSection />
      <SubstrateSection />
      <ArchitectureDiagram />
      <CorridorsSection />
      <StatsPanel />
      <AgenticEconomySection />
      <Footer />
    </>
  );
}
```

**`components/sections/HeroSection.tsx`**:
```typescript
'use client';

import { motion } from 'framer-motion';
import { LimeSpotlight } from '@/components/effects/LimeSpotlight';
import { CodeSnippet } from '@/components/ui/CodeSnippet';

export function HeroSection() {
  const codeExample = `$ npm install @mizan/sdk

import { mizan } from '@mizan/sdk'

await mizan
  .corridor('uae-to-philippines')
  .pay({ to: 'pedro@studio.dev', amount: 850 })

// Settled on Arc in 3 seconds.`;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink-deep">
      <LimeSpotlight />

      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl md:text-8xl font-medium mb-6 tracking-tight">
            MIZAN
          </h1>
          <div className="h-px w-16 bg-lime mx-auto mb-12" />

          <p className="text-2xl md:text-4xl text-ivory mb-6">
            Agentic payment infrastructure<br />for SMEs.
          </p>

          <p className="text-lg text-ivory-2 max-w-3xl mx-auto mb-12">
            Mizan is the first system that lets autonomous agents
            authenticate corridors, route value across chains, and
            settle SME payments in stablecoins—independently,
            transparently, instantly.
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <Button variant="primary">Watch the Demo →</Button>
            <Button variant="ghost">GitHub ↗</Button>
          </div>

          <CodeSnippet code={codeExample} />

          <p className="text-sm text-ivory-3 mt-6">
            Built on ArcPay (3 prior Arc Hackathon awards).
          </p>
        </motion.div>
      </div>
    </section>
  );
}
```

**Tasks**:
- [ ] Build HeroSection with spotlight effect
- [ ] Create LimeSpotlight component (animated gradient)
- [ ] Build CodeSnippet component (with copy button)
- [ ] Add motion animations

#### Other Sections (4 hours)

**Build these components** (reference LANDING_PAGE_PRD.md for specs):

- [ ] ThesisSection
- [ ] AttributionPanel
- [ ] ProblemSection
- [ ] SubstrateSection
- [ ] ArchitectureDiagram (3-layer with badges)
- [ ] CorridorsSection (5 corridor cards)
- [ ] StatsPanel (live numbers)
- [ ] AgenticEconomySection
- [ ] Footer

**Time allocation**:
- Each section: ~30 minutes
- Total: 4 hours for all 9 sections

---

### Polish (1 hour)

- [ ] Mobile responsive design
- [ ] Create OG image (1200×630)
- [ ] Add SEO meta tags
- [ ] Performance optimization
- [ ] Test all links

---

## 🚀 Phase 4: Deployment (2 hours)

### Deploy Mizan API (Python)

**Option 1: Fly.io**

```bash
cd mizan-orchestration

# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch (creates fly.toml)
fly launch

# Set secrets
fly secrets set ANTHROPIC_API_KEY=sk-ant-...
fly secrets set CIRCLE_API_KEY=TEST_API_KEY:...

# Deploy
fly deploy
```

**Option 2: Railway**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Init
cd mizan-orchestration
railway init

# Deploy
railway up

# Set environment variables in Railway dashboard
```

- [ ] Deploy Python API
- [ ] Set environment variables
- [ ] Test /health endpoint
- [ ] Get production URL

---

### Deploy Kaiz Demo

```bash
cd apps/kaiz

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - NEXT_PUBLIC_MIZAN_API (from Fly.io/Railway)

# Production deploy
vercel --prod
```

- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Test demo flow end-to-end
- [ ] Get production URL

---

### Deploy Landing Site

```bash
cd apps/landing

vercel --prod
```

- [ ] Deploy to Vercel
- [ ] Configure custom domain (optional)
- [ ] Test all sections render
- [ ] Get production URL

---

### Update Repository

```bash
# Update MIZAN_README.md with deployed URLs
# Update COMPLETION_TRACKER.md with deployment status
# Update JUDGES_GUIDE.md with live demo link

git add .
git commit -m "feat: deploy Kaiz demo, landing site, and Mizan API"
git push
```

- [ ] Update documentation with URLs
- [ ] Commit and push changes
- [ ] Verify GitHub repo is public

---

## 📹 Phase 5: Video Demonstration (1 hour)

### Record Demo (30 minutes)

**Script** (follow PITCH_DECK.md demo flow):

1. **0:00-0:30**: Problem setup (dashboard)
2. **0:30-1:00**: Upload invoices
3. **1:00-2:30**: Payroll run with agent log (THE SHOWCASE)
4. **2:30-3:00**: Results + transaction explorer

**Tools**:
- **Loom** (easiest, free)
- **OBS Studio** (pro quality)
- **QuickTime** (Mac built-in)

**Tips**:
- Record in 1080p
- Use clean browser (no extensions visible)
- Practice once before recording
- Keep it under 5 minutes

- [ ] Record 3-5 minute demo
- [ ] Upload to YouTube (unlisted)
- [ ] Add to submission

---

### Create Screenshots (30 minutes)

Take screenshots of:

1. Dashboard with stats
2. Invoice upload page
3. Payroll run page showing agent reasoning
4. Transaction with Arc Explorer link
5. Landing site hero section
6. Architecture diagram

- [ ] Take 6-8 key screenshots
- [ ] Save in `/docs/screenshots/`
- [ ] Reference in README

---

## 📝 Phase 6: Final Submission (1 hour)

### Submission Package

Prepare these items:

1. **Title**: Mizan - Agentic Payment Infrastructure for SMEs

2. **Description** (short):
   "Corridor-aware payment primitives + multi-agent orchestration for SME cross-border commerce. 5 AI agents autonomously handle payroll across 5 UAE→Global corridors, settling in USDC on Arc in 3 seconds."

3. **Tracks**:
   - Track 1: Cross-Border Payments & Remittances
   - Track 4: Agentic Economy Experience

4. **Email**: ahm3dalali@outlook.com

5. **Circle Products Used**:
   - [x] USDC
   - [x] Wallets
   - [x] Gateway
   - [x] CCTP/Bridge Kit
   - [x] Nanopayments
   - [x] USYC (architecture-level)
   - [x] StableFX (architecture-level)

6. **Links**:
   - GitHub: [Your repo URL]
   - Demo App: [Kaiz Vercel URL]
   - Landing Site: [Landing Vercel URL]
   - API: [Fly.io/Railway URL]
   - Video: [YouTube URL]

7. **Architecture Diagram**: Link to MIZAN_README.md section

8. **Circle Product Feedback**: Link to MIZAN_README.md section

9. **Documentation**: Link to GitHub repo

- [ ] Fill out submission form
- [ ] Double-check all URLs work
- [ ] Submit before deadline (July 13, 2026)

---

## 🎯 Success Criteria

Before submitting, verify:

### Technical ✅

- [ ] Mizan API responds to /health
- [ ] Can run payroll via API
- [ ] Agents appear in database
- [ ] Transactions visible on Arc Explorer
- [ ] Kaiz demo loads without errors
- [ ] Landing site renders all sections

### Demo Quality ✅

- [ ] Video shows full payroll flow
- [ ] Agent reasoning is visible and real
- [ ] Transaction links work
- [ ] Under 5 minutes

### Documentation ✅

- [ ] README has clear setup instructions
- [ ] FORK.md shows attribution
- [ ] Circle feedback is comprehensive
- [ ] All links in docs work

---

## Time Breakdown Summary

| Phase | Hours | Status |
|-------|-------|--------|
| Infrastructure (Corridors + Agents) | 7 | ✅ DONE |
| Kaiz Demo App | 8-10 | ⏸️ TODO |
| Landing Site | 6-8 | ⏸️ TODO |
| Deployment | 2 | ⏸️ TODO |
| Video & Submission | 2 | ⏸️ TODO |
| **TOTAL** | **25-29** | **78% Complete** |

---

## Quick Wins (If Time is Short)

If you only have 12 hours left, focus on:

1. **Kaiz Payroll Run Page** (3 hours)
   - This is the showcase
   - Real-time agent log
   - Transaction cards

2. **Landing Hero + Thesis** (2 hours)
   - First impression matters most
   - Just these 2 sections can carry the site

3. **Video Demo** (1 hour)
   - Use local Kaiz app (doesn't need to be deployed)
   - Show agent log working
   - Click to Arc Explorer

4. **Deployment** (1 hour)
   - Deploy API to Fly.io (15 min)
   - Deploy Kaiz to Vercel (15 min)
   - Update README with URLs (30 min)

5. **Submit** (30 min)

**Total**: 7.5 hours for MVP submission

---

## Final Checklist Before Submission

- [ ] All code committed to GitHub
- [ ] GitHub repo is public
- [ ] README has all URLs
- [ ] Video is uploaded and public/unlisted
- [ ] Demo app works (tested by someone else)
- [ ] Landing site loads
- [ ] API health check responds
- [ ] Circle feedback section complete
- [ ] Attribution is clear (FORK.md)
- [ ] Submission form filled out
- [ ] Email confirmation received

---

**You've got this! The infrastructure is solid. Now ship the UI and demo. 🚀**
