'use client';

export function Footer() {
  return (
    <footer className="py-16 px-6 bg-ink text-ivory border-t border-lime/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-medium text-lime">MIZAN</div>
            <p className="text-sm text-ivory-3">
              Agentic payment infrastructure for SMEs
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-ivory-2">Product</h3>
            <ul className="space-y-2 text-sm text-ivory-3">
              <li>
                <a href="http://localhost:3000/demo" className="hover:text-lime transition">
                  Demo
                </a>
              </li>
              <li>
                <a href="#docs" className="hover:text-lime transition">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/your-username/arcpay" target="_blank" rel="noopener noreferrer" className="hover:text-lime transition">
                  GitHub ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-ivory-2">Resources</h3>
            <ul className="space-y-2 text-sm text-ivory-3">
              <li>
                <a href="https://github.com/your-username/arcpay/blob/main/FORK.md" target="_blank" rel="noopener noreferrer" className="hover:text-lime transition">
                  Attribution
                </a>
              </li>
              <li>
                <a href="https://github.com/your-username/arcpay/blob/main/MIZAN_README.md" target="_blank" rel="noopener noreferrer" className="hover:text-lime transition">
                  Architecture
                </a>
              </li>
              <li>
                <a href="https://testnet.arcscan.app" target="_blank" rel="noopener noreferrer" className="hover:text-lime transition">
                  Arc Explorer ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Built With */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-ivory-2">Built With</h3>
            <ul className="space-y-2 text-sm text-ivory-3">
              <li>Circle USDC</li>
              <li>Arc Network</li>
              <li>LangGraph</li>
              <li>Anthropic Claude</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-ivory/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-ivory-3">
          <div>
            Built on <a href="https://github.com/your-username/arcpay" target="_blank" rel="noopener noreferrer" className="text-lime hover:underline">ArcPay</a> (3 Arc Hackathon awards)
          </div>
          <div className="flex items-center gap-6">
            <span>Stablecoins Commerce Stack Challenge 2026</span>
            <a href="https://circle.com" target="_blank" rel="noopener noreferrer" className="hover:text-lime transition">
              Circle ↗
            </a>
            <a href="https://arc.network" target="_blank" rel="noopener noreferrer" className="hover:text-lime transition">
              Arc ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
