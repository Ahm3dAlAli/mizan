/**
 * Setup Testnet Wallets for Kaiz Demo
 *
 * This script creates real testnet wallets and prepares them for the demo:
 * 1. Generates main treasury wallet
 * 2. Generates recipient wallets for demo transactions
 * 3. Connects to Arc Testnet
 * 4. Outputs wallet addresses and private keys
 */

import { createWalletClient, createPublicClient, http, parseEther, formatEther } from 'viem';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
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

interface WalletInfo {
  name: string;
  address: string;
  privateKey: string;
  balance?: string;
}

async function main() {
  console.log('🔧 Setting up testnet wallets for Kaiz demo...\n');

  // Create public client for reading blockchain data
  const publicClient = createPublicClient({
    chain: arcTestnet,
    transport: http(),
  });

  const wallets: WalletInfo[] = [];

  // 1. Generate Treasury Wallet
  console.log('1️⃣  Generating Treasury Wallet...');
  const treasuryKey = generatePrivateKey();
  const treasuryAccount = privateKeyToAccount(treasuryKey);

  const treasuryWallet: WalletInfo = {
    name: 'Treasury (Main Demo Wallet)',
    address: treasuryAccount.address,
    privateKey: treasuryKey,
  };

  try {
    const balance = await publicClient.getBalance({ address: treasuryAccount.address });
    treasuryWallet.balance = formatEther(balance);
  } catch (error) {
    treasuryWallet.balance = '0.0';
  }

  wallets.push(treasuryWallet);
  console.log(`   Address: ${treasuryWallet.address}`);
  console.log(`   Balance: ${treasuryWallet.balance} USDC\n`);

  // 2. Generate Recipient Wallets for Demo Transactions
  const recipients = [
    'Maria Santos (Philippines)',
    'Rajesh Kumar (India)',
    'Ahmed Hassan (Egypt)',
    'Fatima Khan (Pakistan)',
    'Oluwaseun Adeyemi (Nigeria)',
  ];

  console.log('2️⃣  Generating Recipient Wallets...');

  for (const recipient of recipients) {
    const key = generatePrivateKey();
    const account = privateKeyToAccount(key);

    const wallet: WalletInfo = {
      name: recipient,
      address: account.address,
      privateKey: key,
    };

    try {
      const balance = await publicClient.getBalance({ address: account.address });
      wallet.balance = formatEther(balance);
    } catch (error) {
      wallet.balance = '0.0';
    }

    wallets.push(wallet);
    console.log(`   ${recipient}`);
    console.log(`   Address: ${wallet.address}`);
    console.log(`   Balance: ${wallet.balance} USDC\n`);
  }

  // 3. Save wallet configuration
  console.log('3️⃣  Saving wallet configuration...');

  const config = {
    network: 'Arc Testnet',
    chainId: arcTestnet.id,
    rpc: arcTestnet.rpcUrls.default.http[0],
    explorer: arcTestnet.blockExplorers.default.url,
    usdcAddress: USDC_ADDRESS,
    generatedAt: new Date().toISOString(),
    wallets: wallets.map(w => ({
      name: w.name,
      address: w.address,
      privateKey: w.privateKey,
      balance: w.balance,
    })),
  };

  const configPath = join(process.cwd(), 'scripts', 'testnet-wallets.json');
  writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`   ✅ Saved to: ${configPath}\n`);

  // 4. Update .env file
  console.log('4️⃣  Updating .env file...');

  const envPath = join(process.cwd(), '.env');
  let envContent = '';

  try {
    envContent = readFileSync(envPath, 'utf-8');
  } catch {
    // File doesn't exist, create new
  }

  // Update or add PRIVATE_KEY
  if (envContent.includes('PRIVATE_KEY=')) {
    envContent = envContent.replace(
      /PRIVATE_KEY=.*/,
      `PRIVATE_KEY=${treasuryWallet.privateKey}`
    );
  } else {
    envContent += `\nPRIVATE_KEY=${treasuryWallet.privateKey}\n`;
  }

  writeFileSync(envPath, envContent);
  console.log(`   ✅ Updated PRIVATE_KEY in .env\n`);

  // 5. Print funding instructions
  console.log('5️⃣  Next Steps:\n');
  console.log('   📍 Fund the Treasury Wallet with USDC:');
  console.log(`      Address: ${treasuryWallet.address}`);
  console.log(`      Network: Arc Testnet (Chain ID: ${arcTestnet.id})`);
  console.log(`      Token: USDC at ${USDC_ADDRESS}\n`);

  console.log('   💰 Funding Options:');
  console.log('      1. Arc Testnet Faucet: https://faucet.testnet.arc.network');
  console.log('      2. Circle Testnet USDC: https://faucet.circle.com');
  console.log('      3. Bridge from Sepolia using CCTP\n');

  console.log('   🔗 Check balances:');
  console.log(`      ${arcTestnet.blockExplorers.default.url}/address/${treasuryWallet.address}\n`);

  console.log('   📋 Update Kaiz Demo:');
  console.log('      1. Copy recipient addresses to apps/kaiz/app/demo/page.tsx');
  console.log('      2. Update transaction hashes after funding');
  console.log('      3. Restart the Kaiz server\n');

  // 6. Generate demo transaction template
  console.log('6️⃣  Demo Transaction Template:\n');
  console.log('```typescript');
  console.log('// Treasury Wallet');
  console.log(`const treasuryAddress = "${treasuryWallet.address}";`);
  console.log('');
  console.log('// Recipients');
  wallets.slice(1).forEach((wallet, i) => {
    const varName = wallet.name.split(' ')[0].toLowerCase();
    console.log(`const ${varName}Address = "${wallet.address}"; // ${wallet.name}`);
  });
  console.log('```\n');

  console.log('✅ Setup complete!\n');
  console.log('⚠️  IMPORTANT: Keep testnet-wallets.json secure (contains private keys)');
  console.log('⚠️  Add testnet-wallets.json to .gitignore\n');
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
