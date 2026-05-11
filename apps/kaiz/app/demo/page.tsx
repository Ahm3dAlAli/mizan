'use client';

import { useState, useEffect } from 'react';
import { AgentActionCard } from '@/components/payroll/AgentActionCard';
import { TransactionCard } from '@/components/payroll/TransactionCard';

interface TreasuryInfo {
  treasuryAddress: string;
  balance: string;
  network: string;
  chainId: number;
  usdcAddress: string;
  explorer: string;
  faucet: string;
}

type AgentType = 'supervisor' | 'classifier' | 'treasurer' | 'gatekeeper' | 'payables';

interface AgentAction {
  id: string;
  agent: AgentType;
  action: string;
  reasoning: string;
  toolsCalled: string[];
  timestamp: string;
}

interface ComplianceInfo {
  passed: boolean;
  risk_level: 'low' | 'medium' | 'high' | 'unknown';
  checks_performed: string[];
  details: string;
}

interface Transaction {
  id: string;
  recipient: string;
  amount: string;
  currency: string;
  corridor: string;
  status: 'pending' | 'processing' | 'settled' | 'failed';
  txHash?: string;
  timestamp: string;
  error?: string;
  compliance?: ComplianceInfo;
}

// Mock data for the demo - in production this comes from Supabase Realtime
const mockPayrollRun = {
  id: 'pr_demo_001',
  status: 'completed',
  createdAt: new Date().toISOString(),
  agentActions: [
    {
      id: '1',
      agent: 'supervisor' as AgentType,
      action: 'Route payroll request',
      reasoning: 'Analyzed 12 invoices totaling $45,230 USDC. Detected 3 destination countries (Philippines, India, Egypt). Routing to classifier agent for corridor determination.',
      toolsCalled: ['analyze_invoices', 'detect_destinations'],
      timestamp: new Date(Date.now() - 25000).toISOString(),
    },
    {
      id: '2',
      agent: 'classifier' as AgentType,
      action: 'Classify invoices by corridor',
      reasoning: 'Mapped invoices to corridors: 7 invoices → UAE-Philippines (AED→PHP), 3 invoices → UAE-India (AED→INR), 2 invoices → UAE-Egypt (AED→EGP). Total routing options available: 5 corridors.',
      toolsCalled: ['map_to_corridor', 'get_fx_rates'],
      timestamp: new Date(Date.now() - 20000).toISOString(),
    },
    {
      id: '3',
      agent: 'treasurer' as AgentType,
      action: 'Check balance and optimize routing',
      reasoning: 'Treasury balance: 250,000 USDC. Required: 45,230 USDC + 520 USDC fees. ✅ Sufficient funds. Optimized routing for lowest fees: Philippines corridor (1.0%), India corridor (1.0%), Egypt corridor (0.8%).',
      toolsCalled: ['check_balance', 'optimize_routing', 'calculate_fees'],
      timestamp: new Date(Date.now() - 15000).toISOString(),
    },
    {
      id: '4',
      agent: 'gatekeeper' as AgentType,
      action: 'Enforce compliance rules via Exa',
      reasoning: 'Real-time compliance checks using Exa API: ✅ Sanctions screening via OFAC databases. ✅ Cross-border regulations verified for Philippines, India, Egypt corridors. ✅ All recipients cleared with low risk level. ✅ Payment corridor compliance confirmed. Ready for execution.',
      toolsCalled: ['exa_sanctions_search', 'exa_corridor_compliance', 'verify_kyc', 'log_audit'],
      timestamp: new Date(Date.now() - 10000).toISOString(),
    },
    {
      id: '5',
      agent: 'payables' as AgentType,
      action: 'Execute payments via ArcPay',
      reasoning: 'Executed 12 transactions across 3 corridors. Settlement time: 2.8s average. Total fees: 520 USDC (1.15% effective rate). All transactions confirmed on Arc Testnet.',
      toolsCalled: ['execute_payment', 'confirm_settlement', 'update_status'],
      timestamp: new Date(Date.now() - 5000).toISOString(),
    },
  ],
  transactions: [
    {
      id: 'tx_1',
      recipient: 'Maria Santos',
      amount: '8500',
      currency: 'PHP',
      corridor: 'UAE → Philippines',
      status: 'settled' as const,
      txHash: '0x742d35cc6634c0532925a3b844bc9e7fce3b1234abcd1234ef567890ab123456',
      timestamp: new Date(Date.now() - 4000).toISOString(),
      compliance: {
        passed: true,
        risk_level: 'low' as const,
        checks_performed: ['sanctions_screening', 'corridor_compliance'],
        details: '✅ All compliance checks passed for Philippines corridor',
      },
    },
    {
      id: 'tx_2',
      recipient: 'Rajesh Kumar',
      amount: '12000',
      currency: 'INR',
      corridor: 'UAE → India',
      status: 'settled' as const,
      txHash: '0x8a93c67e46523fb89012def456789ab0123cdef45678901234567890abcdef12',
      timestamp: new Date(Date.now() - 3800).toISOString(),
      compliance: {
        passed: true,
        risk_level: 'low' as const,
        checks_performed: ['sanctions_screening', 'corridor_compliance'],
        details: '✅ All compliance checks passed for India corridor',
      },
    },
    {
      id: 'tx_3',
      recipient: 'Ahmed Hassan',
      amount: '6500',
      currency: 'EGP',
      corridor: 'UAE → Egypt',
      status: 'settled' as const,
      txHash: '0x3f7e52ab9012cdef3456789ab0cd12ef34567890abcd1234567890ef12345678',
      timestamp: new Date(Date.now() - 3600).toISOString(),
      compliance: {
        passed: true,
        risk_level: 'low' as const,
        checks_performed: ['sanctions_screening', 'corridor_compliance'],
        details: '✅ All compliance checks passed for Egypt corridor',
      },
    },
  ],
};

export default function DemoPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [visibleActions, setVisibleActions] = useState<number>(0);
  const [visibleTransactions, setVisibleTransactions] = useState<number>(0);
  const [treasuryInfo, setTreasuryInfo] = useState<TreasuryInfo | null>(null);
  const [realTransactions, setRealTransactions] = useState<Transaction[]>([]);
  const [useRealTransactions, setUseRealTransactions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch treasury info on mount
  useEffect(() => {
    fetchTreasuryInfo();
  }, []);

  const fetchTreasuryInfo = async () => {
    try {
      const response = await fetch('/api/payroll/execute');
      if (response.ok) {
        const data = await response.json();
        setTreasuryInfo(data);
      }
    } catch (err) {
      console.error('Failed to fetch treasury info:', err);
    }
  };

  const executeRealPayroll = async () => {
    setError(null);
    try {
      const transactions = [
        {
          recipient: 'Maria Santos',
          amount: '8500',
          currency: 'PHP',
          corridor: 'UAE → Philippines',
        },
        {
          recipient: 'Rajesh Kumar',
          amount: '12000',
          currency: 'INR',
          corridor: 'UAE → India',
        },
        {
          recipient: 'Ahmed Hassan',
          amount: '6500',
          currency: 'EGP',
          corridor: 'UAE → Egypt',
        },
      ];

      const response = await fetch('/api/payroll/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setError(
            `Insufficient balance. Treasury has ${data.balance} USDC but needs ${data.required} USDC. Fund wallet at: ${data.faucet}`
          );
        } else {
          setError(data.error || 'Failed to execute payroll');
        }
        return null;
      }

      const txsWithIds = data.transactions.map((tx: any, i: number) => ({
        ...tx,
        id: `tx_${i + 1}`,
      }));

      setRealTransactions(txsWithIds);
      await fetchTreasuryInfo(); // Refresh balance
      return txsWithIds;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  };

  const startDemo = async () => {
    setIsRunning(true);
    setVisibleActions(0);
    setVisibleTransactions(0);
    setError(null);

    // Simulate agent actions appearing one by one
    mockPayrollRun.agentActions.forEach((_, index) => {
      setTimeout(() => {
        setVisibleActions(index + 1);
      }, index * 3000);
    });

    // Execute real transactions if enabled
    if (useRealTransactions) {
      setTimeout(async () => {
        const txs = await executeRealPayroll();
        if (txs) {
          // Show transactions one by one
          txs.forEach((_tx: Transaction, index: number) => {
            setTimeout(() => {
              setVisibleTransactions(index + 1);
            }, index * 500);
          });

          // Reset after showing all transactions
          setTimeout(() => {
            setIsRunning(false);
          }, txs.length * 500 + 2000);
        } else {
          setIsRunning(false);
        }
      }, mockPayrollRun.agentActions.length * 3000);
    } else {
      // Show mock transactions after all agents complete
      setTimeout(() => {
        mockPayrollRun.transactions.forEach((_, index) => {
          setTimeout(() => {
            setVisibleTransactions(index + 1);
          }, index * 500);
        });
      }, mockPayrollRun.agentActions.length * 3000);

      // Reset after demo completes
      setTimeout(() => {
        setIsRunning(false);
      }, (mockPayrollRun.agentActions.length * 3000) + (mockPayrollRun.transactions.length * 500) + 2000);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-h2 font-medium mb-4 text-text">
            Quick Demo: AI Agent Payroll Run
          </h1>
          <p className="text-text-2 text-body-l max-w-2xl">
            Watch 5 AI agents autonomously process a payroll batch of 12 invoices
            across 3 countries using Circle USDC and Arc Network.
          </p>
        </div>

        {/* Treasury Info */}
        {treasuryInfo && (
          <div className="mb-6 p-4 bg-bg-elev rounded-lg border border-line shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-body-s font-medium text-text-2">Treasury Wallet</h3>
                <p className="text-body-xs text-text-3 font-mono">{treasuryInfo.treasuryAddress}</p>
              </div>
              <div className="text-right">
                <p className="text-body-s text-text-2">Balance</p>
                <p className="text-h4 font-medium text-text">{treasuryInfo.balance} USDC</p>
              </div>
            </div>
            {parseFloat(treasuryInfo.balance) < 0.1 && (
              <div className="mt-3 p-3 bg-yellow/10 border border-yellow rounded-lg">
                <p className="text-body-xs text-text-2">
                  ⚠️ Low balance. Fund wallet at:{' '}
                  <a
                    href={treasuryInfo.faucet}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green hover:underline"
                  >
                    Arc Testnet Faucet
                  </a>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red/10 border border-red rounded-lg">
            <p className="text-body-s text-text">{error}</p>
          </div>
        )}

        {/* Demo Control */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useRealTransactions}
                onChange={(e) => setUseRealTransactions(e.target.checked)}
                disabled={isRunning}
                className="w-4 h-4 text-green bg-bg-2 border-line rounded focus:ring-green focus:ring-2"
              />
              <span className="text-body-s text-text-2">
                Use real on-chain transactions (Arc Testnet)
              </span>
            </label>
          </div>
          <button
            onClick={startDemo}
            disabled={isRunning}
            className={`px-8 py-4 rounded-lg font-medium transition shadow-sm ${
              isRunning
                ? 'bg-bg-2 text-text-3 cursor-not-allowed'
                : 'bg-green text-bg-elev hover:bg-green-2'
            }`}
          >
            {isRunning ? 'Running...' : useRealTransactions ? 'Start Real Payroll Run' : 'Start Demo Payroll Run'}
          </button>
        </div>

        {/* Agent Actions Log */}
        {visibleActions > 0 && (
          <div className="mb-12">
            <h2 className="text-h3 font-medium mb-6 flex items-center gap-3 text-text">
              <div className="w-2 h-2 bg-green rounded-full animate-pulse" />
              Agent Activity
            </h2>
            <div className="space-y-4">
              {mockPayrollRun.agentActions.slice(0, visibleActions).map((action) => (
                <AgentActionCard
                  key={action.id}
                  agent={action.agent}
                  action={action.action}
                  reasoning={action.reasoning}
                  toolsCalled={action.toolsCalled}
                  timestamp={action.timestamp}
                />
              ))}
            </div>
          </div>
        )}

        {/* Transactions */}
        {visibleTransactions > 0 && (
          <div>
            <h2 className="text-h3 font-medium mb-6 flex items-center gap-3 text-text">
              <div className="w-2 h-2 bg-green rounded-full" />
              {useRealTransactions ? 'Real On-Chain Transactions' : 'Completed Transactions'}
            </h2>
            <div className="space-y-4">
              {(useRealTransactions ? realTransactions : mockPayrollRun.transactions)
                .slice(0, visibleTransactions)
                .map((tx) => (
                  <TransactionCard
                    key={tx.id}
                    recipient={tx.recipient}
                    amount={tx.amount}
                    currency={tx.currency}
                    corridor={tx.corridor}
                    status={tx.status as 'pending' | 'processing' | 'settled' | 'failed'}
                    txHash={tx.txHash || '0x0'}
                    timestamp={tx.timestamp}
                    compliance={tx.compliance}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Info Footer */}
        {!isRunning && visibleActions === 0 && (
          <div className="mt-12 p-6 bg-bg-elev rounded-lg border border-line shadow-card">
            <h3 className="text-h4 font-medium mb-3 text-text">What you'll see:</h3>
            <ul className="space-y-2 text-body-s text-text-2">
              <li className="flex items-start gap-2">
                <span className="text-green">→</span>
                <span><strong className="text-text">5 AI agents</strong> reasoning through the payroll process</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green">→</span>
                <span><strong className="text-text">Real-time orchestration</strong> with LangGraph + Claude</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green">→</span>
                <span><strong className="text-text">3 cross-border corridors</strong> (UAE → Philippines, India, Egypt)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green">→</span>
                <span><strong className="text-text">Circle USDC settlement</strong> on Arc Testnet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green">→</span>
                <span><strong className="text-text">Real-time compliance via Exa</strong> (sanctions + corridor checks)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green">→</span>
                <span><strong className="text-text">Sub-3s settlement times</strong> on Arc Testnet</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
