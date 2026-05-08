'use client';

import { motion } from 'framer-motion';

export function ArchitectureSection() {
  return (
    <section className="py-32 px-6 bg-bg">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <div className="flex items-center gap-3 mb-12">
            <div className="w-1 h-8 bg-green" />
            <h2 className="text-eyebrow text-green">
              HOW IT WORKS
            </h2>
          </div>

          <h3 className="text-h3 font-medium text-text">
            3-layer architecture: Kaiz → Mizan → ArcPay
          </h3>

          <div className="space-y-6">
            {/* Layer 1 */}
            <div className="p-8 bg-bg-elev rounded-lg border-l-4 border-green shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-eyebrow text-green mb-2">LAYER 1 - NEW</div>
                  <h4 className="text-h4 font-medium text-text">Kaiz (Demo App)</h4>
                </div>
                <div className="px-3 py-1 bg-green-tint text-green text-eyebrow rounded">Next.js</div>
              </div>
              <p className="text-body-s text-text-2">
                User-facing application for SMEs. Upload invoices, trigger payroll runs,
                watch agents work in real-time. Built with Next.js 15, React 19, Tailwind CSS.
              </p>
            </div>

            {/* Layer 2 */}
            <div className="p-8 bg-bg-elev rounded-lg border-l-4 border-green shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-eyebrow text-green mb-2">LAYER 2 - NEW</div>
                  <h4 className="text-h4 font-medium text-text">Mizan Orchestration</h4>
                </div>
                <div className="px-3 py-1 bg-green-tint text-green text-eyebrow rounded">Python + LangGraph</div>
              </div>
              <p className="text-body-s text-text-2 mb-4">
                5 specialist agents orchestrated with LangGraph + Anthropic Claude:
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-body-s">
                <div className="flex items-center gap-2">
                  <span className="text-green">🎯</span>
                  <span className="text-text">Supervisor - Routes requests</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-2">🗂️</span>
                  <span className="text-text">Classifier - Maps corridors</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-warn">💰</span>
                  <span className="text-text">Treasurer - Optimizes routing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neg">🛡️</span>
                  <span className="text-text">Gatekeeper - Enforces compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green">⚡</span>
                  <span className="text-text">Payables - Executes payments</span>
                </div>
              </div>
            </div>

            {/* Layer 3 */}
            <div className="p-8 bg-bg-elev rounded-lg border-l-4 border-text-3 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-eyebrow text-text-3 mb-2">LAYER 3 - INHERITED</div>
                  <h4 className="text-h4 font-medium text-text">ArcPay SDK</h4>
                </div>
                <div className="px-3 py-1 bg-bg-2 text-text text-eyebrow rounded">TypeScript</div>
              </div>
              <p className="text-body-s text-text-2 mb-4">
                Payment primitives: 28 modules, 5 smart contracts, Circle product integration.
                3 Arc Hackathon awards (Best Dev Tools, Best Trustless AI Agent, Best Gateway Micropayments).
              </p>
              <div className="text-body-s text-text-3">
                USDC · Circle Wallets · CCTP · Gateway · Nanopayments (x402) · Bridge Kit
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://github.com/Ahm3dAlAli/arcpay-main/blob/main/FORK.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-green text-bg-elev rounded-lg hover:bg-green-2 transition shadow-sm"
            >
              See full architecture documentation →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
