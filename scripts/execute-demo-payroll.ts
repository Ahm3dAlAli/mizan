/**
 * Execute Demo Payroll on Arc Testnet
 *
 * This script executes REAL testnet transactions for the Kaiz demo:
 * 1. Reads wallet configuration
 * 2. Connects to Arc Testnet
 * 3. Executes USDC transfers to recipients
 * 4. Logs transaction hashes for demo
 */

import {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  formatEther,
  encodeFunctionData,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Arc Testnet configuration
const arcTestnet = {
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
  },
  blockExplorers: {
    default: { name: 'Arc Explorer', url: 'https://testnet.arcscan.app' },
  },
};

// USDC contract address on Arc Testnet
const USDC_ADDRESS = '0x3600000000000000000000000000000000000000';

// ERC20 Transfer ABI
const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
] as const;

interface PayrollTransaction {
  recipient: string;
  name: string;
  amount: string; // in USDC
  currency: string;
  corridor: string;
  txHash?: string;
  status?: 'pending' | 'settled' | 'failed';
  timestamp?: string;
}

async function main() {
  console.log('💳 Executing Demo Payroll on Arc Testnet...\n');

  // 1. Load wallet configuration
  console.log('1️⃣  Loading wallet configuration...');
  const configPath = join(process.cwd(), 'scripts', 'testnet-wallets.json');

  let config: any;
  try {
    config = JSON.parse(readFileSync(configPath, 'utf-8'));
  } catch (error) {
    console.error('❌ testnet-wallets.json not found. Run setup-testnet-wallets.ts first.');
    process.exit(1);
  }

  const treasuryWallet = config.wallets[0];
  const recipients = config.wallets.slice(1);

  console.log(`   Treasury: ${treasuryWallet.address}`);
  console.log(`   Recipients: ${recipients.length}\n`);

  // 2. Setup clients
  const publicClient = createPublicClient({
    chain: arcTestnet,
    transport: http(),
  });

  const treasuryAccount = privateKeyToAccount(treasuryWallet.privateKey as `0x${string}`);

  const walletClient = createWalletClient({
    account: treasuryAccount,
    chain: arcTestnet,
    transport: http(),
  });

  // 3. Check treasury balance
  console.log('2️⃣  Checking treasury balance...');
  const balance = await publicClient.readContract({
    address: USDC_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [treasuryAccount.address],
  });

  const balanceUSDC = formatEther(balance);
  console.log(`   Balance: ${balanceUSDC} USDC\n`);

  if (parseFloat(balanceUSDC) < 100) {
    console.warn('⚠️  Warning: Treasury balance is low. Fund the wallet first.');
    console.log(`   Address: ${treasuryAccount.address}`);
    console.log(`   Faucet: https://faucet.testnet.arc.network\n`);
  }

  // 4. Define payroll transactions
  const payrollTransactions: PayrollTransaction[] = [
    {
      recipient: recipients[0].address,
      name: 'Maria Santos',
      amount: '8500',
      currency: 'PHP',
      corridor: 'UAE → Philippines',
    },
    {
      recipient: recipients[1].address,
      name: 'Rajesh Kumar',
      amount: '12000',
      currency: 'INR',
      corridor: 'UAE → India',
    },
    {
      recipient: recipients[2].address,
      name: 'Ahmed Hassan',
      amount: '6500',
      currency: 'EGP',
      corridor: 'UAE → Egypt',
    },
  ];

  // 5. Execute transactions
  console.log('3️⃣  Executing payroll transactions...\n');

  const results: PayrollTransaction[] = [];

  for (const [index, tx] of payrollTransactions.entries()) {
    console.log(`   📤 Transaction ${index + 1}/${payrollTransactions.length}`);
    console.log(`      To: ${tx.name} (${tx.recipient})`);
    console.log(`      Amount: ${tx.amount} ${tx.currency}`);
    console.log(`      Corridor: ${tx.corridor}`);

    try {
      // For demo purposes, send a small amount of USDC (0.01 USDC)
      const amountInUSDC = parseEther('0.01'); // Adjust based on your testnet balance

      // Encode transfer data
      const transferData = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [tx.recipient as `0x${string}`, amountInUSDC],
      });

      // Send transaction
      const hash = await walletClient.sendTransaction({
        to: USDC_ADDRESS as `0x${string}`,
        data: transferData,
      });

      console.log(`      ✅ Sent! Hash: ${hash}`);

      // Wait for confirmation
      console.log(`      ⏳ Waiting for confirmation...`);
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
        timeout: 60000,
      });

      const status = receipt.status === 'success' ? 'settled' : 'failed';
      console.log(`      ${status === 'settled' ? '✅' : '❌'} ${status.toUpperCase()}\n`);

      results.push({
        ...tx,
        txHash: hash,
        status: status as 'settled' | 'failed',
        timestamp: new Date().toISOString(),
      });

      // Wait 2 seconds between transactions
      if (index < payrollTransactions.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`      ❌ Failed:`, error instanceof Error ? error.message : error);
      results.push({
        ...tx,
        status: 'failed',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // 6. Save transaction results
  console.log('4️⃣  Saving transaction results...');

  const resultsPath = join(process.cwd(), 'scripts', 'payroll-transactions.json');
  writeFileSync(
    resultsPath,
    JSON.stringify(
      {
        executedAt: new Date().toISOString(),
        network: arcTestnet.name,
        chainId: arcTestnet.id,
        treasury: treasuryWallet.address,
        transactions: results,
      },
      null,
      2
    )
  );

  console.log(`   ✅ Saved to: ${resultsPath}\n`);

  // 7. Print summary
  console.log('5️⃣  Summary:\n');

  const successful = results.filter(r => r.status === 'settled').length;
  const failed = results.filter(r => r.status === 'failed').length;

  console.log(`   Total Transactions: ${results.length}`);
  console.log(`   Successful: ${successful}`);
  console.log(`   Failed: ${failed}\n`);

  // 8. Generate code for Kaiz demo
  console.log('6️⃣  Update Kaiz Demo:\n');
  console.log('```typescript');
  console.log('// Add these transactions to apps/kaiz/app/demo/page.tsx');
  console.log('const transactions = [');
  results.forEach((tx, i) => {
    console.log('  {');
    console.log(`    id: 'tx_${i + 1}',`);
    console.log(`    recipient: '${tx.name}',`);
    console.log(`    amount: '${tx.amount}',`);
    console.log(`    currency: '${tx.currency}',`);
    console.log(`    corridor: '${tx.corridor}',`);
    console.log(`    status: '${tx.status}',`);
    console.log(`    txHash: '${tx.txHash || '0x...'}',`);
    console.log(`    timestamp: new Date('${tx.timestamp}').toISOString(),`);
    console.log('  },');
  });
  console.log('];');
  console.log('```\n');

  // 9. Print explorer links
  console.log('7️⃣  View on Explorer:\n');
  results.forEach((tx, i) => {
    if (tx.txHash) {
      console.log(`   ${i + 1}. ${tx.name}:`);
      console.log(`      ${arcTestnet.blockExplorers.default.url}/tx/${tx.txHash}`);
    }
  });

  console.log('\n✅ Payroll execution complete!\n');
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
