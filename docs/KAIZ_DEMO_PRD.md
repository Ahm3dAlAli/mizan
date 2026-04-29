# Kaiz Demo App - Product Requirements Document

**Version**: 1.0
**Product**: Kaiz - SME Payroll Application
**Platform**: Web (Next.js 15 + React 19)
**Target**: Hackathon Demo + Production MVP
**Build Time**: 8-12 hours

---

## 1. Product Overview

### 1.1 What is Kaiz?

**Kaiz** is the reference implementation of Mizan's agentic payment infrastructure. It's a Dubai-based SME payroll application that demonstrates how AI agents autonomously handle cross-border freelancer payments.

**Think**: "Gusto meets AI agents, powered by stablecoins"

### 1.2 User Persona

**Name**: Sarah Al-Mansouri
**Role**: Operations Manager at DesignHub Dubai
**Company**: 15-person creative agency
**Pain**: Pays 12 freelancers across 6 countries monthly
- 2 hours copying addresses between Wise/PayPal/banks
- 3-7% fees
- No audit trail when founder asks "what did we pay Pedro last quarter?"

**Kaiz solves**: Upload invoices → AI agents handle everything → Done in 18 seconds

---

## 2. Core Features

### Feature Priority Matrix

| Feature | Priority | Build Time | Demo Impact |
|---------|----------|------------|-------------|
| Dashboard Overview | P0 | 2h | High |
| Invoice Upload | P0 | 2h | High |
| Agent Log Viewer | P0 | 2h | **Critical** |
| Payroll Run Execution | P0 | 2h | **Critical** |
| Team Directory | P1 | 1h | Medium |
| Transaction History | P1 | 2h | High |
| Corridor Analytics | P2 | 1h | Medium |
| Settings | P3 | 30m | Low |

**MVP Scope**: P0 features only (8 hours)

---

## 3. Screen-by-Screen Specifications

### 3.1 Dashboard (`/`)

**Purpose**: At-a-glance payroll status and quick actions

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] Kaiz                    Dubai, UAE    [Sarah] [⚙️]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Dashboard                                                   │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Pending      │  │ This Month   │  │ Active       │      │
│  │ 8 invoices   │  │ $12,450      │  │ 12 freelancers│     │
│  │ $4,200       │  │ 3 runs       │  │ 6 countries  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  Quick Actions                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ [📤 Upload Invoices]  [▶️ Run Payroll]  [👥 Team]   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Recent Activity                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ✅ Payroll Run #PR-042  •  6 recipients  •  $4,230   │   │
│  │    2 hours ago          •  3s settlement              │   │
│  │                                                        │   │
│  │ ⏳ Invoice Upload       •  8 invoices pending         │   │
│  │    1 day ago                                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Components**:
- `<StatsCard>` - Shows key metrics
- `<QuickActions>` - CTA buttons
- `<ActivityFeed>` - Recent events timeline

**Data Sources**:
```typescript
// Fetch from Supabase
const stats = await supabase
  .from('invoices')
  .select('*', { count: 'exact' })
  .eq('status', 'pending');

const thisMonth = await supabase
  .from('payroll_runs')
  .select('total_amount')
  .gte('created_at', startOfMonth)
  .sum('total_amount');
```

---

### 3.2 Invoices Page (`/invoices`)

**Purpose**: Upload, manage, and review invoices

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  Invoices                                      [Upload] [▶️] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 📎 Drag & drop invoices here or click to browse       │ │
│  │                                                        │ │
│  │    Supports: PDF, PNG, JPG                            │ │
│  │    AI will extract: recipient, amount, country        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Pending (8)                                                 │
│  ┌─────────────────────────────────────────────────┬──────┐ │
│  │ Pedro Santos • Philippines        $850  • Mar 15│ [✓]  │ │
│  │ 🇵🇭 UAE → Philippines                           │      │ │
│  ├─────────────────────────────────────────────────┼──────┤ │
│  │ Amaka Obi • Nigeria            $1,200  • Mar 15 │ [✓]  │ │
│  │ 🇳🇬 UAE → Nigeria                               │      │ │
│  ├─────────────────────────────────────────────────┼──────┤ │
│  │ Raj Patel • India              $1,100  • Mar 14 │ [✓]  │ │
│  │ 🇮🇳 UAE → India                                 │      │ │
│  └─────────────────────────────────────────────────┴──────┘ │
│                                                              │
│  [Select All]  [Run Payroll for 3 Selected]                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Key Features**:

1. **Drag & Drop Upload**:
```typescript
const handleUpload = async (files: File[]) => {
  // 1. Upload to Supabase Storage
  const { data: upload } = await supabase.storage
    .from('invoices')
    .upload(`${userId}/${file.name}`, file);

  // 2. Extract data via Classifier Agent (future: Gemini Vision)
  const extracted = {
    recipient: 'Pedro Santos',
    amount: 850,
    country: 'PH',
    email: 'pedro@studio.dev'
  };

  // 3. Create invoice record
  await supabase.from('invoices').insert({
    freelancer_id: freelancer.id,
    amount: extracted.amount,
    file_url: upload.path,
    status: 'pending'
  });
};
```

2. **Multi-Select + Bulk Actions**:
```typescript
const [selected, setSelected] = useState<string[]>([]);

const handleRunPayroll = async () => {
  const invoices = selected.map(id =>
    invoiceList.find(inv => inv.id === id)
  );

  // Call Mizan API
  const result = await fetch(`${MIZAN_API}/api/payroll/run`, {
    method: 'POST',
    body: JSON.stringify({ invoices, rules: 'strict' })
  });

  // Navigate to run details
  router.push(`/payroll/${result.run_id}`);
};
```

**Components**:
- `<InvoiceUpload>` - Drag-drop zone
- `<InvoiceList>` - Table with selection
- `<InvoiceRow>` - Individual invoice card

---

### 3.3 Payroll Run Page (`/payroll/[id]`) - **THE SHOWCASE**

**Purpose**: Real-time agent reasoning display + transaction results

This is the **hero screen** that demonstrates Mizan's agentic infrastructure.

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Invoices                                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Payroll Run #PR-042                      ✅ Completed       │
│  Started: 2:34 PM  •  Duration: 18.2s  •  6 recipients      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Agent Activity (5 agents, 12 actions)                │   │
│  │                                                        │   │
│  │ ✅ SUPERVISOR (2.1s)                                   │   │
│  │    "Analyzed request: 6 invoices, $4,230 total.       │   │
│  │     All invoices valid. Proceeding to classification." │   │
│  │    Tools: []                                           │   │
│  │                                                        │   │
│  │ ✅ CLASSIFIER (3.4s)                                   │   │
│  │    "Classified 6 invoices across 3 corridors:         │   │
│  │     • 2x UAE→Philippines                              │   │
│  │     • 2x UAE→India                                    │   │
│  │     • 1x UAE→Nigeria, 1x UAE→Egypt                    │   │
│  │     All passed validation."                            │   │
│  │    Tools: [corridor_resolver, invoice_validator]      │   │
│  │                                                        │   │
│  │ ✅ TREASURER (2.8s)                                    │   │
│  │    "Balance check: $100,000 available, $4,441 needed  │   │
│  │     (incl 5% buffer). Sufficient. Routing: all direct │   │
│  │     Arc transfers (lowest cost, fastest)."            │   │
│  │    Tools: [arcpay.getBalance, gas_estimator]          │   │
│  │                                                        │   │
│  │ ✅ GATEKEEPER (1.9s)                                   │   │
│  │    "Compliance check: 6 recipients screened. 0 issues.│   │
│  │     All amounts within corridor limits. Cleared."     │   │
│  │    Tools: [sanctions_api, amount_validator]           │   │
│  │                                                        │   │
│  │ ✅ PAYABLES (7.8s)                                     │   │
│  │    "Executed 6 payments. All successful. Average      │   │
│  │     settlement: 2.9s per transaction."                │   │
│  │    Tools: [arcpay.sendUSDC, corridor.pay]             │   │
│  │                                                        │   │
│  │ ✅ SUPERVISOR (0.2s)                                   │   │
│  │    "Payroll complete. 6/6 successful. $4,230 paid     │   │
│  │     across 4 corridors on Arc. All txs confirmed."    │   │
│  │    Tools: []                                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Transactions                                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Pedro Santos  •  $850  •  🇦🇪→🇵🇭  •  Arc  •  2.8s   │   │
│  │ 0xa3f8c2...  ↗                                        │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ Amaka Obi  •  $1,200  •  🇦🇪→🇳🇬  •  Arc  •  3.1s    │   │
│  │ 0x91c4b7...  ↗                                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Key Features**:

1. **Real-Time Agent Log Streaming**:
```typescript
const [agentActions, setAgentActions] = useState<AgentAction[]>([]);

useEffect(() => {
  const subscribe = async () => {
    // Subscribe to Supabase realtime
    const channel = supabase
      .channel('payroll-run')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'agent_actions',
        filter: `payroll_run_id=eq.${runId}`
      }, (payload) => {
        setAgentActions(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  };

  subscribe();
}, [runId]);
```

2. **Agent Action Card**:
```typescript
<AgentActionCard
  agent="CLASSIFIER"
  duration="3.4s"
  status="completed"
  reasoning="Classified 6 invoices across 3 corridors..."
  tools={['corridor_resolver', 'invoice_validator']}
  timestamp="2:34:02 PM"
/>
```

3. **Transaction Cards with Explorer Links**:
```typescript
<TransactionCard
  recipient="Pedro Santos"
  amount={850}
  corridor="uae-to-philippines"
  chain="arc"
  txHash="0xa3f8c2..."
  explorerUrl="https://testnet.arcscan.app/tx/0xa3f8c2..."
  settlementTime={2.8}
  flag="🇵🇭"
/>
```

**Why This Screen Matters**:

This is where judges see:
- ✅ 5 AI agents working autonomously
- ✅ Real reasoning traces (not fake)
- ✅ Tools being called (x402, corridor resolver, sanctions API)
- ✅ Actual on-chain transactions with explorer links
- ✅ Sub-3-second settlements

**This is the "wow" moment.**

---

### 3.4 Team Directory (`/team`)

**Purpose**: Manage freelancer contacts

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  Team                                          [+ Add Member]│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────┬───────────┐ │
│  │ Pedro Santos                               │ 🇵🇭        │ │
│  │ pedro@studio.dev                           │ Philippines│ │
│  │ 0x742d35...                                │ 12 payments│ │
│  │ Preferred: UAE → Philippines               │           │ │
│  ├────────────────────────────────────────────┼───────────┤ │
│  │ Amaka Obi                                  │ 🇳🇬        │ │
│  │ amaka@designs.ng                           │ Nigeria   │ │
│  │ 0x8f3Cf7...                                │ 8 payments │ │
│  │ Preferred: UAE → Nigeria                   │           │ │
│  └────────────────────────────────────────────┴───────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Data**:
```typescript
const { data: team } = await supabase
  .from('freelancers')
  .select(`
    *,
    invoices:invoices(count)
  `)
  .order('name');
```

---

### 3.5 Transaction History (`/history`)

**Purpose**: Searchable transaction archive

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  Transaction History                       [🔍 Search]  [⚙️] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Filters: [All Corridors ▼] [All Months ▼] [All Status ▼]  │
│                                                              │
│  March 2026 • $12,450 • 18 transactions                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Mar 15 • Payroll Run #PR-042                         │   │
│  │ 6 recipients • $4,230 • 18.2s • All successful       │   │
│  │ ├─ Pedro Santos  • $850  • 0xa3f8c2... • 🇵🇭         │   │
│  │ ├─ Amaka Obi     • $1,200 • 0x91c4b7... • 🇳🇬         │   │
│  │ └─ [4 more...]                                        │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ Mar 10 • Payroll Run #PR-041                         │   │
│  │ 8 recipients • $5,100 • 22.4s • All successful       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features**:
- Expandable payroll runs
- Filter by corridor/date/status
- Export to CSV
- Individual tx explorer links

---

## 4. Design System

### 4.1 Color Palette

**Base Colors** (Editorial Financial Terminal):
```css
--ink: #0A0E1A;          /* Background */
--ink-2: #131824;        /* Elevated surfaces */
--ink-3: #1C212E;        /* Cards */

--ivory: #F8F8F6;        /* Primary text */
--ivory-2: #D4D4D0;      /* Secondary text */
--ivory-3: #A8A8A0;      /* Tertiary text */

--lime: #E8FF4A;         /* Primary accent */
--lime-dim: #C4DC3E;     /* Hover state */
--lime-glow: rgba(232, 255, 74, 0.12); /* Backgrounds */

--red: #FF4A4A;          /* Errors */
--green: #4AFF88;        /* Success */
--orange: #FFAA4A;       /* Warnings */
```

**Agent Colors**:
```css
--supervisor: #E8FF4A;   /* Lime */
--classifier: #4AAFFF;   /* Blue */
--treasurer: #FF4AE8;    /* Magenta */
--payables: #4AFFA0;     /* Green */
--gatekeeper: #FFAA4A;   /* Orange */
```

### 4.2 Typography

**Fonts**:
- **Display**: Basel Grotesk (Headings) - Font weight 500
- **Body**: Inter (UI Text) - Font weights 400, 500, 600
- **Mono**: IBM Plex Mono (Code, addresses, hashes)

**Scale**:
```css
--text-xs: 11px;   /* Labels */
--text-sm: 13px;   /* Secondary text */
--text-base: 15px; /* Body */
--text-lg: 17px;   /* Emphasis */
--text-xl: 20px;   /* Card titles */
--text-2xl: 28px;  /* Page headings */
--text-3xl: 36px;  /* Hero */
```

### 4.3 Components

**Base Components** (Tailwind + shadcn/ui):
- `<Button>` - Lime on dark, 12px radius
- `<Card>` - `--ink-3` background, subtle border
- `<Input>` - Minimal, lime focus ring
- `<Badge>` - For status (pending, success, failed)
- `<Tooltip>` - For truncated addresses

**Custom Components**:
- `<AgentActionCard>` - Shows agent reasoning
- `<TransactionCard>` - Shows tx details
- `<CorridorBadge>` - Shows flag + corridor name
- `<LoadingSpinner>` - Lime animated spinner
- `<EmptyState>` - "No invoices yet" states

---

## 5. Technical Stack

### 5.1 Frontend

```json
{
  "framework": "Next.js 15",
  "runtime": "React 19",
  "language": "TypeScript 5.3",
  "styling": "Tailwind CSS 3.4",
  "components": "shadcn/ui",
  "icons": "Lucide React",
  "animation": "Framer Motion",
  "charts": "Recharts (for corridor analytics)"
}
```

### 5.2 Backend Integration

**Mizan API**:
```typescript
// lib/mizan-client.ts
export class MizanClient {
  baseUrl = process.env.NEXT_PUBLIC_MIZAN_API;

  async runPayroll(invoices: Invoice[], rules: string) {
    return fetch(`${this.baseUrl}/api/payroll/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoices, rules })
    });
  }

  async getCorridors() {
    return fetch(`${this.baseUrl}/api/corridors`);
  }
}
```

**Supabase**:
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### 5.3 State Management

**Server Components** (default):
- Dashboard stats
- Invoice list
- Transaction history

**Client Components** (interactive):
- Invoice upload
- Payroll run (realtime)
- Agent log viewer

**React Query** for async state:
```typescript
const { data: invoices } = useQuery({
  queryKey: ['invoices', 'pending'],
  queryFn: async () => {
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('status', 'pending');
    return data;
  }
});
```

---

## 6. File Structure

```
apps/kaiz/
├── app/
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Dashboard
│   ├── invoices/
│   │   └── page.tsx                # Invoice management
│   ├── payroll/
│   │   └── [id]/page.tsx           # Payroll run details
│   ├── team/
│   │   └── page.tsx                # Team directory
│   └── history/
│       └── page.tsx                # Transaction history
│
├── components/
│   ├── ui/                         # shadcn/ui primitives
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── QuickActions.tsx
│   │   └── ActivityFeed.tsx
│   ├── invoices/
│   │   ├── InvoiceUpload.tsx
│   │   ├── InvoiceList.tsx
│   │   └── InvoiceRow.tsx
│   ├── payroll/
│   │   ├── AgentActionCard.tsx    # 🔥 Key component
│   │   ├── AgentTimeline.tsx
│   │   └── TransactionCard.tsx
│   ├── shared/
│   │   ├── CorridorBadge.tsx
│   │   ├── StatusBadge.tsx
│   │   └── AddressDisplay.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Sidebar.tsx
│
├── lib/
│   ├── mizan-client.ts             # Mizan API wrapper
│   ├── supabase.ts                 # Supabase client
│   ├── utils.ts                    # Helpers
│   └── types.ts                    # TypeScript types
│
├── hooks/
│   ├── usePayrollRun.ts            # Payroll run hook
│   ├── useRealtimeAgentLog.ts      # Realtime subscription
│   └── useInvoices.ts              # Invoice management
│
└── public/
    ├── logo.svg
    └── flags/                      # Country flag SVGs
```

---

## 7. Key Interactions

### 7.1 Invoice Upload Flow

```
User drops files
  ↓
Files upload to Supabase Storage
  ↓
Create invoice records (status: pending)
  ↓
(Future) Call Classifier agent for OCR
  ↓
Display in Pending list
```

### 7.2 Payroll Run Flow

```
User selects invoices + clicks "Run Payroll"
  ↓
Call Mizan API /api/payroll/run
  ↓
Get run_id, navigate to /payroll/[id]
  ↓
Subscribe to agent_actions table (Supabase Realtime)
  ↓
Stream agent actions as they happen
  ↓
Display final transactions when complete
```

### 7.3 Realtime Agent Log

```typescript
// hooks/useRealtimeAgentLog.ts
export function useRealtimeAgentLog(runId: string) {
  const [actions, setActions] = useState<AgentAction[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel(`payroll-${runId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'agent_actions',
        filter: `payroll_run_id=eq.${runId}`
      }, (payload) => {
        setActions(prev => [...prev, payload.new as AgentAction]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [runId]);

  return actions;
}
```

---

## 8. Build Phases

### Phase 1: Foundation (2 hours)

- [ ] Next.js project setup
- [ ] Tailwind + shadcn/ui config
- [ ] Supabase client setup
- [ ] Basic layout (header, sidebar)
- [ ] Dashboard page (static)

### Phase 2: Invoice Management (2 hours)

- [ ] Invoice upload component
- [ ] File upload to Supabase Storage
- [ ] Invoice list with Supabase query
- [ ] Multi-select functionality
- [ ] "Run Payroll" button

### Phase 3: Payroll Run (2 hours) - **CRITICAL**

- [ ] Payroll run page
- [ ] Mizan API integration
- [ ] Realtime agent log subscription
- [ ] AgentActionCard component
- [ ] Transaction list

### Phase 4: Polish (2 hours)

- [ ] Team directory
- [ ] Transaction history
- [ ] Loading states
- [ ] Error handling
- [ ] Responsive design

**Total**: 8 hours for MVP

---

## 9. Demo Script

### For Video/Live Demo:

**Duration**: 3 minutes

**Script**:

1. **Dashboard** (15s)
   - "This is Kaiz, a Dubai SME's payroll dashboard"
   - "8 pending invoices, 12 active freelancers across 6 countries"

2. **Invoices** (30s)
   - "Let's upload some invoices" [drag & drop demo files]
   - "AI extracts recipient, amount, country automatically"
   - "Select 6 invoices → Run Payroll"

3. **Payroll Run - Agent Log** (90s) - **THE SHOWCASE**
   - "Watch 5 AI agents work autonomously"
   - [Show each agent appearing in real-time]
   - "Supervisor coordinates → Classifier determines corridors"
   - "Treasurer checks balance → Gatekeeper enforces compliance"
   - "Payables executes all 6 payments in 7.8 seconds"
   - "Every decision logged. Every tool call visible."

4. **Transactions** (30s)
   - "6 payments settled on Arc in under 3 seconds each"
   - [Click tx hash → opens Arc Explorer]
   - "Real on-chain transactions, real USDC"

5. **Closing** (15s)
   - "18 seconds total. $4,230 paid across 4 corridors."
   - "This is agentic payment infrastructure."

---

## 10. Success Metrics

### For Hackathon Judges:

| Metric | Target |
|--------|--------|
| **Agent autonomy visibility** | 5/5 agents shown with reasoning |
| **Real transactions** | Links to Arc Explorer work |
| **Realtime updates** | Agent log streams live |
| **UI polish** | Looks production-ready |
| **Demo smoothness** | No bugs during 3-min demo |

### For Production:

| Metric | Target |
|--------|--------|
| Time to first payroll | < 5 minutes |
| Payroll execution time | < 30 seconds |
| Agent action latency | < 2s per agent |
| UI responsiveness | < 100ms interactions |
| Mobile usability | Fully responsive |

---

## 11. Future Enhancements (Post-Hackathon)

### V2 Features:

- [ ] **Invoice OCR** - Gemini Vision for PDF extraction
- [ ] **Scheduled Payroll** - "Pay every 1st of month"
- [ ] **Approval Workflows** - Multi-sig for large payments
- [ ] **Corridor Analytics** - Charts showing cost/speed by corridor
- [ ] **Bulk Upload** - CSV import for 100+ invoices
- [ ] **Email Notifications** - "Your payment is on the way"
- [ ] **Voice Commands** - "Pay everyone for March"

### V3 Features:

- [ ] **Streaming Payments** - Continuous salary vesting
- [ ] **Escrow Integration** - Milestone-based contracts
- [ ] **Mobile App** - React Native
- [ ] **White-label** - Let other agencies use Kaiz

---

## Conclusion

Kaiz is the **reference implementation** that proves Mizan's infrastructure works. It's not just a UI—it's the proof that AI agents can autonomously handle real SME finance workflows.

**Build the MVP (8 hours) → Record demo (30 min) → Win hackathon.**

The agent log viewer is the killer feature. That's where judges see the magic.
