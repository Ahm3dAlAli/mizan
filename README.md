# Mizan

**Agentic payment infrastructure for cross-border payments powered by Circle and Arc Network**

> Built for the Circle & Arc Network Hackathon

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/ahm3dalali/mizan
cd mizan
npm install
```

### 2. Setup Testnet Wallets
```bash
npm run setup:wallets
```

This generates:
- Treasury wallet for demo transactions
- 5 recipient wallets (Philippines, India, Egypt, Pakistan, Nigeria)
- Saves configuration to `scripts/testnet-wallets.json`

### 3. Get Testnet USDC
Visit the Arc Testnet Faucet and request USDC for your treasury wallet:
- **Faucet:** https://faucet.testnet.arc.network
- **Your Treasury:** Check `scripts/testnet-wallets.json` for address

### 4. Run Kaiz Dashboard
```bash
cd apps/kaiz
npm run dev
```

Access at: **http://localhost:3000**

### 5. Execute Demo Payroll (Optional)
```bash
npm run demo:payroll
```

---

## 📁 Project Structure

```
arcpay-main/
├── apps/
│   ├── kaiz/              # SME payroll dashboard (Next.js)
│   ├── landing/           # Marketing landing page
│   └── website/           # Documentation site
├── contracts/             # Solidity smart contracts
├── docs/                  # Documentation
│   ├── wireframes/        # UI/UX wireframes
│   ├── reports/           # Progress reports
│   ├── JUDGES_GUIDE.md    # Hackathon submission guide
│   ├── PROJECT_SUMMARY.md # High-level overview
│   └── API-REFERENCE.md   # API documentation
├── scripts/               # Utility scripts
│   ├── setup-testnet-wallets.ts
│   └── testnet-wallets.json (generated)
└── RUN_DEMO.md           # Complete demo guide
```

---

## 🎯 What is ArcPay?

ArcPay consists of two main products:

### 1. **Mizan** - Multi-Agent Payment Orchestration
AI-powered payment infrastructure with specialized agents:
- **Supervisor:** Orchestrates the entire workflow
- **Classifier:** Maps invoices to optimal payment corridors
- **Treasurer:** Manages liquidity and routing optimization
- **Gatekeeper:** Enforces compliance and risk rules
- **Payables:** Executes payments on Arc Network

### 2. **Kaiz** - SME Payroll Dashboard
Web application for Dubai SMEs to manage cross-border payroll:
- CSV invoice upload
- Real-time AI agent processing
- Blockchain transaction tracking
- Multi-currency support (PHP, INR, EGP, SAR, NGN)

---

## 🏗️ Architecture

### Tech Stack
- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **Blockchain:** Arc Network Testnet, Circle USDC
- **AI Agents:** LangGraph, Anthropic Claude
- **Smart Contracts:** Solidity, Hardhat
- **Database:** Supabase (optional)

### Payment Flow
```
CSV Upload → AI Classifier → Corridor Routing →
Circle USDC → Arc Network → Settlement (2-3s)
```

---

## 📱 Kaiz Dashboard Pages

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/` | Stats overview, quick actions |
| Invoices | `/invoices` | CSV upload with drag-and-drop |
| Payroll | `/payroll` | Payroll run history with AI details |
| Transactions | `/transactions` | Blockchain transaction explorer |
| Quick Demo | `/demo` | Live AI agent workflow visualization |

---

## 🌐 Networks & APIs

### Arc Testnet
- **Chain ID:** 5042002
- **RPC:** https://rpc.testnet.arc.network
- **Explorer:** https://testnet.arcscan.app
- **Gas Token:** USDC (18 decimals)

### Circle USDC
- **Contract:** `0x3600000000000000000000000000000000000000`
- **Faucet:** https://faucet.testnet.arc.network
- **API Docs:** https://developers.circle.com

---

## 🔑 Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
# Required for blockchain transactions
PRIVATE_KEY=0x...

# Optional: Circle API (for enhanced features)
CIRCLE_API_KEY=TEST_API_KEY:xxx:yyy

# Optional: AI agents (for production)
ANTHROPIC_API_KEY=sk-ant-...

# Arc Network (pre-configured)
ARC_TESTNET_RPC=https://rpc.testnet.arc.network
```

---

## 🎬 Demo Scenarios

### Scenario 1: Visual Demo (No Blockchain)
1. Open http://localhost:3000/demo
2. Click "Start Payroll Run"
3. Watch AI agents process 12 invoices
4. See simulated transactions

### Scenario 2: Real Blockchain Transactions
1. Fund treasury with testnet USDC
2. Run `npm run demo:payroll`
3. View transactions at http://localhost:3000/transactions
4. Verify on Arc Explorer

### Scenario 3: CSV Upload Flow
1. Go to http://localhost:3000/invoices
2. Upload CSV file with recipient data
3. Watch AI agents classify corridors
4. Execute batch payment

---

## 📚 Documentation

- **[RUN_DEMO.md](RUN_DEMO.md)** - Complete demo walkthrough
- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[docs/JUDGES_GUIDE.md](docs/JUDGES_GUIDE.md)** - Hackathon submission
- **[docs/API-REFERENCE.md](docs/API-REFERENCE.md)** - API documentation
- **[docs/MIZAN_ARCHITECTURE.md](docs/MIZAN_ARCHITECTURE.md)** - System architecture

---

## 🧪 Available Scripts

```bash
# Wallet Setup
npm run setup:wallets          # Generate testnet wallets

# Development
npm run dev                    # Start all apps
cd apps/kaiz && npm run dev   # Start Kaiz only

# Demo
npm run demo:payroll          # Execute real transactions

# Smart Contracts
npm run compile               # Compile contracts
npm run test                  # Run contract tests
npm run deploy:testnet        # Deploy to Arc Testnet
```

---

## 🔐 Security

⚠️ **Important Security Notes:**
- `scripts/testnet-wallets.json` contains private keys (already gitignored)
- `.env` file contains API keys (already gitignored)
- Never commit private keys or secrets
- Testnet wallets only - no real value
- Never use testnet keys on mainnet

---

## 🛠️ Troubleshooting

### "Insufficient balance" error
Get more USDC from: https://faucet.testnet.arc.network

### Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Cannot find testnet-wallets.json
```bash
npm run setup:wallets
```

### Transaction failed
- Check Arc Network status
- Verify treasury has USDC balance
- Try again in a few seconds

---

## 🤝 Contributing

This is a hackathon project. For questions or issues:
1. Check [docs/JUDGES_GUIDE.md](docs/JUDGES_GUIDE.md)
2. Review [RUN_DEMO.md](RUN_DEMO.md)
3. Open an issue on GitHub

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 🏆 Hackathon Details

**Event:** Circle & Arc Network Hackathon  
**Track:** Cross-Border Payments  
**Team:** ArcPay  
**Demo:** http://localhost:3000

**Key Features:**
- ✅ Multi-agent AI orchestration with LangGraph
- ✅ Real blockchain transactions on Arc Network
- ✅ Circle USDC integration
- ✅ Sub-3-second settlement times
- ✅ Multi-currency support (5+ corridors)
- ✅ Production-ready UI/UX

---

## 🔗 Links

- **Arc Network:** https://arc.network
- **Circle:** https://circle.com
- **Documentation:** [docs/](docs/)
- **Demo Guide:** [RUN_DEMO.md](RUN_DEMO.md)

---

**Built with ❤️ using Circle USDC and Arc Network**
