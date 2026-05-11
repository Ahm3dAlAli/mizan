# Testnet Wallet Setup for Kaiz Demo

This guide explains how to set up real Arc Testnet wallets with USDC for the Kaiz demo application.

## Overview

The Kaiz demo needs actual testnet wallets to demonstrate real blockchain transactions:
- **Treasury Wallet**: Main wallet that holds USDC for demo payroll
- **Recipient Wallets**: 5 wallets representing freelancers in different countries

## Prerequisites

- Node.js 18+ installed
- Access to Arc Testnet RPC
- Testnet USDC (from faucet or bridge)

## Step-by-Step Setup

### 1. Generate Testnet Wallets

Run the wallet generation script:

```bash
npm run setup:wallets
```

This will:
- Generate a new treasury wallet with a private key
- Generate 5 recipient wallets (Maria, Rajesh, Ahmed, Fatima, Oluwaseun)
- Save wallet addresses and keys to `scripts/testnet-wallets.json`
- Update `.env` with the treasury private key

**Output:**
```
🔧 Setting up testnet wallets for Kaiz demo...

1️⃣  Generating Treasury Wallet...
   Address: 0x1234...5678
   Balance: 0.0 USDC

2️⃣  Generating Recipient Wallets...
   Maria Santos (Philippines)
   Address: 0xabcd...ef01
   Balance: 0.0 USDC

   [... more recipients ...]

3️⃣  Saving wallet configuration...
   ✅ Saved to: scripts/testnet-wallets.json

4️⃣  Updating .env file...
   ✅ Updated PRIVATE_KEY in .env
```

### 2. Fund the Treasury Wallet

You need to add USDC to the treasury wallet. There are several options:

#### Option A: Arc Testnet Faucet (Recommended)

1. Visit https://faucet.testnet.arc.network
2. Enter your treasury address (from step 1)
3. Request testnet USDC (usually 100-1000 USDC per request)

#### Option B: Circle USDC Faucet

1. Visit https://faucet.circle.com
2. Select "Sepolia" network
3. Get Sepolia USDC
4. Bridge to Arc using Circle's CCTP:
   ```bash
   # Use Circle Bridge Kit or manual CCTP bridge
   ```

#### Option C: Manual Transfer

If you already have Arc Testnet USDC:
```bash
# Send USDC to treasury address
0x[YOUR_TREASURY_ADDRESS]

# USDC Contract: 0x3600000000000000000000000000000000000000
```

### 3. Verify Balance

Check that your treasury wallet has USDC:

```bash
# View on Arc Explorer
https://testnet.arcscan.app/address/0x[YOUR_TREASURY_ADDRESS]
```

Or run:
```bash
npm run setup:wallets
```

It will re-check and display current balances.

### 4. Execute Demo Payroll

Once funded, execute real testnet transactions:

```bash
npm run demo:payroll
```

This will:
- Read wallet configuration from `scripts/testnet-wallets.json`
- Check treasury balance
- Send USDC to 3 recipients (Maria, Rajesh, Ahmed)
- Wait for transaction confirmations
- Save transaction hashes to `scripts/payroll-transactions.json`

**Output:**
```
💳 Executing Demo Payroll on Arc Testnet...

1️⃣  Loading wallet configuration...
   Treasury: 0x1234...5678
   Recipients: 5

2️⃣  Checking treasury balance...
   Balance: 100.0 USDC

3️⃣  Executing payroll transactions...

   📤 Transaction 1/3
      To: Maria Santos (0xabcd...ef01)
      Amount: 8500 PHP
      Corridor: UAE → Philippines
      ✅ Sent! Hash: 0x9876...5432
      ⏳ Waiting for confirmation...
      ✅ SETTLED

   [... more transactions ...]

4️⃣  Saving transaction results...
   ✅ Saved to: scripts/payroll-transactions.json

5️⃣  Summary:
   Total Transactions: 3
   Successful: 3
   Failed: 0
```

### 5. Update Kaiz Demo

Copy the generated transaction data to the Kaiz demo:

```typescript
// apps/kaiz/app/demo/page.tsx

const mockPayrollRun = {
  // ... existing code ...
  transactions: [
    {
      id: 'tx_1',
      recipient: 'Maria Santos',
      amount: '8500',
      currency: 'PHP',
      corridor: 'UAE → Philippines',
      status: 'settled',
      txHash: '0x9876...5432', // Real hash from payroll-transactions.json
      timestamp: new Date().toISOString(),
    },
    // ... add real transactions from payroll-transactions.json
  ],
};
```

### 6. Restart Kaiz Demo

```bash
cd apps/kaiz
npm run dev
```

Visit http://localhost:3000/demo and click "Start Payroll Run" to see the demo with real transaction hashes!

## File Structure

```
scripts/
├── setup-testnet-wallets.ts      # Generate wallets
├── execute-demo-payroll.ts       # Execute transactions
├── testnet-wallets.json          # Wallet addresses/keys (KEEP SECURE)
└── payroll-transactions.json     # Transaction results

.env                               # Contains PRIVATE_KEY
.gitignore                         # Should include testnet-wallets.json
```

## Security Notes

⚠️ **IMPORTANT:**

1. **Never commit private keys to git**
   - `testnet-wallets.json` contains private keys
   - Add it to `.gitignore` immediately

2. **These are testnet wallets only**
   - Only use for Arc Testnet (Chain ID: 5042002)
   - Never send real money to these addresses

3. **Regenerate for production**
   - Generate new wallets for any production use
   - Use hardware wallets or secure key management

## Troubleshooting

### "Insufficient balance" error

Make sure treasury wallet is funded:
```bash
# Check balance on explorer
https://testnet.arcscan.app/address/0x[TREASURY_ADDRESS]

# Or run setup script again
npm run setup:wallets
```

### "Transaction failed" error

Common issues:
- **Low balance**: Need at least 0.05 USDC per transaction
- **Network issues**: Arc Testnet RPC might be slow
- **Gas estimation**: Try reducing transaction amount

### "testnet-wallets.json not found"

Run the setup script first:
```bash
npm run setup:wallets
```

## Network Information

- **Network**: Arc Testnet
- **Chain ID**: 5042002
- **RPC**: https://rpc.testnet.arc.network
- **Explorer**: https://testnet.arcscan.app
- **USDC Address**: 0x3600000000000000000000000000000000000000
- **Native Gas**: USDC (18 decimals)

## Alternative: Mock Mode

If you can't access testnet, the Kaiz demo already has mock data:

```typescript
// apps/kaiz/app/demo/page.tsx
// Uses predefined mock transactions with fake hashes
// Still demonstrates the full agent workflow
```

Mock mode is sufficient for demonstrations but doesn't show real blockchain transactions.

## Next Steps

After setting up testnet wallets:

1. ✅ Fund treasury wallet with testnet USDC
2. ✅ Execute demo payroll transactions
3. ✅ Update Kaiz demo with real transaction hashes
4. ✅ Test the full demo flow
5. ✅ Deploy Kaiz to Vercel with testnet integration
6. ✅ Record demo video showing real transactions

## Support

If you encounter issues:
- Check Arc Network status: https://status.arc.network
- Arc Discord: https://discord.gg/arc
- Circle Developer docs: https://developers.circle.com

---

Built for the Stablecoins Commerce Stack Challenge 2026
