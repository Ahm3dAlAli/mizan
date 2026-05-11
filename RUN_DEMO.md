# 🚀 Run Kaiz Demo with Real USDC Testnet

## ✅ Quick Start Checklist

- [x] Wallets generated
- [x] Kaiz app running at http://localhost:3000
- [ ] Treasury funded with USDC testnet tokens
- [ ] Demo payroll executed

---

## Step 1: Fund Your Treasury Wallet

**Treasury Address:** `0x564f33570d52f50bde64cbaCe3B133b4D60e5Ad8`

### Option A: Arc Testnet Faucet (FASTEST)
1. Visit: https://faucet.testnet.arc.network
2. Enter: `0x564f33570d52f50bde64cbaCe3B133b4D60e5Ad8`
3. Request USDC (you'll get 100-1000 USDC instantly)

### Option B: Circle Faucet
1. Visit: https://faucet.circle.com
2. Get Sepolia USDC first
3. Bridge to Arc using CCTP

### Verify Balance
Check your balance at:
https://testnet.arcscan.app/address/0x564f33570d52f50bde64cbaCe3B133b4D60e5Ad8

---

## Step 2: Execute Demo Payroll

Once funded (need at least 1 USDC), run:

```bash
npm run demo:payroll
```

This will:
- Send USDC to 3 recipients (Maria, Rajesh, Ahmed)
- Execute real blockchain transactions on Arc Network
- Generate transaction hashes
- Save results to `scripts/payroll-transactions.json`

---

## Step 3: View Results

After running the demo:

1. **View Transactions in App**
   - Open: http://localhost:3000/transactions
   - See all executed transactions with real blockchain hashes

2. **View on Blockchain Explorer**
   - Each transaction will have a link to Arc Explorer
   - Format: `https://testnet.arcscan.app/tx/0x...`

3. **Check Recipient Balances**
   Your recipients:
   - Maria Santos: `0xDA55D6CA70f5A4c533aA77338054D4E4e4d08FC8`
   - Rajesh Kumar: `0x3392C96BE9b245f714a937fEd9e02D89EB0b881F`
   - Ahmed Hassan: `0x7e53142B9FB522b21aAad9A0AcEB79311A56d26f`

---

## 🎬 Quick Demo Flow

### Without Testnet Funding (Mock Mode)
- Visit: http://localhost:3000/demo
- Click "Start Payroll Run"
- Watch AI agents process the batch
- See simulated transactions

### With Testnet Funding (Real Mode)
1. Fund treasury: `0x564f33570d52f50bde64cbaCe3B133b4D60e5Ad8`
2. Run: `npm run demo:payroll`
3. View real transactions: http://localhost:3000/transactions
4. Verify on blockchain: https://testnet.arcscan.app

---

## 📊 Network Details

- **Network:** Arc Testnet
- **Chain ID:** 5042002
- **RPC:** https://rpc.testnet.arc.network
- **Explorer:** https://testnet.arcscan.app
- **USDC Contract:** `0x3600000000000000000000000000000000000000`
- **Gas Token:** USDC (18 decimals)

---

## 🔐 Security Notes

⚠️ **IMPORTANT:**
- `scripts/testnet-wallets.json` contains private keys
- Already added to `.gitignore`
- These are TESTNET wallets only (no real value)
- Never use these keys on mainnet
- Never send real money to these addresses

---

## 🐛 Troubleshooting

### "Insufficient balance" error
- Check treasury balance on Arc Explorer
- Need at least 0.05 USDC per transaction
- Request more from faucet

### "Transaction failed" error
- Network might be slow
- Try again in a few seconds
- Check Arc Network status

### "Cannot find testnet-wallets.json"
- Run: `npm run setup:wallets`
- This regenerates wallet configuration

---

## 📞 Support

- Arc Network: https://discord.gg/arc
- Circle Developers: https://developers.circle.com
- Issues: https://github.com/Himess/arcpay/issues
