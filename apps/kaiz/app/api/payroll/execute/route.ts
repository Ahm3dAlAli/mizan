/**
 * API Route: Execute Real Payroll on Arc Testnet
 *
 * This endpoint executes REAL on-chain transactions using the treasury wallet
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  formatEther,
  encodeFunctionData,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

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

// ERC20 ABI
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

// Treasury wallet configuration
const TREASURY_ADDRESS = '0x564f33570d52f50bde64cbaCe3B133b4D60e5Ad8';
const TREASURY_PRIVATE_KEY = process.env.TREASURY_PRIVATE_KEY || '0x45674917850faf1288cb88f0103c1bd8d9322cd8dd83bb4b308c168822e2bc90';

// Recipient wallets
const RECIPIENTS = {
  'Maria Santos': '0xDA55D6CA70f5A4c533aA77338054D4E4e4d08FC8',
  'Rajesh Kumar': '0x3392C96BE9b245f714a937fEd9e02D89EB0b881F',
  'Ahmed Hassan': '0x7e53142B9FB522b21aAad9A0AcEB79311A56d26f',
};

interface PayrollTransaction {
  recipient: string;
  amount: string;
  currency: string;
  corridor: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactions } = body as { transactions: PayrollTransaction[] };

    if (!transactions || transactions.length === 0) {
      return NextResponse.json(
        { error: 'No transactions provided' },
        { status: 400 }
      );
    }

    // Setup blockchain clients
    const publicClient = createPublicClient({
      chain: arcTestnet,
      transport: http(),
    });

    const treasuryAccount = privateKeyToAccount(TREASURY_PRIVATE_KEY as `0x${string}`);
    const walletClient = createWalletClient({
      account: treasuryAccount,
      chain: arcTestnet,
      transport: http(),
    });

    // Check treasury balance
    const balance = await publicClient.readContract({
      address: USDC_ADDRESS as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [treasuryAccount.address],
    });

    const balanceUSDC = formatEther(balance as bigint);
    const balanceFloat = parseFloat(balanceUSDC);

    if (balanceFloat < 0.01 * transactions.length) {
      return NextResponse.json(
        {
          error: 'Insufficient treasury balance',
          balance: balanceUSDC,
          required: (0.01 * transactions.length).toString(),
          treasuryAddress: TREASURY_ADDRESS,
          faucet: 'https://faucet.testnet.arc.network',
        },
        { status: 402 }
      );
    }

    // Execute transactions
    const results = [];
    for (const tx of transactions) {
      try {
        const recipientAddress = RECIPIENTS[tx.recipient as keyof typeof RECIPIENTS];

        if (!recipientAddress) {
          results.push({
            ...tx,
            status: 'failed',
            error: 'Unknown recipient',
            timestamp: new Date().toISOString(),
          });
          continue;
        }

        // Send 0.01 USDC per transaction
        const amountInUSDC = parseEther('0.01');

        // Encode transfer data
        const transferData = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: 'transfer',
          args: [recipientAddress as `0x${string}`, amountInUSDC],
        });

        // Send transaction
        const hash = await walletClient.sendTransaction({
          to: USDC_ADDRESS as `0x${string}`,
          data: transferData,
        });

        // Wait for confirmation
        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
          timeout: 60000,
        });

        const status = receipt.status === 'success' ? 'settled' : 'failed';

        results.push({
          ...tx,
          txHash: hash,
          status,
          timestamp: new Date().toISOString(),
          blockNumber: receipt.blockNumber.toString(),
          gasUsed: receipt.gasUsed.toString(),
        });

        // Wait 1 second between transactions
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({
          ...tx,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      treasuryAddress: TREASURY_ADDRESS,
      balanceBefore: balanceUSDC,
      network: arcTestnet.name,
      chainId: arcTestnet.id,
      transactions: results,
      explorer: arcTestnet.blockExplorers.default.url,
    });
  } catch (error) {
    console.error('Payroll execution error:', error);
    return NextResponse.json(
      {
        error: 'Failed to execute payroll',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Setup public client
    const publicClient = createPublicClient({
      chain: arcTestnet,
      transport: http(),
    });

    // Check treasury balance
    const balance = await publicClient.readContract({
      address: USDC_ADDRESS as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [TREASURY_ADDRESS as `0x${string}`],
    });

    const balanceUSDC = formatEther(balance as bigint);

    return NextResponse.json({
      treasuryAddress: TREASURY_ADDRESS,
      balance: balanceUSDC,
      network: arcTestnet.name,
      chainId: arcTestnet.id,
      usdcAddress: USDC_ADDRESS,
      explorer: arcTestnet.blockExplorers.default.url,
      faucet: 'https://faucet.testnet.arc.network',
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch treasury info',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
