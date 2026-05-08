'use client';

import { useState } from 'react';
import { AgentActionCard } from '@/components/payroll/AgentActionCard';
import { TransactionCard } from '@/components/payroll/TransactionCard';

// Mock data for the demo - in production this comes from Supabase Realtime
const mockPayrollRun = {
  id: 'pr_demo_001',
  status: 'completed',
  createdAt: new Date().toISOString(),
  agentActions: [
    {
      id: '1',
      agent: 'supervisor',
      action: 'Route payroll request',
      reasoning: 'Analyzed 12 invoices totaling $45,230 USDC. Detected 3 destination countries (Philippines, India, Egypt). Routing to classifier agent for corridor determination.',
      toolsCalled: ['analyze_invoices', 'detect_destinations'],
      timestamp: new Date(Date.now() - 25000).toISOString(),
    },
    {
      id: '2',
      agent: 'classifier',
      action: 'Classify invoices by corridor',
      reasoning: 'Mapped invoices to corridors: 7 invoices → UAE-Philippines (AED→PHP), 3 invoices → UAE-India (AED→INR), 2 invoices → UAE-Egypt (AED→EGP). Total routing options available: 5 corridors.',
      toolsCalled: ['map_to_corridor', 'get_fx_rates'],
      timestamp: new Date(Date.now() - 20000).toISOString(),
    },
    {
      id: '3',
      agent: 'treasurer',
      action: 'Check balance and optimize routing',
      reasoning: 'Treasury balance: 250,000 USDC. Required: 45,230 USDC + 520 USDC fees. ✅ Sufficient funds. Optimized routing for lowest fees: Philippines corridor (1.0%), India corridor (1.0%), Egypt corridor (0.8%).',
      toolsCalled: ['check_balance', 'optimize_routing', 'calculate_fees'],
      timestamp: new Date(Date.now() - 15000).toISOString(),
    },
    {
      id: '4',
      agent: 'gatekeeper',
      action: 'Enforce compliance rules',
      reasoning: 'Compliance checks: ✅ No sanctioned addresses detected. ✅ All recipients passed KYC verification. ✅ Transaction limits within corridor rules. ✅ Audit trail logged to Supabase. Ready for execution.',
      toolsCalled: ['check_sanctions', 'verify_kyc', 'check_limits', 'log_audit'],
      timestamp: new Date(Date.now() - 10000).toISOString(),
    },
    {
      id: '5',
      agent: 'payables',
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
      status: 'settled',
      txHash: '0x742d35cc6634c0532925a3b844bc9e7fce3b1234abcd1234ef567890ab123456',
      timestamp: new Date(Date.now() - 4000).toISOString(),
    },
    {
      id: 'tx_2',
      recipient: 'Rajesh Kumar',
      amount: '12000',
      currency: 'INR',
      corridor: 'UAE → India',
      status: 'settled',
      txHash: '0x8a93c67e46523fb89012def456789ab0123cdef45678901234567890abcdef12',
      timestamp: new Date(Date.now() - 3800).toISOString(),
    },
    {
      id: 'tx_3',
      recipient: 'Ahmed Hassan',
      amount: '6500',
      currency: 'EGP',
      corridor: 'UAE → Egypt',
      status: 'settled',
      txHash: '0x3f7e52ab9012cdef3456789ab0cd12ef34567890abcd1234567890ef12345678',
      timestamp: new Date(Date.now() - 3600).toISOString(),
    },
  ],
};

export default function DemoPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [visibleActions, setVisibleActions] = useState<number>(0);
  const [visibleTransactions, setVisibleTransactions] = useState<number>(0);

  const startDemo = () => {
    setIsRunning(true);
    setVisibleActions(0);
    setVisibleTransactions(0);

    // Simulate agent actions appearing one by one
    mockPayrollRun.agentActions.forEach((_, index) => {
      setTimeout(() => {
        setVisibleActions(index + 1);
      }, index * 3000);
    });

    // Show transactions after all agents complete
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

        {/* Demo Control */}
        <div className="mb-8">
          <button
            onClick={startDemo}
            disabled={isRunning}
            className={`px-8 py-4 rounded-lg font-medium transition shadow-sm ${
              isRunning
                ? 'bg-bg-2 text-text-3 cursor-not-allowed'
                : 'bg-green text-bg-elev hover:bg-green-2'
            }`}
          >
            {isRunning ? 'Running...' : 'Start Payroll Run'}
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
              Completed Transactions
            </h2>
            <div className="space-y-4">
              {mockPayrollRun.transactions.slice(0, visibleTransactions).map((tx) => (
                <TransactionCard
                  key={tx.id}
                  recipient={tx.recipient}
                  amount={tx.amount}
                  currency={tx.currency}
                  corridor={tx.corridor}
                  status={tx.status}
                  txHash={tx.txHash}
                  timestamp={tx.timestamp}
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
                <span><strong className="text-text">Sub-3s settlement times</strong> with full compliance checks</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
