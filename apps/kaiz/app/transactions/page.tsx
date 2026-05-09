'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Transaction {
  id: string;
  txHash: string;
  recipient: string;
  recipientAddress: string;
  amount: string;
  currency: string;
  corridor: string;
  status: 'settled' | 'pending' | 'failed';
  timestamp: string;
  settlementTime?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'tx_001',
    txHash: '0x9876543210abcdef...',
    recipient: 'Maria Santos',
    recipientAddress: '0x1234567890abcdef...',
    amount: '8,500',
    currency: 'PHP',
    corridor: 'UAE → Philippines',
    status: 'settled',
    timestamp: '2026-05-08T14:35:22Z',
    settlementTime: '2.3s',
  },
  {
    id: 'tx_002',
    txHash: '0xabcdef1234567890...',
    recipient: 'Rajesh Kumar',
    recipientAddress: '0xfedcba0987654321...',
    amount: '12,000',
    currency: 'INR',
    corridor: 'UAE → India',
    status: 'settled',
    timestamp: '2026-05-08T14:35:18Z',
    settlementTime: '2.1s',
  },
  {
    id: 'tx_003',
    txHash: '0x1122334455667788...',
    recipient: 'Ahmed Hassan',
    recipientAddress: '0x8877665544332211...',
    amount: '6,500',
    currency: 'EGP',
    corridor: 'UAE → Egypt',
    status: 'settled',
    timestamp: '2026-05-08T14:35:14Z',
    settlementTime: '1.9s',
  },
  {
    id: 'tx_004',
    txHash: '0xaabbccddeeff0011...',
    recipient: 'Fatima Al-Rashid',
    recipientAddress: '0x1100ffeeddccbbaa...',
    amount: '9,200',
    currency: 'SAR',
    corridor: 'UAE → Saudi Arabia',
    status: 'settled',
    timestamp: '2026-05-01T10:20:45Z',
    settlementTime: '2.5s',
  },
  {
    id: 'tx_005',
    txHash: '0x2233445566778899...',
    recipient: 'Oluwaseun Adebayo',
    recipientAddress: '0x9988776655443322...',
    amount: '15,000',
    currency: 'NGN',
    corridor: 'UAE → Nigeria',
    status: 'settled',
    timestamp: '2026-05-01T10:20:41Z',
    settlementTime: '2.7s',
  },
];

export default function TransactionsPage() {
  const [filter, setFilter] = useState<'all' | 'settled' | 'pending' | 'failed'>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filteredTransactions = mockTransactions.filter(
    (tx) => filter === 'all' || tx.status === filter
  );

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'settled':
        return 'text-lime';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'settled':
        return '✓';
      case 'pending':
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

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-ink">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-ivory-3 hover:text-lime mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-medium mb-4">Transaction History</h1>
          <p className="text-ivory-3 text-lg">
            All blockchain transactions executed on Arc Network
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg border border-ivory/10 bg-ink-2">
            <div className="text-xs text-ivory-3 mb-1">Total Transactions</div>
            <div className="text-2xl font-medium text-lime">{mockTransactions.length}</div>
          </div>
          <div className="p-4 rounded-lg border border-ivory/10 bg-ink-2">
            <div className="text-xs text-ivory-3 mb-1">Total Volume</div>
            <div className="text-2xl font-medium text-lime">
              ${mockTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount.replace(/,/g, '')), 0).toLocaleString()} USDC
            </div>
          </div>
          <div className="p-4 rounded-lg border border-ivory/10 bg-ink-2">
            <div className="text-xs text-ivory-3 mb-1">Avg Settlement</div>
            <div className="text-2xl font-medium text-lime">2.3s</div>
          </div>
          <div className="p-4 rounded-lg border border-ivory/10 bg-ink-2">
            <div className="text-xs text-ivory-3 mb-1">Success Rate</div>
            <div className="text-2xl font-medium text-lime">100%</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'settled', 'pending', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as typeof filter)}
              className={`px-4 py-2 rounded-lg capitalize transition ${
                filter === status
                  ? 'bg-lime text-ink'
                  : 'bg-ink-2 border border-ivory/10 hover:border-ivory/20'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="rounded-lg border border-ivory/10 bg-ink-2 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ivory/10">
                  <th className="text-left p-4 text-sm font-medium text-ivory-3">Transaction</th>
                  <th className="text-left p-4 text-sm font-medium text-ivory-3">Recipient</th>
                  <th className="text-left p-4 text-sm font-medium text-ivory-3">Corridor</th>
                  <th className="text-right p-4 text-sm font-medium text-ivory-3">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-ivory-3">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-ivory-3">Settlement</th>
                  <th className="text-left p-4 text-sm font-medium text-ivory-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-ivory/10 hover:bg-ink transition cursor-pointer"
                    onClick={() => setSelectedTx(tx)}
                  >
                    <td className="p-4">
                      <div className="font-mono text-sm text-lime">{truncateAddress(tx.txHash)}</div>
                      <div className="text-xs text-ivory-3 mt-1">{tx.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{tx.recipient}</div>
                      <div className="text-xs text-ivory-3 font-mono">{truncateAddress(tx.recipientAddress)}</div>
                    </td>
                    <td className="p-4 text-sm text-ivory-3">
                      {tx.corridor}
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-medium">{tx.amount} {tx.currency}</div>
                      <div className="text-xs text-ivory-3">≈ USDC</div>
                    </td>
                    <td className="p-4">
                      <span className={`flex items-center gap-2 ${getStatusColor(tx.status)}`}>
                        <span>{getStatusIcon(tx.status)}</span>
                        <span className="text-sm capitalize">{tx.status}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right text-lime">
                      {tx.settlementTime || '-'}
                    </td>
                    <td className="p-4 text-sm text-ivory-3">
                      {formatDate(tx.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Details Modal */}
        {selectedTx && (
          <div
            className="fixed inset-0 bg-ink/80 flex items-center justify-center p-6 z-50"
            onClick={() => setSelectedTx(null)}
          >
            <div
              className="bg-ink-2 border border-ivory/10 rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-medium mb-2">Transaction Details</h2>
                  <p className="text-ivory-3 font-mono text-sm">{selectedTx.id}</p>
                </div>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="text-ivory-3 hover:text-lime transition text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Status Card */}
                <div className={`p-4 rounded-lg border ${
                  selectedTx.status === 'settled'
                    ? 'border-lime/20 bg-lime/5'
                    : 'border-ivory/10 bg-ink'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-lg font-medium ${getStatusColor(selectedTx.status)}`}>
                      {getStatusIcon(selectedTx.status)} {selectedTx.status.toUpperCase()}
                    </span>
                    {selectedTx.settlementTime && (
                      <span className="text-sm text-ivory-3">
                        Settled in {selectedTx.settlementTime}
                      </span>
                    )}
                  </div>
                </div>

                {/* Transaction Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded bg-ink border border-ivory/10">
                    <div className="text-xs text-ivory-3 mb-1">Transaction Hash</div>
                    <div className="font-mono text-sm break-all">{selectedTx.txHash}</div>
                  </div>
                  <div className="p-4 rounded bg-ink border border-ivory/10">
                    <div className="text-xs text-ivory-3 mb-1">Timestamp</div>
                    <div className="text-sm">{formatDate(selectedTx.timestamp)}</div>
                  </div>
                </div>

                {/* Recipient Info */}
                <div className="p-4 rounded bg-ink border border-ivory/10">
                  <div className="text-xs text-ivory-3 mb-2">Recipient</div>
                  <div className="font-medium mb-1">{selectedTx.recipient}</div>
                  <div className="font-mono text-sm text-ivory-3 break-all">{selectedTx.recipientAddress}</div>
                </div>

                {/* Payment Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded bg-ink border border-ivory/10">
                    <div className="text-xs text-ivory-3 mb-1">Amount</div>
                    <div className="text-xl font-medium text-lime">{selectedTx.amount} {selectedTx.currency}</div>
                  </div>
                  <div className="p-4 rounded bg-ink border border-ivory/10">
                    <div className="text-xs text-ivory-3 mb-1">Corridor</div>
                    <div className="text-lg font-medium">{selectedTx.corridor}</div>
                  </div>
                </div>

                {/* Network Info */}
                <div className="p-4 rounded bg-ink border border-ivory/10">
                  <div className="text-xs text-ivory-3 mb-3">Network Details</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-ivory-3">Network</span>
                      <span className="font-medium">Arc Testnet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ivory-3">Chain ID</span>
                      <span className="font-medium">5042002</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ivory-3">Settlement Token</span>
                      <span className="font-medium">Circle USDC</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-ivory/10">
                  <a
                    href={`https://testnet.arcscan.app/tx/${selectedTx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-ivory/20 rounded hover:border-lime transition"
                  >
                    View on Explorer ↗
                  </a>
                  <button
                    onClick={() => setSelectedTx(null)}
                    className="px-4 py-2 bg-lime text-ink rounded hover:bg-lime/90 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
