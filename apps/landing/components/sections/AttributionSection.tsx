'use client';

import { motion } from 'framer-motion';

export function AttributionSection() {
  return (
    <section className="py-32 px-6 bg-ivory border-y border-lime/20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3 mb-12">
            <div className="w-1 h-8 bg-lime" />
            <h2 className="text-xs uppercase tracking-wider text-lime font-medium">
              INFRASTRUCTURE STANDS ON INFRASTRUCTURE
            </h2>
          </div>

          <div className="space-y-6 text-forest">
            <p className="text-lg leading-relaxed">
              Mizan extends <strong>ArcPay</strong>—the 3-award-winning Arc SDK by Himess
              (MIT, January 2026 Arc Hackathon: Best Dev Tools, Best Trustless AI Agent,
              Best Gateway-Based Micropayments).
            </p>

            <p className="text-lg leading-relaxed">
              ArcPay solved the payment-primitive layer. Mizan adds the layers above it that
              agents and SMEs need:
            </p>

            <div className="space-y-3 text-base">
              <div className="flex items-start gap-3">
                <span className="text-lime mt-1">▸</span>
                <div>
                  <strong>Corridor configurations</strong>
                  <span className="text-forest-dim ml-2">5 UAE → Global lanes</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lime mt-1">▸</span>
                <div>
                  <strong>Multi-agent orchestration</strong>
                  <span className="text-forest-dim ml-2">LangGraph, 5 specialists</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lime mt-1">▸</span>
                <div>
                  <strong>SME demo application</strong>
                  <span className="text-forest-dim ml-2">Dubai agency payroll, e2e</span>
                </div>
              </div>
            </div>

            <a
              href="https://github.com/Ahm3dAlAli/arcpay-main/blob/main/FORK.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-lime hover:underline mt-4"
            >
              See the full attribution and originality table →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
