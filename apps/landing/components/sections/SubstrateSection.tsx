'use client';

import { motion } from 'framer-motion';

const solutionCode = `// The finance lead uploads invoices.csv:
const run = await mizan.agent('payroll', {
  invoices: './freelancers_july.csv',
  rules: 'strict'
})

// 5 agents orchestrate in 15 seconds:
//
// Supervisor   → Routes request to specialists
// Classifier   → Maps to corridors (UAE→PH, UAE→IN, UAE→EG)
// Treasurer    → Checks balance, optimizes routing
// Gatekeeper   → Enforces sanctions, KYC, limits
// Payables     → Executes via Circle USDC on Arc

console.log(run.status)
// { settled: 47, failed: 0, time: 14.2s }

// Every transaction includes reasoning:
run.transactions[0].reasoning
// "Routed via UAE-Philippines corridor.
//  FX: 1 USD = 56.8 PHP. Compliance: ✓ KYC verified.
//  Settlement: 2.8s on Arc Testnet."`;

export function SubstrateSection() {
  return (
    <section className="py-32 px-6 bg-ink text-ivory">
      <div className="max-w-5xl mx-auto">
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
              THE SUBSTRATE
            </h2>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl md:text-3xl font-medium">
              With Mizan, that same payroll run is 3 lines of code.
            </h3>

            <div className="bg-ink-2 rounded-lg p-6 border border-lime/20">
              <pre className="font-mono text-sm text-ivory-2 overflow-x-auto">
                <code>{solutionCode}</code>
              </pre>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-4xl text-lime">3s</div>
                <div className="text-sm text-ivory-3">
                  Average settlement time (vs 2-5 days)
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl text-lime">1.0%</div>
                <div className="text-sm text-ivory-3">
                  Corridor fees (vs 1.15% Wise average)
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl text-lime">100%</div>
                <div className="text-sm text-ivory-3">
                  Transparent reasoning traces
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
