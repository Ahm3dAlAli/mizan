'use client';

import { motion } from 'framer-motion';

export function ThesisSection() {
  return (
    <section className="py-32 px-6 bg-bg">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3 mb-12">
            <div className="w-1 h-8 bg-green" />
            <h2 className="text-eyebrow text-green">
              THESIS
            </h2>
          </div>

          <div className="space-y-8 text-text">
            <p className="text-body-l leading-relaxed">
              The next generation of SMEs will operate as networks of autonomous agents.
              Procurement agents will negotiate with vendor agents. Treasury agents will
              rebalance capital across chains. CFO agents will run payroll without a human
              in the monthly loop.
            </p>

            <p className="text-body-l leading-relaxed">
              The financial primitives those agents need do not yet exist. Wallets exist.
              Stablecoins exist. Cross-chain bridges exist. But there is no substrate that
              lets an agent describe a payment in terms an SME finance lead would recognize—by
              corridor, by counterparty, by compliance posture, by reasoning trace.
            </p>

            <p className="text-h3 font-medium">
              Mizan is that substrate.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
