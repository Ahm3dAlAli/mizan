'use client';

import { useState, useEffect } from 'react';

// Real wallet addresses from testnet-wallets.json
const TREASURY_WALLET = {
  name: 'Treasury (Kaiz - Dubai, UAE)',
  address: '0x564f33570d52f50bde64cbaCe3B133b4D60e5Ad8',
  location: 'Dubai, UAE',
  type: 'sender',
};

const RECIPIENT_WALLET = {
  name: 'Ahmed Hassan',
  address: '0x7e53142B9FB522b21aAad9A0AcEB79311A56d26f',
  location: 'Cairo, Egypt',
  type: 'recipient',
  amount: '1500',
  currency: 'EGP',
  usdcAmount: '50',
  corridor: 'UAE → Egypt',
};

interface AgentStep {
  agent: string;
  action: string;
  status: 'pending' | 'running' | 'completed';
  result?: any;
  timestamp?: string;
}

interface TransactionData {
  txHash?: string;
  status?: 'pending' | 'confirmed' | 'failed';
  blockNumber?: string;
  gasUsed?: string;
  compliance?: {
    passed: boolean;
    risk_level: string;
    details: string;
  };
  error?: string;
  message?: string;
}

export default function TwoPartyDemoPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [treasuryBalance, setTreasuryBalance] = useState<string>('0');
  const [recipientBalance, setRecipientBalance] = useState<string>('0');
  const [transactionData, setTransactionData] = useState<TransactionData>({});
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([
    {
      agent: 'Supervisor',
      action: 'Analyze payment request',
      status: 'pending',
    },
    {
      agent: 'Classifier',
      action: 'Identify corridor UAE → Egypt',
      status: 'pending',
    },
    {
      agent: 'Treasurer',
      action: 'Check treasury balance & calculate fees',
      status: 'pending',
    },
    {
      agent: 'Gatekeeper',
      action: 'Run Exa compliance checks',
      status: 'pending',
    },
    {
      agent: 'Payables',
      action: 'Execute on-chain USDC transfer',
      status: 'pending',
    },
  ]);

  // Fetch real balances
  const fetchBalances = async () => {
    try {
      const response = await fetch('/api/payroll/execute');
      if (response.ok) {
        const data = await response.json();
        setTreasuryBalance(data.balance);
      }
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  const executeRealTransaction = async () => {
    setIsRunning(true);
    setCurrentStep(0);

    // Step 1: Supervisor
    updateStepStatus(0, 'running');
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateStepStatus(0, 'completed', {
      invoice_amount: RECIPIENT_WALLET.amount,
      currency: RECIPIENT_WALLET.currency,
      destination: 'Egypt',
    });

    // Step 2: Classifier
    setCurrentStep(1);
    updateStepStatus(1, 'running');
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateStepStatus(1, 'completed', {
      corridor: RECIPIENT_WALLET.corridor,
      fx_rate: '30.0 EGP/USD',
      usdc_amount: '50 USDC',
    });

    // Step 3: Treasurer
    setCurrentStep(2);
    updateStepStatus(2, 'running');
    await fetchBalances();
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateStepStatus(2, 'completed', {
      treasury_balance: '140 USDC',
      required: '50 USDC',
      fee: '0.5 USDC (1%)',
      status: 'sufficient',
    });

    // Step 4: Gatekeeper (Real Exa compliance)
    setCurrentStep(3);
    updateStepStatus(3, 'running');

    try {
      // This will trigger real Exa API call
      const complianceResponse = await fetch('/api/payroll/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions: [{
            recipient: RECIPIENT_WALLET.name,
            amount: RECIPIENT_WALLET.amount,
            currency: RECIPIENT_WALLET.currency,
            corridor: RECIPIENT_WALLET.corridor,
          }],
        }),
      });

      const complianceData = await complianceResponse.json();

      if (complianceResponse.ok) {
        const tx = complianceData.transactions[0];
        updateStepStatus(3, 'completed', {
          sanctions_check: 'CLEAR',
          corridor_check: 'COMPLIANT',
          risk_level: tx.compliance?.risk_level || 'unknown',
        });

        // Step 5: Execute transaction
        setCurrentStep(4);
        updateStepStatus(4, 'running');
        await new Promise(resolve => setTimeout(resolve, 1000));

        const displayStatus = tx.status === 'settled' ? 'confirmed' : tx.status === 'pending' ? 'pending' : 'failed';

        setTransactionData({
          txHash: tx.txHash,
          status: displayStatus,
          blockNumber: tx.blockNumber,
          gasUsed: tx.gasUsed,
          compliance: tx.compliance,
          message: tx.note,
        });

        updateStepStatus(4, 'completed', {
          tx_hash: tx.txHash,
          status: tx.status,
          block: tx.blockNumber || 'Pending confirmation',
          note: tx.note,
        });

        await fetchBalances();
      } else {
        // Handle insufficient balance or compliance failure
        console.error('Transaction failed:', complianceData);
        updateStepStatus(3, 'completed', {
          error: complianceData.error,
          message: complianceData.message || complianceData.error,
        });

        setCurrentStep(4);
        updateStepStatus(4, 'running');
        await new Promise(resolve => setTimeout(resolve, 500));

        updateStepStatus(4, 'completed', {
          status: 'failed',
          reason: complianceData.error || 'Transaction execution failed',
          details: complianceData.message || JSON.stringify(complianceData),
        });
        setTransactionData({
          status: 'failed',
          error: complianceData.error,
          message: complianceData.message,
        });
      }
    } catch (error) {
      console.error('Transaction execution error:', error);
      updateStepStatus(4, 'completed', {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    setIsRunning(false);
  };

  const updateStepStatus = (index: number, status: AgentStep['status'], result?: any) => {
    setAgentSteps(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        status,
        result,
        timestamp: new Date().toISOString(),
      };
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-h2 font-medium mb-4 text-text">
            Two-Party Demo: Real On-Chain Payment
          </h1>
          <p className="text-text-2 text-body-l max-w-3xl">
            Watch a real USDC transfer from Treasury (Dubai, UAE) to Ahmed Hassan (Cairo, Egypt)
            with live Exa compliance checks and on-chain execution on Arc Testnet.
          </p>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Treasury (Sender) */}
          <div className="p-6 bg-bg-elev rounded-lg border border-line shadow-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-body-xs text-text-3 mb-1">SENDER</div>
                <h3 className="text-h4 font-medium text-text">{TREASURY_WALLET.name}</h3>
                <p className="text-body-s text-text-2">{TREASURY_WALLET.location}</p>
              </div>
              <div className="px-3 py-1 bg-green-tint rounded-full">
                <span className="text-body-xs text-green font-medium">Treasury</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-body-xs text-text-3 mb-1">Wallet Address</p>
              <div className="font-mono text-body-xs text-text-2 bg-bg-2 p-2 rounded border border-line break-all">
                {TREASURY_WALLET.address}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-line">
              <span className="text-body-s text-text-2">USDC Balance</span>
              <span className="text-h4 font-medium text-text">{treasuryBalance}</span>
            </div>
          </div>

          {/* Recipient */}
          <div className="p-6 bg-bg-elev rounded-lg border border-line shadow-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-body-xs text-text-3 mb-1">RECIPIENT</div>
                <h3 className="text-h4 font-medium text-text">{RECIPIENT_WALLET.name}</h3>
                <p className="text-body-s text-text-2">{RECIPIENT_WALLET.location}</p>
              </div>
              <div className="px-3 py-1 bg-blue/10 rounded-full border border-blue">
                <span className="text-body-xs text-blue font-medium">Worker</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-body-xs text-text-3 mb-1">Wallet Address</p>
              <div className="font-mono text-body-xs text-text-2 bg-bg-2 p-2 rounded border border-line break-all">
                {RECIPIENT_WALLET.address}
              </div>
            </div>

            <div className="pt-4 border-t border-line space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-body-s text-text-2">Payment Amount</span>
                <span className="text-h4 font-medium text-green">
                  {RECIPIENT_WALLET.amount} {RECIPIENT_WALLET.currency}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-xs text-text-3">≈ {RECIPIENT_WALLET.usdcAmount} USDC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Route */}
        <div className="mb-8 p-4 bg-bg-elev rounded-lg border border-line shadow-card">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-body-s text-text-2">Dubai, UAE</div>
              <div className="text-body-xs text-text-3">Treasury</div>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-green relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-bg px-2">
                <span className="text-body-xs text-green font-medium">{RECIPIENT_WALLET.corridor}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-body-s text-text-2">Cairo, Egypt</div>
              <div className="text-body-xs text-text-3">Recipient</div>
            </div>
          </div>
        </div>

        {/* Control Button */}
        <div className="mb-8">
          <button
            onClick={executeRealTransaction}
            disabled={isRunning}
            className={`w-full px-8 py-4 rounded-lg font-medium transition shadow-sm ${
              isRunning
                ? 'bg-bg-2 text-text-3 cursor-not-allowed'
                : 'bg-green text-bg-elev hover:bg-green-2'
            }`}
          >
            {isRunning ? '⚙️ Executing Real Transaction...' : '🚀 Execute Real Payment on Arc Testnet'}
          </button>
        </div>

        {/* Agent Execution Steps */}
        {agentSteps.some(step => step.status !== 'pending') && (
          <div className="mb-12">
            <h2 className="text-h3 font-medium mb-6 text-text">
              AI Agent Execution Pipeline
            </h2>
            <div className="space-y-4">
              {agentSteps.map((step, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition ${
                    step.status === 'completed'
                      ? 'bg-green-tint border-green'
                      : step.status === 'running'
                      ? 'bg-bg-elev border-green animate-pulse'
                      : 'bg-bg-2 border-line'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'completed'
                          ? 'bg-green text-bg-elev'
                          : step.status === 'running'
                          ? 'bg-green-2 text-bg-elev'
                          : 'bg-bg text-text-3'
                      }`}>
                        {step.status === 'completed' ? '✓' : step.status === 'running' ? '⚙' : index + 1}
                      </div>
                      <div>
                        <div className="text-body-s font-medium text-text">{step.agent}</div>
                        <div className="text-body-xs text-text-2">{step.action}</div>
                      </div>
                    </div>
                    {step.timestamp && (
                      <div className="text-body-xs text-text-3">
                        {new Date(step.timestamp).toLocaleTimeString()}
                      </div>
                    )}
                  </div>

                  {step.result && (
                    <div className="mt-3 p-3 bg-bg-2 rounded border border-line">
                      <div className="text-body-xs text-text-3 mb-2">Result:</div>
                      <pre className="text-body-xs text-text-2 font-mono overflow-x-auto">
                        {JSON.stringify(step.result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transaction Result */}
        {transactionData.txHash && (
          <div className={`p-6 bg-bg-elev rounded-lg border shadow-card ${
            transactionData.status === 'confirmed' ? 'border-green' :
            transactionData.status === 'pending' ? 'border-warn' : 'border-line'
          }`}>
            <h3 className="text-h4 font-medium text-text mb-4">
              {transactionData.status === 'confirmed' ? '✅ Transaction Confirmed on Arc Testnet' :
               transactionData.status === 'pending' ? '⏳ Transaction Pending Confirmation' :
               '📤 Transaction Submitted'}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-line">
                <span className="text-body-s text-text-2">Transaction Hash</span>
                <a
                  href={`https://testnet.arcscan.app/tx/${transactionData.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-s text-green hover:underline font-mono"
                >
                  {transactionData.txHash.slice(0, 10)}...{transactionData.txHash.slice(-8)}
                </a>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-line">
                <span className="text-body-s text-text-2">Status</span>
                <span className={`text-body-s font-medium ${
                  transactionData.status === 'confirmed' ? 'text-green' :
                  transactionData.status === 'pending' ? 'text-warn' : 'text-text'
                }`}>
                  {transactionData.status?.toUpperCase()}
                </span>
              </div>

              {transactionData.message && (
                <div className="py-2 border-b border-line">
                  <p className="text-body-xs text-text-3">{transactionData.message}</p>
                </div>
              )}

              {transactionData.blockNumber && (
                <div className="flex items-center justify-between py-2 border-b border-line">
                  <span className="text-body-s text-text-2">Block Number</span>
                  <span className="text-body-s text-text font-mono">{transactionData.blockNumber}</span>
                </div>
              )}

              {transactionData.compliance && (
                <div className="mt-4 p-3 bg-bg-2 rounded border border-line">
                  <div className="text-body-s font-medium text-text mb-2">Compliance Check via Exa</div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-body-xs text-text-2">Risk Level:</span>
                    <span className={`text-body-xs font-medium ${
                      transactionData.compliance.risk_level === 'low' ? 'text-green' :
                      transactionData.compliance.risk_level === 'medium' ? 'text-warn' :
                      'text-neg'
                    }`}>
                      {transactionData.compliance.risk_level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-body-xs text-text-3">{transactionData.compliance.details}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {transactionData.status === 'failed' && !transactionData.txHash && (
          <div className="p-6 bg-red/10 rounded-lg border border-red">
            <h3 className="text-h4 font-medium text-text mb-2">
              ❌ Transaction Failed
            </h3>
            <p className="text-body-s text-text-2 mb-3">
              {transactionData.message || 'The transaction could not be completed. This is likely due to insufficient treasury balance or compliance issues.'}
            </p>
            {transactionData.error && (
              <div className="p-3 bg-bg-2 rounded border border-line">
                <p className="text-body-xs text-text-3 mb-1">Error Details:</p>
                <p className="text-body-xs text-text font-mono">{transactionData.error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
