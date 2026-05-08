'use client';

export function Footer() {
  return (
    <footer className="py-16 px-6 bg-bg-dark text-text-on-dark border-t border-line-on-dark">
      <div className="max-w-container mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-h4 font-medium text-green">MIZAN</div>
            <p className="text-body-s text-text-on-dark-2">
              Agentic payment infrastructure for SMEs
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-eyebrow font-medium text-text-on-dark">PRODUCT</h3>
            <ul className="space-y-2 text-body-s text-text-on-dark-2">
              <li>
                <a href="http://localhost:3000/demo" className="hover:text-green transition">
                  Demo
                </a>
              </li>
              <li>
                <a href="#docs" className="hover:text-green transition">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/Ahm3dAlAli/arcpay-main" target="_blank" rel="noopener noreferrer" className="hover:text-green transition">
                  GitHub ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-eyebrow font-medium text-text-on-dark">RESOURCES</h3>
            <ul className="space-y-2 text-body-s text-text-on-dark-2">
              <li>
                <a href="https://github.com/Ahm3dAlAli/arcpay-main/blob/main/FORK.md" target="_blank" rel="noopener noreferrer" className="hover:text-green transition">
                  Attribution
                </a>
              </li>
              <li>
                <a href="https://github.com/Ahm3dAlAli/arcpay-main/blob/main/MIZAN_README.md" target="_blank" rel="noopener noreferrer" className="hover:text-green transition">
                  Architecture
                </a>
              </li>
              <li>
                <a href="https://testnet.arcscan.app" target="_blank" rel="noopener noreferrer" className="hover:text-green transition">
                  Arc Explorer ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Built With */}
          <div className="space-y-4">
            <h3 className="text-eyebrow font-medium text-text-on-dark">BUILT WITH</h3>
            <ul className="space-y-2 text-body-s text-text-on-dark-2">
              <li>Circle USDC</li>
              <li>Arc Network</li>
              <li>LangGraph</li>
              <li>Anthropic Claude</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-line-on-dark flex flex-col md:flex-row items-center justify-between gap-4 text-body-s text-text-on-dark-2">
          <div>
            Built on <a href="https://github.com/Ahm3dAlAli/arcpay-main" target="_blank" rel="noopener noreferrer" className="text-green hover:underline">ArcPay</a> (3 Arc Hackathon awards)
          </div>
          <div className="flex items-center gap-6">
            <span>Stablecoins Commerce Stack Challenge 2026</span>
            <a href="https://circle.com" target="_blank" rel="noopener noreferrer" className="hover:text-green transition">
              Circle ↗
            </a>
            <a href="https://arc.network" target="_blank" rel="noopener noreferrer" className="hover:text-green transition">
              Arc ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
