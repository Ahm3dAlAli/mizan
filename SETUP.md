# Mizan Setup Guide

Complete setup instructions for running Mizan locally and deploying to production.

---

## Prerequisites

### Required Software

```bash
# Node.js 18+ and npm
node --version  # Should be v18.0.0 or higher
npm --version

# Python 3.11+
python3 --version  # Should be 3.11 or higher
pip3 --version

# Git
git --version
```

### Required Accounts

1. **Circle Developer Account**
   - Sign up: https://console.circle.com/signup
   - Get API Key: https://console.circle.com/settings/keys
   - Get test USDC: https://faucet.circle.com

2. **Anthropic Account** (for Claude API)
   - Sign up: https://console.anthropic.com
   - Get API Key: https://console.anthropic.com/settings/keys

3. **Supabase Account** (for Kaiz demo database)
   - Sign up: https://supabase.com
   - Create new project
   - Copy connection details

4. **Wallet with Arc Testnet Funds**
   - Use MetaMask or any EVM wallet
   - Add Arc Testnet network
   - Get test USDC from Circle faucet

---

## Quick Start (5 Minutes)

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/mizan.git
cd mizan

# Install TypeScript SDK dependencies
npm install

# Install Python backend dependencies
cd mizan-orchestration
pip3 install -r requirements.txt
cd ..
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your actual credentials
nano .env  # or use your preferred editor
```

**Minimum required variables:**
```env
PRIVATE_KEY=0x...
CIRCLE_API_KEY=TEST_API_KEY:...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 3. Run Services

Open 2 terminal windows:

**Terminal 1 - Mizan API:**
```bash
cd mizan-orchestration
uvicorn api:app --reload --port 8000
```

**Terminal 2 - Test API:**
```bash
curl http://localhost:8000/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "anthropic_configured": true
}
```

---

## Detailed Setup

### Step 1: Environment Variables

Edit `.env` with all required values:

```env
# ==========================================
# Required: Circle & Arc
# ==========================================
PRIVATE_KEY=0x<your-private-key>
CIRCLE_API_KEY=TEST_API_KEY:<your-circle-key>
ARC_TESTNET_RPC=https://rpc.testnet.arc.network

# ==========================================
# Required: AI Agent (Anthropic Claude)
# ==========================================
ANTHROPIC_API_KEY=sk-ant-<your-anthropic-key>

# ==========================================
# Required: Database (Supabase)
# ==========================================
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_KEY=<your-service-role-key>

# ==========================================
# Optional: Enterprise Products
# ==========================================
# If you have access to USYC or StableFX:
# USYC_API_KEY=...
# STABLEFX_API_KEY=...
```

### Step 2: Database Setup (Supabase)

1. **Create Supabase Project**
   ```
   Visit: https://app.supabase.com
   Click: "New Project"
   Name: mizan-demo
   Region: Choose closest to you
   Database Password: Generate strong password
   ```

2. **Run Schema Migration**
   ```bash
   # Copy the SQL schema
   cat supabase/schema.sql

   # In Supabase Dashboard:
   # SQL Editor → New Query → Paste schema → Run
   ```

3. **Verify Tables Created**
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public';
   ```

   Should show:
   - freelancers
   - invoices
   - payroll_runs
   - agent_actions
   - transactions
   - corridor_stats

### Step 3: Get Test Funds (Arc Testnet)

1. **Add Arc Testnet to MetaMask**
   ```
   Network Name: Arc Testnet
   RPC URL: https://rpc.testnet.arc.network
   Chain ID: 5042002
   Currency Symbol: USDC
   Block Explorer: https://testnet.arcscan.app
   ```

2. **Get Test USDC**
   ```
   Visit: https://faucet.circle.com
   Connect your wallet
   Request test USDC
   Wait ~1 minute for tokens
   ```

3. **Verify Balance**
   ```bash
   # Using TypeScript SDK
   node -e "
   const { ArcPay } = require('./dist/index.js');
   const arcpay = new ArcPay({ privateKey: process.env.PRIVATE_KEY });
   arcpay.getBalance(process.env.WALLET_ADDRESS).then(console.log);
   "
   ```

### Step 4: Test Corridor System

```typescript
// test-corridor.ts
import { Mizan } from './src/mizan';

async function testCorridor() {
  const mizan = new Mizan({
    privateKey: process.env.PRIVATE_KEY!,
    circleApiKey: process.env.CIRCLE_API_KEY,
    apiEndpoint: 'http://localhost:8000'
  });

  // Get all corridors
  const corridors = mizan.getAllCorridors();
  console.log('Available corridors:', corridors.length);

  // Test corridor info
  const uaeToPhilippines = mizan.corridor('uae-to-philippines').getInfo();
  console.log('UAE → Philippines:', uaeToPhilippines);

  console.log('✅ Corridor system working!');
}

testCorridor();
```

Run:
```bash
npx ts-node test-corridor.ts
```

### Step 5: Test Agent Orchestration

```bash
# Start Mizan API (if not running)
cd mizan-orchestration
uvicorn api:app --reload --port 8000
```

**Test with curl:**
```bash
curl -X POST http://localhost:8000/api/payroll/run \
  -H "Content-Type: application/json" \
  -d '{
    "invoices": [
      {
        "recipient": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
        "amount": 850,
        "country": "PH",
        "email": "pedro@studio.dev"
      },
      {
        "recipient": "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        "amount": 1200,
        "country": "NG",
        "email": "amaka@designs.ng"
      }
    ],
    "rules": "strict",
    "dry_run": true
  }'
```

**Expected response:**
```json
{
  "run_id": "pr_1714502400",
  "total": 2050.0,
  "recipients": 2,
  "corridors": ["uae-to-philippines", "uae-to-nigeria"],
  "chains": ["arc"],
  "reasoning": "Processed 2 invoices across 2 corridors...",
  "agent_actions": [...],
  "transactions": [...],
  "success": true
}
```

If you see this, agents are working! ✅

---

## Running the Full Stack

### Option A: Development Mode (3 Terminals)

**Terminal 1 - Mizan API:**
```bash
cd mizan-orchestration
uvicorn api:app --reload --port 8000
```

**Terminal 2 - Kaiz Demo App (when built):**
```bash
cd apps/kaiz
npm run dev
```

**Terminal 3 - Landing Site (when built):**
```bash
cd apps/landing
npm run dev
```

### Option B: Production Mode (Docker)

```bash
# Build and run all services
docker-compose up -d

# Check logs
docker-compose logs -f mizan-api
docker-compose logs -f kaiz-app

# Stop all
docker-compose down
```

---

## Deployment

### Deploy Mizan API (Python FastAPI)

**Option 1: Fly.io**
```bash
# Install fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Deploy
cd mizan-orchestration
fly launch
fly deploy

# Set secrets
fly secrets set ANTHROPIC_API_KEY=sk-ant-...
fly secrets set CIRCLE_API_KEY=TEST_API_KEY:...
```

**Option 2: Railway**
```bash
# Install railway CLI
npm install -g @railway/cli

# Login and init
railway login
railway init

# Deploy
cd mizan-orchestration
railway up

# Set environment variables in Railway dashboard
```

### Deploy Kaiz Demo (Next.js)

**Vercel (Recommended):**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd apps/kaiz
vercel

# Production deployment
vercel --prod

# Set environment variables in Vercel dashboard
```

### Deploy Landing Site

```bash
cd apps/landing
vercel --prod
```

---

## Troubleshooting

### Issue: "ANTHROPIC_API_KEY not set"

**Solution:**
```bash
# Verify .env file exists
cat .env | grep ANTHROPIC

# If missing, add it
echo "ANTHROPIC_API_KEY=sk-ant-your-key" >> .env

# Restart API
cd mizan-orchestration
uvicorn api:app --reload
```

### Issue: "Corridor not found"

**Solution:**
Check corridor ID is correct:
```typescript
// Valid corridor IDs:
'uae-to-philippines'
'uae-to-india'
'uae-to-egypt'
'uae-to-pakistan'
'uae-to-nigeria'
```

### Issue: "Insufficient balance"

**Solution:**
```bash
# Get more test USDC from faucet
https://faucet.circle.com

# Or reduce invoice amounts in test
```

### Issue: "Supabase connection failed"

**Solution:**
```bash
# Verify Supabase URL and keys
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Test connection
curl $NEXT_PUBLIC_SUPABASE_URL/rest/v1/freelancers \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY"
```

### Issue: Python dependencies fail to install

**Solution:**
```bash
# Use virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r mizan-orchestration/requirements.txt
```

---

## Testing

### Manual Testing Checklist

- [ ] Corridor system loads 5 corridors
- [ ] Mizan API /health endpoint returns healthy
- [ ] Agent workflow processes 2-invoice payroll
- [ ] Dry run mode works (no actual transactions)
- [ ] Real payment executes on Arc testnet
- [ ] Supabase tables populated correctly
- [ ] Transaction hash visible on Arc Explorer

### Automated Tests (When Implemented)

```bash
# TypeScript tests
npm test

# Python tests
cd mizan-orchestration
pytest

# E2E tests
npm run test:e2e
```

---

## Development Workflow

### Making Changes to Corridors

1. Edit corridor config: `src/modules/corridors/configs/`
2. Restart TypeScript build: `npm run build`
3. Test in API: Use curl or Postman

### Making Changes to Agents

1. Edit agent file: `mizan-orchestration/agents/`
2. Restart API: Uvicorn auto-reloads in dev mode
3. Test with dry run payroll request

### Adding New Corridors

```typescript
// src/modules/corridors/configs/uae-to-new-country.ts
export const uaeToNewCountryCorridor: Corridor = {
  id: 'uae-to-new-country',
  name: 'UAE → New Country',
  source: { code: 'AE', name: 'UAE', currency: 'AED' },
  destination: { code: 'XX', name: 'New Country', currency: 'XXX' },
  // ... rest of config
};

// Add to src/modules/corridors/configs/index.ts
export { uaeToNewCountryCorridor } from './uae-to-new-country';
```

---

## Security Notes

### Production Checklist

- [ ] **Never commit `.env` file** (it's in `.gitignore`)
- [ ] Use environment variables for all secrets
- [ ] Enable Supabase RLS policies for production
- [ ] Use API rate limiting (add to FastAPI)
- [ ] Enable CORS only for specific domains
- [ ] Use HTTPS for all API endpoints
- [ ] Rotate API keys regularly
- [ ] Use separate Circle API keys for prod/test

### Private Key Safety

```bash
# Generate new wallet for testing
# Don't use your personal wallet!

# Example: Generate with MetaMask
# Or use this Node.js script:
node -e "console.log(require('ethers').Wallet.createRandom().privateKey)"
```

---

## Support & Resources

### Documentation
- Circle Docs: https://developers.circle.com
- Arc Docs: https://docs.arc.network
- Anthropic Docs: https://docs.anthropic.com
- Supabase Docs: https://supabase.com/docs

### Community
- Circle Discord: https://discord.gg/circlebuild
- Arc Community: https://arc.network/community

### Troubleshooting
- Check [COMPLETION_TRACKER.md](./COMPLETION_TRACKER.md) for known issues
- File issues: https://github.com/your-org/mizan/issues

---

**Ready to run Mizan? Start with the Quick Start section above! 🚀**
