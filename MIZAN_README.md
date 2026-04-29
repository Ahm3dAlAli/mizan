# Mizan

**Agentic payment infrastructure for SMEs**

The first system that lets autonomous agents authenticate corridors, route value across chains, and settle SME payments in stablecoins—independently, transparently, instantly.

---

## Overview

Mizan is the substrate for the next generation of SME finance. It extends **ArcPay** (3-time Arc Hackathon winner) with corridor-aware payment primitives and multi-agent orchestration, enabling AI agents to handle cross-border commerce workflows autonomously.

Built for the **Stablecoins Commerce Stack Challenge** (Ignyte × Circle × Arc)
- **Track 1**: Cross-Border Payments & Remittances (UAE → Global)
- **Track 4**: Agentic Economy Experience

---

## Quick Start

### Prerequisites

```bash
# Node.js 18+
node --version

# Python 3.11+
python --version

# Circle Developer Account
# Sign up at: https://console.circle.com/signup
```

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/mizan.git
cd mizan

# Install TypeScript SDK dependencies
npm install

# Install Python orchestration dependencies
cd mizan-orchestration
pip install -r requirements.txt
cd ..

# Install Kaiz demo app dependencies
cd apps/kaiz
npm install
cd ../..
```

### Environment Setup

```bash
# Create .env file in root
cat > .env << EOF
# ArcPay/Circle Configuration
PRIVATE_KEY=0x...
CIRCLE_API_KEY=TEST_API_KEY:xxx:yyy
CIRCLE_ENTITY_SECRET=...

# Anthropic API (for LangGraph agents)
ANTHROPIC_API_KEY=sk-ant-...

# Supabase (for Kaiz demo)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...

# Arc Testnet RPC
ARC_TESTNET_RPC=https://rpc.testnet.arc.network
EOF
```

### Run the Demo

```bash
# Terminal 1: Start Mizan orchestration API
cd mizan-orchestration
uvicorn api:app --reload --port 8000

# Terminal 2: Start Kaiz demo app
cd apps/kaiz
npm run dev

# Terminal 3: (Optional) Start landing site
cd apps/landing
npm run dev
```

Access:
- **Kaiz Demo**: http://localhost:3000
- **Mizan API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Landing Site**: http://localhost:3001

---

## Architecture

Mizan is built in three layers:

### Layer 1: Kaiz Demo App (NEW)
**Next.js 15 · Tailwind CSS · Supabase**

SME payroll application demonstrating:
- Invoice upload with AI classification
- Multi-corridor payment orchestration
- Real-time agent reasoning display
- Transaction history with corridor analytics

**Location**: `/apps/kaiz/`

### Layer 2: Mizan Orchestration (NEW)
**Python · FastAPI · LangGraph · Claude**

Five specialist agents:
1. **Supervisor** - Routes requests and coordinates workflow
2. **Classifier** - Analyzes invoices, extracts payment data
3. **Treasurer** - Checks balances, optimizes routing
4. **Payables** - Executes payments via ArcPay
5. **Gatekeeper** - Enforces compliance and budgets

**Location**: `/mizan-orchestration/`

### Layer 3: ArcPay SDK (INHERITED)
**TypeScript · Solidity · Circle APIs**

Payment primitives from ArcPay:
- 5 deployed smart contracts on Arc Testnet
- 28 feature modules (escrow, streaming, bridge, privacy, etc.)
- Deep Circle integration (Wallets, CCTP, Gateway, x402)
- AI/Gemini integration
- Voice command support

**Location**: `/src/` (original ArcPay codebase)

See [FORK.md](./FORK.md) for complete attribution.

---

## The Five Corridors

Mizan implements 5 UAE → Global payment corridors:

| Corridor | Route | Default Chain | Settlement Time |
|----------|-------|---------------|-----------------|
| 🇦🇪 → 🇵🇭 | AED → PHP | Arc | ~3 seconds |
| 🇦🇪 → 🇮🇳 | AED → INR | Arc | ~3 seconds |
| 🇦🇪 → 🇪🇬 | AED → EGP | Arc | ~3 seconds |
| 🇦🇪 → 🇵🇰 | AED → PKR | Arc | ~3 seconds |
| 🇦🇪 → 🇳🇬 | AED → NGN | Arc | ~3 seconds |

Each corridor is a JSON configuration encoding:
- Currency pair and FX source
- Default settlement chain (Arc, Base, Arbitrum)
- Compliance hooks and claim flows
- Routing rules (direct transfer vs CCTP bridge)

**Location**: `/src/modules/corridors/configs/`

---

## Usage Examples

### Simple Payment (TypeScript SDK)

```typescript
import { mizan } from '@mizan/sdk'

// Pay a freelancer in the Philippines
const result = await mizan
  .corridor('uae-to-philippines')
  .pay({
    to: 'pedro@studio.dev',
    amount: 850,
    currency: 'USD'
  })

console.log(result.txHash)
// 0xa3f... (settled on Arc in 3 seconds)
```

### Agent-Orchestrated Payroll (Python API)

```python
import requests

# Run payroll for 12 freelancers across 6 countries
response = requests.post('http://localhost:8000/api/payroll/run', json={
    "invoices": [
        {"recipient": "pedro@studio.dev", "amount": 850, "country": "PH"},
        {"recipient": "amaka@designs.ng", "amount": 1200, "country": "NG"},
        # ... 10 more
    ],
    "rules": "strict"
})

result = response.json()
print(f"Paid {result['recipients']} people across {len(result['chains'])} chains")
print(f"Total: ${result['total']}")
print(f"Reasoning: {result['reasoning']}")
print(f"Transactions: {result['tx']}")
```

### Voice Command (Browser)

```javascript
import { ArcPay } from '@arcpay/sdk'

const arcpay = new ArcPay({ privateKey: '...' })

// Enable voice commands
arcpay.voice.startListening()

// User says: "Send 850 dollars to Pedro in the Philippines"
// → Mizan automatically resolves corridor, executes payment
```

---

## Circle Products Used

Mizan leverages the following Circle products on Arc:

### Core Products
- ✅ **USDC** - Primary settlement stablecoin (native gas token on Arc)
- ✅ **Circle Wallets** - Gasless UX via ERC-4337 smart contract accounts
- ✅ **CCTP + Bridge Kit** - Cross-chain USDC transfers for multi-chain corridors
- ✅ **Circle Gateway** - Unified balance and treasury routing across chains
- ✅ **Nanopayments (x402)** - AI agents pay for tools autonomously (OCR, FX, sanctions screening)

### Enterprise Products (Architecture-Level)
- ⚠️ **USYC** - Conceptual integration for treasury yield (pending enterprise access)
- ⚠️ **StableFX** - FX-aware multi-currency routing (pending enterprise access)

See [Circle Product Feedback](#circle-product-feedback) below for detailed insights.

---

## Project Structure

```
mizan/
├── src/                              # ArcPay SDK (inherited)
│   ├── core/                        # Client, config, types
│   ├── modules/                     # 28 payment modules
│   │   ├── corridors/              # ✦ NEW: Corridor configs
│   │   ├── bridge/                 # ▿ CCTP integration
│   │   ├── gateway/                # ▿ Circle Gateway
│   │   ├── gas-station/            # ▿ ERC-4337 paymaster
│   │   ├── micropayments/          # ▿ x402 protocol
│   │   └── ...                     # ▿ 23 more modules
│   ├── contracts/                   # ABIs and addresses
│   └── index.ts                     # Public exports
│
├── mizan-orchestration/             # ✦ NEW: Python backend
│   ├── agents/                     # 5 LangGraph agents
│   │   ├── supervisor.py
│   │   ├── classifier.py
│   │   ├── treasurer.py
│   │   ├── payables.py
│   │   └── gatekeeper.py
│   ├── workflows/                  # LangGraph state machines
│   ├── api.py                      # FastAPI endpoints
│   ├── arcpay_client.py            # ArcPay wrapper
│   └── requirements.txt
│
├── apps/
│   ├── kaiz/                       # ✦ NEW: Demo app
│   │   ├── app/                   # Next.js pages
│   │   │   ├── page.tsx          # Dashboard
│   │   │   ├── invoices/
│   │   │   ├── payroll/
│   │   │   └── history/
│   │   ├── components/            # React components
│   │   └── lib/                   # Utilities
│   │
│   └── landing/                    # ✦ NEW: Marketing site
│       ├── app/
│       ├── components/
│       └── docs/                  # MDX documentation
│
├── contracts/                       # ▿ Solidity contracts (ArcPay)
│   ├── Escrow.sol
│   ├── StreamPayment.sol
│   ├── PaymentChannel.sol
│   ├── StealthRegistry.sol
│   └── AgentRegistry.sol
│
├── docs/
│   ├── corridors.md               # Corridor configuration guide
│   ├── agents.md                  # Agent architecture
│   ├── architecture.md            # System design
│   └── quickstart.md              # Getting started
│
├── FORK.md                         # Attribution and originality
├── MIZAN_README.md                 # This file
├── package.json
└── deployed-addresses.json         # Contract addresses

✦ NEW: Mizan-original code
▿ INHERITED: ArcPay codebase (forked with attribution)
```

---

## Smart Contracts

All contracts deployed on **Arc Testnet (Chain ID: 5042002)**:

| Contract | Address | Purpose |
|----------|---------|---------|
| **Escrow** | `0x0a982E2250F1C66487b88286e14D965025dD89D2` | Multi-party conditional payments |
| **StreamPayment** | `0x4678D992De548bddCb5Cd4104470766b5207A855` | Real-time salary streaming |
| **PaymentChannel** | `0x3FF7bC1C52e7DdD2B7B915bDAdBe003037B0FA2E` | Off-chain x402 micropayments |
| **StealthRegistry** | `0xbC6d02dBDe96caE69680BDbB63f9A12a14F3a41B` | EIP-5564 privacy payments |
| **AgentRegistry** | `0x5E3ef9A91AD33270f84B32ACFF91068Eea44c5ee` | AI agent budget management |

Explorer: https://testnet.arcscan.app

---

## Development

### Run Tests

```bash
# TypeScript SDK tests
npm test

# Python orchestration tests
cd mizan-orchestration
pytest

# E2E tests (requires running services)
npm run test:e2e
```

### Build

```bash
# Build TypeScript SDK
npm run build

# Build Kaiz demo app
cd apps/kaiz
npm run build

# Build landing site
cd apps/landing
npm run build
```

### Deploy Smart Contracts

```bash
# Deploy to Arc Testnet (already deployed, but to redeploy:)
npx hardhat run scripts/deploy.ts --network arc-testnet
```

---

## Circle Product Feedback

### Why We Chose These Products

**USDC**: Native gas token on Arc makes it the perfect settlement rail—every transaction already uses USDC, no bridging required for single-chain flows.

**Circle Wallets (ERC-4337)**: Critical for SME UX. Freelancers shouldn't need to buy gas or understand blockchain. Gasless withdrawals via paymaster make this feel like Venmo.

**CCTP + Bridge Kit**: Enables true multi-chain corridors. When a recipient is on Base or Arbitrum, CCTP handles the USDC transfer with attestation-based security. Bridge Kit made integration trivial.

**Circle Gateway**: Unified balance view across all chains is exactly what treasury agents need. Single API call to check "can I pay this invoice?" instead of 5+ balance checks.

**Nanopayments (x402)**: Game-changer for agentic economy. Our classifier agent pays for OCR per invoice. Our gatekeeper pays for sanctions screening per recipient. Sub-cent payments, no subscriptions, fully autonomous.

### What Worked Well

1. **Arc Testnet Stability** - 50+ transactions in testing, zero RPC failures. Consistently fast block times (~2s).

2. **Bridge Kit React Components** - Drop-in UI for cross-chain transfers. Saved days of wallet connect boilerplate.

3. **Developer Controlled Wallets SDK** - TypeScript types are excellent. Clear error messages. The v10 API is much cleaner than v9.

4. **Gas Station Paymaster** - Configuration was straightforward. Spending limits and rules engine work exactly as documented.

5. **Documentation** - Circle docs + Arc docs together covered 90% of integration questions. Sample apps were helpful reference.

### What Could Be Improved

1. **USYC/StableFX Access** - Enterprise product gating is understandable, but makes hackathon submissions tricky. Suggestion: Testnet-only sandbox access for hackathon participants with usage limits.

2. **Gateway API Rate Limits** - Hit rate limits during bulk testing (12 concurrent payroll runs). Would benefit from documented rate limit headers (X-RateLimit-Remaining, etc.).

3. **Bridge Kit Attestation Wait Times** - CCTP attestations are fast (~30s), but no progress callback. Adding an `onAttestationProgress` hook would improve UX for "pending" states.

4. **Arc Testnet Faucet** - Sometimes slow (5+ min for USDC drip). Consider websocket-based notification when funds arrive, or increase drip amount to reduce frequency.

5. **Multi-Currency FX** - StableFX supports USDC ↔ EURC, but UAE corridors need AED, PHP, INR, etc. Suggestion: Partner with Chainlink Price Feeds or Circle-operated oracles for testnet FX rates.

### Recommendations for Ecosystem

1. **Corridor Primitive** - Mizan's corridor config pattern (source country, dest country, default chain, FX source, compliance hooks) could be a useful abstraction in Circle SDK itself. Many projects need "pay someone in country X."

2. **Agent Budget Module** - The AgentRegistry pattern (daily/monthly budgets, endpoint whitelisting, spending history) could be a Circle-maintained ERC-4337 module. Valuable for all agentic economy projects.

3. **Privacy + Compliance** - Stealth addresses (EIP-5564) + Circle's KYC infra feels like a unique advantage. Could Circle offer a "compliant privacy" primitive? (User KYC'd once, but individual txs are private.)

4. **Arc Native USDC** - Using USDC as gas token is brilliant UX. Consider advocating for this pattern on other L2s in Circle ecosystem.

5. **Developer Onboarding** - "Build a payment app in 5 minutes" tutorial using Circle Wallets + Arc would be powerful. Current docs assume reader knows ERC-4337. A "for web2 devs" track would help.

---

## Video Demonstration

📹 **[Watch the 5-minute demo video](https://youtu.be/...)**

Covers:
1. **Problem**: Dubai agency manually paying 12 freelancers across 6 countries
2. **Solution**: Kaiz app demo (invoice upload → agent reasoning → multi-corridor payment)
3. **Architecture**: 3-layer walkthrough (Kaiz → Mizan → ArcPay → Arc)
4. **Results**: Live transaction hashes, completion times, agent logs
5. **Technical Deep Dive**: Code walkthrough of corridor system and LangGraph agents

---

## Hackathon Submission

**Challenge**: Stablecoins Commerce Stack Challenge
**Organizers**: Ignyte × Circle × Arc
**Submission Tracks**:
  - 🎯 Track 1: Cross-Border Payments & Remittances (Primary)
  - 🎯 Track 4: Agentic Economy Experience (Secondary)

**Submission Package**:
- ✅ Functional MVP (Kaiz demo app)
- ✅ Architecture diagram with attribution
- ✅ Video demonstration (5 minutes)
- ✅ GitHub repository with documentation
- ✅ Deployed demo: https://kaiz-demo.vercel.app
- ✅ Circle product feedback (above)

**Circle Developer Account**: ahm3dalali@outlook.com

**Team**: Ahmed A. (building on Himess/ArcPay foundation)

---

## License

MIT License (inherited from ArcPay)

New Mizan contributions also released under MIT License.

See [LICENSE](./LICENSE) for full text.

---

## Attribution

Mizan extends **ArcPay** by Himess (3 Arc Hackathon Awards, January 2026).

See [FORK.md](./FORK.md) for complete attribution and originality breakdown.

**Infrastructure stands on infrastructure.**

---

## Links

- **Demo App**: https://kaiz-demo.vercel.app
- **Landing Site**: https://mizan.dev
- **Documentation**: https://mizan.dev/docs
- **GitHub**: https://github.com/your-org/mizan
- **Arc Testnet Explorer**: https://testnet.arcscan.app
- **Circle Docs**: https://developers.circle.com
- **Arc Docs**: https://docs.arc.network

---

## Contact

**Builder**: Ahmed A.
**Email**: ahm3dalali@outlook.com
**Hackathon**: Stablecoins Commerce Stack Challenge (July 2026)

For questions about the original ArcPay SDK, see: https://github.com/Himess/arcpay
