/**
 * Clear stuck transactions by replacing them with higher gas price
 */

import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

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

const TREASURY_PRIVATE_KEY = process.env.TREASURY_PRIVATE_KEY || '0x45674917850faf1288cb88f0103c1bd8d9322cd8dd83bb4b308c168822e2bc90';
const TREASURY = '0x564f33570d52f50bde64cbaCe3B133b4D60e5Ad8';

async function main() {
  console.log('🧹 Clearing stuck transactions...\n');

  const publicClient = createPublicClient({
    chain: arcTestnet,
    transport: http(),
  });

  const account = privateKeyToAccount(TREASURY_PRIVATE_KEY as `0x${string}`);
  const walletClient = createWalletClient({
    account,
    chain: arcTestnet,
    transport: http(),
  });

  // Get current nonces
  const confirmedNonce = await publicClient.getTransactionCount({
    address: TREASURY as `0x${string}`,
    blockTag: 'latest',
  });

  const pendingNonce = await publicClient.getTransactionCount({
    address: TREASURY as `0x${string}`,
    blockTag: 'pending',
  });

  const stuckCount = pendingNonce - confirmedNonce;

  console.log(`Confirmed Nonce: ${confirmedNonce}`);
  console.log(`Pending Nonce: ${pendingNonce}`);
  console.log(`Stuck Transactions: ${stuckCount}\n`);

  if (stuckCount === 0) {
    console.log('✅ No stuck transactions!');
    return;
  }

  // Get current gas price and triple it to ensure replacement
  const gasPrice = await publicClient.getGasPrice();
  const replacementGasPrice = gasPrice * 3n;

  console.log(`Base Gas Price: ${gasPrice.toString()} wei`);
  console.log(`Replacement Gas Price: ${replacementGasPrice.toString()} wei (3x)\n`);

  // Replace each stuck transaction by sending to self with same nonce but higher gas
  for (let nonce = confirmedNonce; nonce < pendingNonce; nonce++) {
    try {
      console.log(`Replacing transaction with nonce ${nonce}...`);

      const hash = await walletClient.sendTransaction({
        to: TREASURY as `0x${string}`,
        value: 0n, // Send 0 to self
        nonce,
        gasPrice: replacementGasPrice,
      });

      console.log(`✅ Replacement sent: ${hash}`);
      console.log(`   Explorer: ${arcTestnet.blockExplorers.default.url}/tx/${hash}\n`);

      // Wait a bit between transactions
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to replace nonce ${nonce}:`, error instanceof Error ? error.message : error);
    }
  }

  console.log('\n✅ Replacement transactions sent!');
  console.log('Wait 30-60 seconds for them to confirm, then retry your payroll.\n');
}

main().catch(console.error);
