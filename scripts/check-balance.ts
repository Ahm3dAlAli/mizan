/**
 * Quick Balance Check for Treasury and Recipients
 * IMPORTANT: Arc Testnet uses USDC as NATIVE CURRENCY (like ETH on Ethereum)
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

const WALLETS = {
  'Treasury (Dubai, UAE)': '0x564f33570d52f50bde64cbaCe3B133b4D60e5Ad8',
  'Ahmed Hassan (Egypt)': '0x7e53142B9FB522b21aAad9A0AcEB79311A56d26f',
  'Maria Santos (Philippines)': '0xDA55D6CA70f5A4c533aA77338054D4E4e4d08FC8',
  'Rajesh Kumar (India)': '0x3392C96BE9b245f714a937fEd9e02D89EB0b881F',
  'Fatima Khan (Pakistan)': '0xd3896ac4A9E690b79746fD1C779BC6aB3144d948',
  'Oluwaseun Adeyemi (Nigeria)': '0x2aAf7C729410C541563eFEBa220d04786aD107c9',
};

async function main() {
  console.log('🔍 Checking Native USDC Balances on Arc Testnet...\n');

  const publicClient = createPublicClient({
    chain: arcTestnet,
    transport: http(),
  });

  for (const [name, address] of Object.entries(WALLETS)) {
    try {
      // Get native balance (USDC is the native currency on Arc Testnet)
      const balance = await publicClient.getBalance({
        address: address as `0x${string}`,
      });

      const balanceUSDC = formatEther(balance);
      const balanceFloat = parseFloat(balanceUSDC);

      console.log(`${name}`);
      console.log(`  Address: ${address}`);
      console.log(`  Balance: ${balanceFloat.toFixed(6)} USDC (native)`);

      if (balanceFloat < 0.01) {
        console.log(`  Status: ⚠️  EMPTY - Fund Required`);
      } else if (balanceFloat < 10) {
        console.log(`  Status: ⚡ LOW - Consider adding more`);
      } else {
        console.log(`  Status: ✅ GOOD`);
      }
      console.log('');
    } catch (error) {
      console.error(`  Error fetching balance: ${error}`);
      console.log('');
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('To fund treasury:');
  console.log('1. Visit: https://faucet.testnet.arc.network');
  console.log('2. Enter: 0x564f33570d52f50bde64cbaCe3B133b4D60e5Ad8');
  console.log('3. Request USDC');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(console.error);
