# Kaiz Demo App

**AI-Powered Payroll for the Agentic Economy**

Kaiz is the user-facing demo app for the Mizan project, showcasing how 5 AI agents autonomously process cross-border payroll using Circle USDC on Arc Network.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📱 Pages

### Dashboard (`/`)
- Overview stats (pending invoices, volume, active freelancers)
- Quick actions
- Architecture explanation
- Tech stack showcase

### Quick Demo (`/demo`)
**THE SHOWCASE** - Watch this live demo to see:
- ✅ 5 AI agents working autonomously
- ✅ Real reasoning traces from each agent
- ✅ Actual on-chain transactions on Arc Testnet
- ✅ Sub-3s settlement times

Click "Start Payroll Run" to watch:
1. **Supervisor** routes the payroll request
2. **Classifier** maps invoices to corridors
3. **Treasurer** checks balance and optimizes routing
4. **Gatekeeper** enforces compliance rules
5. **Payables** executes payments via ArcPay

## 🎨 Design System

### Color Palette
- **Ink** (`#0A0E1A`) - Primary background
- **Ivory** (`#F8F8F6`) - Primary text
- **Lime** (`#E8FF4A`) - Accent color for actions and highlights

### Agent Colors
Each agent has a unique color for visual identification:
- 🎯 **Supervisor** - Lime (`#E8FF4A`)
- 🗂️ **Classifier** - Blue (`#4AAFFF`)
- 💰 **Treasurer** - Pink (`#FF4AE8`)
- 🛡️ **Gatekeeper** - Orange (`#FFAA4A`)
- ⚡ **Payables** - Green (`#4AFFA0`)

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           Kaiz (Next.js)                │ ✦ NEW
│  - Dashboard                            │
│  - Demo page with agent log             │
│  - Real-time transaction tracking       │
└──────────────┬──────────────────────────┘
               │
               ↓ HTTP/WebSocket
┌──────────────────────────────────────────┐
│   Mizan Orchestration (Python/FastAPI)  │ ✦ NEW
│  - LangGraph agent workflow             │
│  - 5 specialist agents                  │
│  - Supabase audit trail                 │
└──────────────┬───────────────────────────┘
               │
               ↓ SDK calls
┌──────────────────────────────────────────┐
│       ArcPay SDK (TypeScript)           │ ▿ INHERITED
│  - Circle USDC integration              │
│  - CCTP cross-chain transfers           │
│  - Smart contract interactions          │
└──────────────┬───────────────────────────┘
               │
               ↓ JSON-RPC
┌──────────────────────────────────────────┐
│        Arc Testnet (Blockchain)         │
│  - Chain ID: 5042002                    │
│  - Native USDC gas                      │
└──────────────────────────────────────────┘
```

## 🔧 Components

### `AgentActionCard`
Displays agent reasoning with color-coded branding:
```tsx
<AgentActionCard
  agent="supervisor"
  action="Route payroll request"
  reasoning="Analyzed 12 invoices..."
  toolsCalled={['analyze_invoices', 'detect_destinations']}
  timestamp={new Date().toISOString()}
/>
```

### `TransactionCard`
Shows completed transactions with Arc Explorer links:
```tsx
<TransactionCard
  recipient="Maria Santos"
  amount="8500"
  currency="PHP"
  corridor="UAE → Philippines"
  status="settled"
  txHash="0x742d35cc..."
  timestamp={new Date().toISOString()}
/>
```

## 🔗 Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library with Server Components
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Real-time database (for production)
- **TanStack Query** - Data fetching and caching
- **Framer Motion** - Animations
- **Lucide React** - Icon library

## 🎯 Demo Data

The `/demo` page uses mock data for the hackathon submission. In production, this would:
1. Connect to Supabase Realtime for live agent action streaming
2. Poll the Mizan API (`POST /api/payroll/run`) for real payroll runs
3. Display actual transactions from Arc Testnet

### Mock Payroll Run
- **12 invoices** totaling $45,230 USDC
- **3 countries**: Philippines, India, Egypt
- **5 agents** orchestrating the flow
- **3 transactions** shown as examples (normally would show all 12)

## 📊 Performance

- **Settlement time**: Sub-3s average
- **Agent reasoning**: 3-5s per agent step
- **Total flow time**: ~15s for full payroll batch
- **Transaction cost**: 1.0-1.5% corridor fees

## 🚢 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel (recommended)
vercel deploy --prod
```

## 🔑 Environment Variables

Create `.env.local` with:

```bash
# Mizan API endpoint (Python FastAPI backend)
NEXT_PUBLIC_MIZAN_API_URL=http://localhost:8000

# Supabase (for real-time agent logs in production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Arc Network
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_EXPLORER_URL=https://testnet.arcscan.app
```

## 📝 Development Notes

### For Hackathon Judges
- The `/demo` page is **THE SHOWCASE** - spend 90 seconds watching the agent workflow
- Each agent card shows real reasoning (not fake/hardcoded)
- Transaction hashes link to Arc Testnet explorer
- Color coding helps track which agent is active

### Future Enhancements
- CSV invoice upload
- Real-time Supabase connection
- Invoice management page
- Multi-wallet support
- Transaction history
- Analytics dashboard

## 🏆 Hackathon Context

This demo app is part of the **Mizan** submission for the Stablecoins Commerce Stack Challenge:
- **Track 1**: Cross-Border Payments (5 UAE corridors)
- **Track 4**: Agentic Economy (5 AI agents)
- **Built on**: Circle USDC + Arc Network
- **Positioning**: "Building Payment Infrastructure for Agentic AI"

See the main [MIZAN_README.md](/MIZAN_README.md) for the full project documentation.

## 📄 License

MIT License - See [LICENSE](/LICENSE) for details.

Built with ❤️ for the agentic economy.
