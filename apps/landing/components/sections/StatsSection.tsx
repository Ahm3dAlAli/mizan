'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '5', label: 'Specialist Agents', sublabel: 'LangGraph orchestration' },
  { value: '5', label: 'Payment Corridors', sublabel: 'UAE → Global lanes' },
  { value: '5', label: 'Circle Products', sublabel: 'USDC, Wallets, CCTP, Gateway, x402' },
  { value: '5', label: 'Smart Contracts', sublabel: 'Deployed on Arc Testnet' },
  { value: '3s', label: 'Settlement Time', sublabel: 'Average corridor speed' },
  { value: '1.0%', label: 'Corridor Fees', sublabel: 'Lower than Wise average' },
  { value: '28', label: 'Payment Modules', sublabel: 'Inherited from ArcPay' },
  { value: '100%', label: 'Transparent', sublabel: 'Full reasoning traces' },
];

export function StatsSection() {
  return (
    <section className="py-32 px-6 bg-bg-dark text-text-on-dark">
      <div className="max-w-7xl mx-auto">
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
              BY THE NUMBERS
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="space-y-2"
              >
                <div className="text-h2 font-medium text-green">
                  {stat.value}
                </div>
                <div className="text-body-s font-medium text-text-on-dark">
                  {stat.label}
                </div>
                <div className="text-body-s text-text-on-dark-2">
                  {stat.sublabel}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-bg-elev rounded-lg border border-line shadow-card">
            <h3 className="text-h4 font-medium mb-4 text-text">What these numbers mean</h3>
            <div className="grid md:grid-cols-2 gap-6 text-body-s text-text-2">
              <div>
                <strong className="text-text">For SMEs:</strong> Payroll that used to take 3 hours
                and 2-5 days now takes 3 lines of code and 15 seconds.
              </div>
              <div>
                <strong className="text-text">For agents:</strong> First payment infrastructure
                that speaks their language—corridors, reasoning traces, compliance posture.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
