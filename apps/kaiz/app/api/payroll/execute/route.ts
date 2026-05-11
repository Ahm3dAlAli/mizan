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
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { performBatchComplianceCheck } from '@/lib/services/compliance';

// Arc Testnet configuration
// IMPORTANT: Arc Testnet uses USDC as its NATIVE CURRENCY (like ETH on Ethereum)
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

// Treasury wallet configuration
const TREASURY_ADDRESS = '0x564f33570d52f50bde64cbaCe3B133b4D60e5Ad8';
const TREASURY_PRIVATE_KEY = process.env.TREASURY_PRIVATE_KEY || '0x45674917850faf1288cb88f0103c1bd8d9322cd8dd83bb4b308c168822e2bc90';

// Recipient wallets (all recipients from testnet-wallets.json)
const RECIPIENTS: Record<string, string> = {
  'Maria Santos': '0xDA55D6CA70f5A4c533aA77338054D4E4e4d08FC8',
  'Rajesh Kumar': '0x3392C96BE9b245f714a937fEd9e02D89EB0b881F',
  'Ahmed Hassan': '0x7e53142B9FB522b21aAad9A0AcEB79311A56d26f',
  'Fatima Khan': '0xd3896ac4A9E690b79746fD1C779BC6aB3144d948',
  'Oluwaseun Adeyemi': '0x2aAf7C729410C541563eFEBa220d04786aD107c9',
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

    // Check treasury balance (native USDC)
    const balance = await publicClient.getBalance({
      address: treasuryAccount.address,
    });

    const balanceUSDC = formatEther(balance);
    const balanceFloat = parseFloat(balanceUSDC);

    if (balanceFloat < 0.05 * transactions.length) {
      return NextResponse.json(
        {
          error: 'Insufficient treasury balance',
          balance: balanceUSDC,
          required: (0.05 * transactions.length).toString(),
          treasuryAddress: TREASURY_ADDRESS,
          faucet: 'https://faucet.testnet.arc.network',
        },
        { status: 402 }
      );
    }

    // Perform compliance checks using Exa
    console.log('🔍 Running compliance checks via Exa...');
    const complianceResults = await performBatchComplianceCheck(transactions);

    // Check if any transaction failed compliance
    const failedCompliance = Array.from(complianceResults.entries()).filter(
      ([_, check]) => !check.passed
    );

    if (failedCompliance.length > 0) {
      return NextResponse.json(
        {
          error: 'Compliance check failed',
          failedTransactions: failedCompliance.map(([recipient, check]) => ({
            recipient,
            risk_level: check.risk_level,
            flags: check.flags,
            details: check.details,
          })),
          message: 'One or more transactions did not pass compliance checks',
        },
        { status: 403 }
      );
    }

    console.log('✅ All compliance checks passed');

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

        // Send 0.05 USDC as native transfer
        const amountInUSDC = parseEther('0.05');

        // Get current gas price and increase by 50% to replace any stuck transactions
        const gasPrice = await publicClient.getGasPrice();
        const adjustedGasPrice = (gasPrice * 150n) / 100n;

        // Send native USDC transfer (not ERC20)
        const hash = await walletClient.sendTransaction({
          to: recipientAddress as `0x${string}`,
          value: amountInUSDC,
          gasPrice: adjustedGasPrice,
        });

        console.log(`📤 Transaction sent: ${hash}`);

        // Get compliance data for this transaction
        const complianceCheck = complianceResults.get(tx.recipient);

        // Wait for confirmation with extended timeout
        try {
          const receipt = await publicClient.waitForTransactionReceipt({
            hash,
            timeout: 120000, // 2 minutes
          });

          const status = receipt.status === 'success' ? 'settled' : 'failed';

          results.push({
            ...tx,
            txHash: hash,
            status,
            timestamp: new Date().toISOString(),
            blockNumber: receipt.blockNumber.toString(),
            gasUsed: receipt.gasUsed.toString(),
            compliance: {
              passed: complianceCheck?.passed || false,
              risk_level: complianceCheck?.risk_level || 'unknown',
              checks_performed: complianceCheck?.checks_performed || [],
              details: complianceCheck?.details || '',
            },
          });
        } catch (receiptError) {
          // Transaction was sent but receipt timed out - still return the hash
          console.log(`⏰ Receipt timeout for ${hash}, but transaction was sent`);
          results.push({
            ...tx,
            txHash: hash,
            status: 'pending', // Mark as pending instead of failed
            timestamp: new Date().toISOString(),
            note: 'Transaction sent but confirmation pending. Check explorer for status.',
            compliance: {
              passed: complianceCheck?.passed || false,
              risk_level: complianceCheck?.risk_level || 'unknown',
              checks_performed: complianceCheck?.checks_performed || [],
              details: complianceCheck?.details || '',
            },
          });
        }

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

    // Compile compliance summary
    const complianceSummary = {
      total_checks: complianceResults.size,
      all_passed: Array.from(complianceResults.values()).every(c => c.passed),
      risk_breakdown: {
        low: Array.from(complianceResults.values()).filter(c => c.risk_level === 'low').length,
        medium: Array.from(complianceResults.values()).filter(c => c.risk_level === 'medium').length,
        high: Array.from(complianceResults.values()).filter(c => c.risk_level === 'high').length,
      },
    };

    return NextResponse.json({
      success: true,
      treasuryAddress: TREASURY_ADDRESS,
      balanceBefore: balanceUSDC,
      network: arcTestnet.name,
      chainId: arcTestnet.id,
      transactions: results,
      compliance: complianceSummary,
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

    // Check treasury balance (native USDC)
    const balance = await publicClient.getBalance({
      address: TREASURY_ADDRESS as `0x${string}`,
    });

    const balanceUSDC = formatEther(balance);

    return NextResponse.json({
      treasuryAddress: TREASURY_ADDRESS,
      balance: balanceUSDC,
      network: arcTestnet.name,
      chainId: arcTestnet.id,
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
