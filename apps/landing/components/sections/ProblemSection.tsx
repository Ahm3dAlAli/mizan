'use client';

import { motion } from 'framer-motion';

export function ProblemSection() {
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
              THE PROBLEM
            </h2>
          </div>

          <div className="space-y-6 text-text">
            <h3 className="text-h3 font-medium">
              A Dubai digital agency has 47 freelancers across 12 countries.
            </h3>

            <p className="text-body-l leading-relaxed">
              Every month, the finance lead manually:
            </p>

            <ul className="space-y-3 text-body-s">
              <li className="flex items-start gap-3">
                <span className="text-green mt-1">1.</span>
                <span>Downloads CSV exports from invoicing tool</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green mt-1">2.</span>
                <span>Groups by country, checks FX rates on 3 sites</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green mt-1">3.</span>
                <span>Opens Wise, initiates 47 transfers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green mt-1">4.</span>
                <span>Waits 2-5 days for settlement</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green mt-1">5.</span>
                <span>Pays $520 in fees (1.15% average)</span>
              </li>
            </ul>

            <p className="text-body-l leading-relaxed">
              This is a 3-hour monthly ritual. It's error-prone, expensive, and doesn't scale.
            </p>

            <div className="mt-8 p-6 bg-bg-2 rounded-lg border border-line">
              <p className="text-body-s text-text-2 italic">
                "I wish I could just tell a system: 'Pay everyone on this list,' and have it
                figure out the corridors, FX, and compliance. And I want a receipt that shows
                me the reasoning."
              </p>
              <p className="text-body-s text-text mt-2">
                — Finance lead, Dubai digital agency
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
