/**
 * Wait for pending transactions to clear from mempool
 */

import { createPublicClient, http, formatEther } from 'viem';

const arcTestnet = {
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
  },
};

const TREASURY = '0x564f33570d52f50bde64cbaCe3B133b4D60e5Ad8';

async function main() {
  console.log('⏳ Waiting for mempool to clear...\n');

  const client = createPublicClient({
    chain: arcTestnet,
    transport: http(),
  });

  let attempts = 0;
  const maxAttempts = 60; // 5 minutes max

  while (attempts < maxAttempts) {
    const confirmedNonce = await client.getTransactionCount({
      address: TREASURY as `0x${string}`,
      blockTag: 'latest',
    });

    const pendingNonce = await client.getTransactionCount({
      address: TREASURY as `0x${string}`,
      blockTag: 'pending',
    });

    const pendingCount = pendingNonce - confirmedNonce;

    const balance = await client.getBalance({
      address: TREASURY as `0x${string}`,
    });

    console.log(`[${new Date().toLocaleTimeString()}] Confirmed Nonce: ${confirmedNonce} | Pending Nonce: ${pendingNonce} | Pending TXs: ${pendingCount} | Balance: ${formatEther(balance)} USDC`);

    if (pendingCount === 0) {
      console.log('\n✅ Mempool is clear! No pending transactions.');
      console.log(`Current nonce: ${confirmedNonce}`);
      console.log(`Balance: ${formatEther(balance)} USDC\n`);
      console.log('You can now run transactions safely.');
      process.exit(0);
    }

    attempts++;
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
  }

  console.log('\n⚠️  Timeout: Some transactions are still pending after 5 minutes.');
  console.log('They may be stuck. Consider increasing gas price significantly.');
}

main().catch(console.error);
