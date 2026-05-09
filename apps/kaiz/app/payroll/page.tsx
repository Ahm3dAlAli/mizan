'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PayrollRun {
  id: string;
  date: string;
  status: 'completed' | 'processing' | 'failed';
  totalAmount: string;
  recipientCount: number;
  transactionCount: number;
}

const mockPayrollRuns: PayrollRun[] = [
  {
    id: 'run_001',
    date: '2026-05-08T14:30:00Z',
    status: 'completed',
    totalAmount: '27,000',
    recipientCount: 3,
    transactionCount: 3,
  },
  {
    id: 'run_002',
    date: '2026-05-01T10:15:00Z',
    status: 'completed',
    totalAmount: '45,230',
    recipientCount: 5,
    transactionCount: 5,
  },
  {
    id: 'run_003',
    date: '2026-04-24T16:45:00Z',
    status: 'completed',
    totalAmount: '38,500',
    recipientCount: 4,
    transactionCount: 4,
  },
  {
    id: 'run_004',
    date: '2026-04-17T09:20:00Z',
    status: 'completed',
    totalAmount: '52,100',
    recipientCount: 6,
    transactionCount: 6,
  },
];

export default function PayrollPage() {
  const [selectedRun, setSelectedRun] = useState<PayrollRun | null>(null);

  const getStatusColor = (status: PayrollRun['status']) => {
    switch (status) {
      case 'completed':
        return 'text-lime';
      case 'processing':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
    }
  };

  const getStatusIcon = (status: PayrollRun['status']) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'processing':
        return '⏳';
      case 'failed':
        return '✗';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-ink">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-ivory-3 hover:text-lime mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-medium mb-4">Payroll History</h1>
          <p className="text-ivory-3 text-lg">
            View all payroll runs processed by AI agents
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg border border-ivory/10 bg-ink-2">
            <div className="text-xs text-ivory-3 mb-1">Total Runs</div>
            <div className="text-2xl font-medium text-lime">{mockPayrollRuns.length}</div>
          </div>
          <div className="p-4 rounded-lg border border-ivory/10 bg-ink-2">
            <div className="text-xs text-ivory-3 mb-1">Total Volume</div>
            <div className="text-2xl font-medium text-lime">
              ${mockPayrollRuns.reduce((sum, run) => sum + parseFloat(run.totalAmount.replace(/,/g, '')), 0).toLocaleString()}
            </div>
          </div>
          <div className="p-4 rounded-lg border border-ivory/10 bg-ink-2">
            <div className="text-xs text-ivory-3 mb-1">Total Recipients</div>
            <div className="text-2xl font-medium text-lime">
              {mockPayrollRuns.reduce((sum, run) => sum + run.recipientCount, 0)}
            </div>
          </div>
          <div className="p-4 rounded-lg border border-ivory/10 bg-ink-2">
            <div className="text-xs text-ivory-3 mb-1">Success Rate</div>
            <div className="text-2xl font-medium text-lime">100%</div>
          </div>
        </div>

        {/* Payroll Runs Table */}
        <div className="rounded-lg border border-ivory/10 bg-ink-2 overflow-hidden">
          <div className="p-4 border-b border-ivory/10">
            <h2 className="text-xl font-medium">Recent Payroll Runs</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ivory/10">
                  <th className="text-left p-4 text-sm font-medium text-ivory-3">Run ID</th>
                  <th className="text-left p-4 text-sm font-medium text-ivory-3">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-ivory-3">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-ivory-3">Amount</th>
                  <th className="text-right p-4 text-sm font-medium text-ivory-3">Recipients</th>
                  <th className="text-right p-4 text-sm font-medium text-ivory-3">Transactions</th>
                  <th className="text-right p-4 text-sm font-medium text-ivory-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockPayrollRuns.map((run) => (
                  <tr
                    key={run.id}
                    className="border-b border-ivory/10 hover:bg-ink transition cursor-pointer"
                    onClick={() => setSelectedRun(run)}
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm">{run.id}</span>
                    </td>
                    <td className="p-4 text-sm text-ivory-3">
                      {formatDate(run.date)}
                    </td>
                    <td className="p-4">
                      <span className={`flex items-center gap-2 ${getStatusColor(run.status)}`}>
                        <span>{getStatusIcon(run.status)}</span>
                        <span className="text-sm capitalize">{run.status}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium">
                      ${run.totalAmount} USDC
                    </td>
                    <td className="p-4 text-right text-ivory-3">
                      {run.recipientCount}
                    </td>
                    <td className="p-4 text-right text-ivory-3">
                      {run.transactionCount}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-lime hover:text-lime/80 text-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Run Details Modal */}
        {selectedRun && (
          <div
            className="fixed inset-0 bg-ink/80 flex items-center justify-center p-6 z-50"
            onClick={() => setSelectedRun(null)}
          >
            <div
              className="bg-ink-2 border border-ivory/10 rounded-lg p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-medium mb-2">Payroll Run Details</h2>
                  <p className="text-ivory-3 font-mono text-sm">{selectedRun.id}</p>
                </div>
                <button
                  onClick={() => setSelectedRun(null)}
                  className="text-ivory-3 hover:text-lime transition text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded bg-ink border border-ivory/10">
                  <div className="text-xs text-ivory-3 mb-1">Status</div>
                  <div className={`text-lg font-medium ${getStatusColor(selectedRun.status)}`}>
                    {getStatusIcon(selectedRun.status)} {selectedRun.status}
                  </div>
                </div>
                <div className="p-4 rounded bg-ink border border-ivory/10">
                  <div className="text-xs text-ivory-3 mb-1">Date</div>
                  <div className="text-lg font-medium">{formatDate(selectedRun.date)}</div>
                </div>
                <div className="p-4 rounded bg-ink border border-ivory/10">
                  <div className="text-xs text-ivory-3 mb-1">Total Amount</div>
                  <div className="text-lg font-medium text-lime">${selectedRun.totalAmount} USDC</div>
                </div>
                <div className="p-4 rounded bg-ink border border-ivory/10">
                  <div className="text-xs text-ivory-3 mb-1">Recipients</div>
                  <div className="text-lg font-medium">{selectedRun.recipientCount} people</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium mb-2">AI Agent Flow</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3 p-3 rounded bg-ink border border-ivory/10">
                    <span className="text-lime">✓</span>
                    <span className="text-ivory-3">Supervisor: Orchestrated workflow</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded bg-ink border border-ivory/10">
                    <span className="text-lime">✓</span>
                    <span className="text-ivory-3">Classifier: Validated {selectedRun.recipientCount} invoices</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded bg-ink border border-ivory/10">
                    <span className="text-lime">✓</span>
                    <span className="text-ivory-3">Treasurer: Optimized corridors via Circle</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded bg-ink border border-ivory/10">
                    <span className="text-lime">✓</span>
                    <span className="text-ivory-3">Gatekeeper: Approved {selectedRun.transactionCount} transactions</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded bg-ink border border-ivory/10">
                    <span className="text-lime">✓</span>
                    <span className="text-ivory-3">Payables: Executed on Arc Network</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Link
                  href="/transactions"
                  className="px-4 py-2 border border-ivory/20 rounded hover:border-lime transition"
                >
                  View Transactions
                </Link>
                <button
                  onClick={() => setSelectedRun(null)}
                  className="px-4 py-2 bg-lime text-ink rounded hover:bg-lime/90 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
