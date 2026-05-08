interface AgentActionCardProps {
  agent: 'supervisor' | 'classifier' | 'treasurer' | 'payables' | 'gatekeeper';
  action: string;
  reasoning: string;
  toolsCalled: string[];
  timestamp: string;
}

const agentConfig = {
  supervisor: {
    name: 'Supervisor',
    color: 'text-lime',
    bgColor: 'bg-lime/10',
    borderColor: 'border-lime/20',
    icon: '🎯',
  },
  classifier: {
    name: 'Classifier',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20',
    icon: '🗂️',
  },
  treasurer: {
    name: 'Treasurer',
    color: 'text-pink-400',
    bgColor: 'bg-pink-400/10',
    borderColor: 'border-pink-400/20',
    icon: '💰',
  },
  gatekeeper: {
    name: 'Gatekeeper',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/20',
    icon: '🛡️',
  },
  payables: {
    name: 'Payables',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20',
    icon: '⚡',
  },
};

export function AgentActionCard({
  agent,
  action,
  reasoning,
  toolsCalled,
  timestamp,
}: AgentActionCardProps) {
  const config = agentConfig[agent];
  const formattedTime = new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div
      className={`p-6 rounded-lg border ${config.borderColor} ${config.bgColor} animate-in slide-in-from-left duration-500`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <h3 className={`text-lg font-medium ${config.color}`}>
              {config.name}
            </h3>
            <p className="text-sm text-ivory-3">{action}</p>
          </div>
        </div>
        <div className="text-xs text-ivory-3 font-mono">{formattedTime}</div>
      </div>

      {/* Reasoning */}
      <div className="mb-4">
        <p className="text-ivory-2 leading-relaxed">{reasoning}</p>
      </div>

      {/* Tools Called */}
      {toolsCalled.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-ivory-3">Tools:</span>
          {toolsCalled.map((tool) => (
            <span
              key={tool}
              className="px-2 py-1 bg-ink-3 rounded text-xs font-mono text-ivory-3"
            >
              {tool}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
