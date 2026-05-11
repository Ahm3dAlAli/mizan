interface ComplianceInfo {
  passed: boolean;
  risk_level: 'low' | 'medium' | 'high' | 'unknown';
  checks_performed: string[];
  details: string;
}

interface TransactionCardProps {
  recipient: string;
  amount: string;
  currency: string;
  corridor: string;
  status: 'pending' | 'processing' | 'settled' | 'failed';
  txHash: string;
  timestamp: string;
  compliance?: ComplianceInfo;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'text-warn',
    bgColor: 'bg-warn/10',
    icon: '⏳',
  },
  processing: {
    label: 'Processing',
    color: 'text-green-2',
    bgColor: 'bg-green-tint',
    icon: '⚙️',
  },
  settled: {
    label: 'Settled',
    color: 'text-green',
    bgColor: 'bg-green-tint',
    icon: '✅',
  },
  failed: {
    label: 'Failed',
    color: 'text-neg',
    bgColor: 'bg-neg/10',
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
  compliance,
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
    <div className="p-6 rounded-lg border border-line bg-bg-elev hover:border-green transition animate-in slide-in-from-bottom duration-300 shadow-card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-body-l font-medium text-text mb-1">{recipient}</h3>
          <p className="text-body-s text-text-2">{corridor}</p>
        </div>
        <div className={`px-3 py-1 rounded-full ${config.bgColor} flex items-center gap-2`}>
          <span>{config.icon}</span>
          <span className={`text-body-s font-medium ${config.color}`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <div className="text-h3 font-medium text-green">
          {parseFloat(amount).toLocaleString()} {currency}
        </div>
      </div>

      {/* Compliance Badge */}
      {compliance && (
        <div className="mb-3 p-2 bg-bg-2 rounded border border-line">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-body-xs text-text-2">Compliance:</span>
              <span className={`text-body-xs font-medium ${
                compliance.risk_level === 'low' ? 'text-green' :
                compliance.risk_level === 'medium' ? 'text-warn' :
                'text-neg'
              }`}>
                {compliance.risk_level.toUpperCase()} RISK
              </span>
            </div>
            <span className="text-body-xs text-text-3">
              via Exa
            </span>
          </div>
          {compliance.details && (
            <p className="text-body-xs text-text-3 mt-1">{compliance.details}</p>
          )}
        </div>
      )}

      {/* Transaction Details */}
      <div className="flex items-center justify-between text-body-s">
        <div className="flex items-center gap-4">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-text-2 hover:text-green transition flex items-center gap-1"
          >
            <span>🔗</span>
            <span>{shortHash}</span>
          </a>
          <span className="text-text-3 font-mono">{formattedTime}</span>
        </div>
      </div>
    </div>
  );
}
