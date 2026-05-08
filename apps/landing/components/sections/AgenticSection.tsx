'use client';

import { motion } from 'framer-motion';

export function AgenticSection() {
  return (
    <section className="py-32 px-6 bg-sand">
      <div className="max-w-4xl mx-auto">
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
              AGENTIC ECONOMY
            </h2>
          </div>

          <div className="space-y-8 text-forest">
            <h3 className="text-2xl md:text-3xl font-medium">
              Building payment infrastructure for autonomous agents
            </h3>

            <p className="text-lg leading-relaxed">
              Mizan competes in <strong>Track 1</strong> (Cross-Border Payments) and{' '}
              <strong>Track 4</strong> (Agentic Economy) of the Stablecoins Commerce Stack Challenge.
            </p>

            <div className="space-y-6">
              <div className="p-6 bg-ivory rounded-lg border border-forest/10">
                <div className="text-sm text-lime font-medium mb-2">TRACK 1: CROSS-BORDER PAYMENTS</div>
                <p className="text-base text-forest-dim">
                  5 UAE corridors enable instant USDC settlement to Philippines, India, Egypt,
                  Pakistan, and Nigeria. Sub-3s settlement times with full FX routing and
                  compliance checks.
                </p>
              </div>

              <div className="p-6 bg-ivory rounded-lg border border-forest/10">
                <div className="text-sm text-lime font-medium mb-2">TRACK 4: AGENTIC ECONOMY</div>
                <p className="text-base text-forest-dim">
                  5 specialist agents (Supervisor, Classifier, Treasurer, Gatekeeper, Payables)
                  orchestrate payments autonomously using LangGraph + Claude. Every decision
                  includes full reasoning traces.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h4 className="font-medium">Why agents need specialized infrastructure:</h4>
              <ul className="space-y-3 text-base text-forest-dim">
                <li className="flex items-start gap-3">
                  <span className="text-lime mt-1">1.</span>
                  <span>
                    <strong className="text-forest">Semantic abstractions:</strong> Agents don't
                    think in RPC calls—they think in corridors, counterparties, compliance rules.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lime mt-1">2.</span>
                  <span>
                    <strong className="text-forest">Reasoning persistence:</strong> Every payment
                    needs an audit trail showing <em>why</em> the agent made that decision.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lime mt-1">3.</span>
                  <span>
                    <strong className="text-forest">Multi-agent orchestration:</strong> Complex
                    operations (like payroll) require specialists working in sequence.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-12 p-8 bg-forest text-ivory rounded-lg">
              <div className="text-2xl font-medium mb-4">
                "Mizan is payment infrastructure for the agentic economy."
              </div>
              <p className="text-ivory-2">
                In 2026, we're building the substrate that lets autonomous agents handle
                financial operations—procurement, treasury, payroll—with the same clarity
                and compliance that humans expect.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
