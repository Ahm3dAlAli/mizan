interface TransactionCardProps {
  recipient: string;
  amount: string;
  currency: string;
  corridor: string;
  status: 'pending' | 'processing' | 'settled' | 'failed';
  txHash: string;
  timestamp: string;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    icon: '⏳',
  },
  processing: {
    label: 'Processing',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    icon: '⚙️',
  },
  settled: {
    label: 'Settled',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    icon: '✅',
  },
  failed: {
    label: 'Failed',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    icon: '❌',
  },
};

export function TransactionCard({
  recipient,
  amount,
  currency,
  corridor,
  status,
  txHash,
  timestamp,
}: TransactionCardProps) {
  const config = statusConfig[status];
  const formattedTime = new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const explorerUrl = `https://testnet.arcscan.app/tx/${txHash}`;
  const shortHash = `${txHash.slice(0, 6)}...${txHash.slice(-4)}`;

  return (
    <div className="p-6 rounded-lg border border-ivory/10 bg-ink-2 hover:border-lime/20 transition animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-ivory mb-1">{recipient}</h3>
          <p className="text-sm text-ivory-3">{corridor}</p>
        </div>
        <div className={`px-3 py-1 rounded-full ${config.bgColor} flex items-center gap-2`}>
          <span>{config.icon}</span>
          <span className={`text-sm font-medium ${config.color}`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <div className="text-3xl font-medium text-lime">
          {parseFloat(amount).toLocaleString()} {currency}
        </div>
      </div>

      {/* Transaction Details */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-ivory-3 hover:text-lime transition flex items-center gap-1"
          >
            <span>🔗</span>
            <span>{shortHash}</span>
          </a>
          <span className="text-ivory-3 font-mono">{formattedTime}</span>
        </div>
      </div>
    </div>
  );
}
