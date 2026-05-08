import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-medium mb-4">Dashboard</h1>
          <p className="text-ivory-3 text-lg">
            AI-powered payroll for the agentic economy
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-lg border border-ivory/10 bg-ink-2">
            <div className="text-sm text-ivory-3 mb-2">Pending Invoices</div>
            <div className="text-3xl font-medium text-lime mb-1">12</div>
            <div className="text-xs text-ivory-3">$45,230 USDC</div>
          </div>

          <div className="p-6 rounded-lg border border-ivory/10 bg-ink-2">
            <div className="text-sm text-ivory-3 mb-2">Total Volume (30d)</div>
            <div className="text-3xl font-medium text-lime mb-1">$892K</div>
            <div className="text-xs text-ivory-3">183 transactions</div>
          </div>

          <div className="p-6 rounded-lg border border-ivory/10 bg-ink-2">
            <div className="text-sm text-ivory-3 mb-2">Active Freelancers</div>
            <div className="text-3xl font-medium text-lime mb-1">47</div>
            <div className="text-xs text-ivory-3">Across 12 countries</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-medium mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/demo"
              className="p-8 rounded-lg border border-lime/20 bg-lime/5 hover:bg-lime/10 transition group"
            >
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-medium mb-2 group-hover:text-lime transition">
                Quick Demo
              </h3>
              <p className="text-ivory-3">
                Watch AI agents process a payroll batch in real-time
              </p>
            </Link>

            <div className="p-8 rounded-lg border border-ivory/10 bg-ink-2 opacity-50">
              <div className="text-4xl mb-4">📤</div>
              <h3 className="text-xl font-medium mb-2">Upload Invoices</h3>
              <p className="text-ivory-3">Coming soon: Bulk upload via CSV</p>
            </div>
          </div>
        </div>

        {/* Architecture Overview */}
        <div className="p-8 rounded-lg border border-ivory/10 bg-ink-2">
          <h2 className="text-2xl font-medium mb-6">How It Works</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-lime/10 flex items-center justify-center text-lime flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-medium mb-1">Upload Invoices</h3>
                <p className="text-ivory-3 text-sm">
                  Batch upload CSV files with recipient details, amounts, and destination countries
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-lime/10 flex items-center justify-center text-lime flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-medium mb-1">AI Agents Process</h3>
                <p className="text-ivory-3 text-sm">
                  5 specialist agents (Supervisor, Classifier, Treasurer, Gatekeeper, Payables) orchestrate the payment flow using LangGraph + Claude
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-lime/10 flex items-center justify-center text-lime flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-medium mb-1">Instant Settlement</h3>
                <p className="text-ivory-3 text-sm">
                  Circle USDC settles on Arc Network in under 3 seconds via optimized cross-border corridors (UAE → 5 destinations)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-12 p-8 rounded-lg border border-ivory/10 bg-ink-2">
          <h2 className="text-2xl font-medium mb-6">Powered By</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🟢</div>
              <div className="text-sm font-medium">Circle USDC</div>
              <div className="text-xs text-ivory-3">Settlement rail</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌐</div>
              <div className="text-sm font-medium">Arc Network</div>
              <div className="text-xs text-ivory-3">Blockchain layer</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🤖</div>
              <div className="text-sm font-medium">LangGraph</div>
              <div className="text-xs text-ivory-3">Agent orchestration</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🧠</div>
              <div className="text-sm font-medium">Claude</div>
              <div className="text-xs text-ivory-3">AI reasoning</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
