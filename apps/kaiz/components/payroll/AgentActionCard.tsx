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
    color: 'text-green',
    bgColor: 'bg-green-tint',
    borderColor: 'border-green',
    icon: '🎯',
  },
  classifier: {
    name: 'Classifier',
    color: 'text-green-2',
    bgColor: 'bg-green-tint',
    borderColor: 'border-green-2',
    icon: '🗂️',
  },
  treasurer: {
    name: 'Treasurer',
    color: 'text-warn',
    bgColor: 'bg-warn/10',
    borderColor: 'border-warn',
    icon: '💰',
  },
  gatekeeper: {
    name: 'Gatekeeper',
    color: 'text-neg',
    bgColor: 'bg-neg/10',
    borderColor: 'border-neg',
    icon: '🛡️',
  },
  payables: {
    name: 'Payables',
    color: 'text-green',
    bgColor: 'bg-green-tint',
    borderColor: 'border-green',
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
      className={`p-6 rounded-lg border ${config.borderColor} ${config.bgColor} animate-in slide-in-from-left duration-500 shadow-card`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-h3">{config.icon}</span>
          <div>
            <h3 className={`text-body-l font-medium ${config.color}`}>
              {config.name}
            </h3>
            <p className="text-body-s text-text-2">{action}</p>
          </div>
        </div>
        <div className="text-eyebrow text-text-3 font-mono">{formattedTime}</div>
      </div>

      {/* Reasoning */}
      <div className="mb-4">
        <p className="text-body-s text-text leading-relaxed">{reasoning}</p>
      </div>

      {/* Tools Called */}
      {toolsCalled.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-eyebrow text-text-3">Tools:</span>
          {toolsCalled.map((tool) => (
            <span
              key={tool}
              className="px-2 py-1 bg-bg-2 rounded text-eyebrow font-mono text-text-2"
            >
              {tool}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
