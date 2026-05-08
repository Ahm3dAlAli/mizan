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
    <section className="py-32 px-6 bg-bg-dark text-text-on-dark">
      <div className="max-w-5xl mx-auto">
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
              THE SUBSTRATE
            </h2>
          </div>

          <div className="space-y-8">
            <h3 className="text-h3 font-medium">
              With Mizan, that same payroll run is 3 lines of code.
            </h3>

            <div className="bg-bg-elev rounded-lg p-6 border border-line shadow-card">
              <pre className="font-mono text-body-s text-text overflow-x-auto">
                <code>{solutionCode}</code>
              </pre>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-h2 text-green">3s</div>
                <div className="text-body-s text-text-on-dark-2">
                  Average settlement time (vs 2-5 days)
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-h2 text-green">1.0%</div>
                <div className="text-body-s text-text-on-dark-2">
                  Corridor fees (vs 1.15% Wise average)
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-h2 text-green">100%</div>
                <div className="text-body-s text-text-on-dark-2">
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
