'use client';

import { motion } from 'framer-motion';

export function ArchitectureSection() {
  return (
    <section className="py-32 px-6 bg-sand">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <div className="flex items-center gap-3 mb-12">
            <div className="w-1 h-8 bg-lime" />
            <h2 className="text-xs uppercase tracking-wider text-lime font-medium">
              HOW IT WORKS
            </h2>
          </div>

          <h3 className="text-2xl md:text-3xl font-medium text-forest">
            3-layer architecture: Kaiz → Mizan → ArcPay
          </h3>

          <div className="space-y-6">
            {/* Layer 1 */}
            <div className="p-8 bg-ivory rounded-lg border-l-4 border-lime">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs uppercase text-lime font-medium mb-2">LAYER 1 - NEW</div>
                  <h4 className="text-xl font-medium text-forest">Kaiz (Demo App)</h4>
                </div>
                <div className="px-3 py-1 bg-lime/10 text-lime text-xs rounded">Next.js</div>
              </div>
              <p className="text-forest-dim">
                User-facing application for SMEs. Upload invoices, trigger payroll runs,
                watch agents work in real-time. Built with Next.js 15, React 19, Tailwind CSS.
              </p>
            </div>

            {/* Layer 2 */}
            <div className="p-8 bg-ivory rounded-lg border-l-4 border-lime">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs uppercase text-lime font-medium mb-2">LAYER 2 - NEW</div>
                  <h4 className="text-xl font-medium text-forest">Mizan Orchestration</h4>
                </div>
                <div className="px-3 py-1 bg-lime/10 text-lime text-xs rounded">Python + LangGraph</div>
              </div>
              <p className="text-forest-dim mb-4">
                5 specialist agents orchestrated with LangGraph + Anthropic Claude:
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lime">🎯</span>
                  <span className="text-forest">Supervisor - Routes requests</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">🗂️</span>
                  <span className="text-forest">Classifier - Maps corridors</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-500">💰</span>
                  <span className="text-forest">Treasurer - Optimizes routing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-500">🛡️</span>
                  <span className="text-forest">Gatekeeper - Enforces compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">⚡</span>
                  <span className="text-forest">Payables - Executes payments</span>
                </div>
              </div>
            </div>

            {/* Layer 3 */}
            <div className="p-8 bg-ivory rounded-lg border-l-4 border-forest/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs uppercase text-forest-dim font-medium mb-2">LAYER 3 - INHERITED</div>
                  <h4 className="text-xl font-medium text-forest">ArcPay SDK</h4>
                </div>
                <div className="px-3 py-1 bg-forest/10 text-forest text-xs rounded">TypeScript</div>
              </div>
              <p className="text-forest-dim mb-4">
                Payment primitives: 28 modules, 5 smart contracts, Circle product integration.
                3 Arc Hackathon awards (Best Dev Tools, Best Trustless AI Agent, Best Gateway Micropayments).
              </p>
              <div className="text-xs text-forest-dim">
                USDC · Circle Wallets · CCTP · Gateway · Nanopayments (x402) · Bridge Kit
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://github.com/Ahm3dAlAli/arcpay-main/blob/main/FORK.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-forest text-ivory rounded-lg hover:bg-forest-dim transition"
            >
              See full architecture documentation →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
