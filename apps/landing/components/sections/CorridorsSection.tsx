'use client';

import { motion } from 'framer-motion';

const corridors = [
  { from: 'UAE', to: 'Philippines', fx: 'AED → PHP', fee: '1.0%', time: '3s', color: 'green' },
  { from: 'UAE', to: 'India', fx: 'AED → INR', fee: '1.0%', time: '3s', color: 'green-2' },
  { from: 'UAE', to: 'Egypt', fx: 'AED → EGP', fee: '0.8%', time: '3s', color: 'warn' },
  { from: 'UAE', to: 'Pakistan', fx: 'AED → PKR', fee: '1.2%', time: '3s', color: 'neg' },
  { from: 'UAE', to: 'Nigeria', fx: 'AED → NGN', fee: '1.5%', time: '3s', color: 'green' },
];

export function CorridorsSection() {
  return (
    <section className="py-32 px-6 bg-bg-2">
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
              FIVE CORRIDORS
            </h2>
          </div>

          <div className="space-y-8">
            <h3 className="text-h3 font-medium text-text">
              UAE → 5 Global Destinations
            </h3>

            <p className="text-body-l text-text-2 max-w-3xl">
              Each corridor is a configured payment lane with FX routing, compliance rules,
              and settlement infrastructure. Agents pick the optimal corridor automatically.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {corridors.map((corridor, index) => (
                <motion.div
                  key={corridor.to}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="p-6 bg-bg-elev rounded-lg border border-line hover:border-green/30 transition shadow-card"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`text-${corridor.color} text-h4 font-medium`}>
                      {corridor.from} → {corridor.to}
                    </div>
                  </div>
                  <div className="space-y-2 text-body-s text-text-2">
                    <div className="flex justify-between">
                      <span>FX Rate:</span>
                      <span className="font-medium text-text">{corridor.fx}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fee:</span>
                      <span className="font-medium text-text">{corridor.fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Settlement:</span>
                      <span className="font-medium text-text">{corridor.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Coming Soon Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: corridors.length * 0.1, duration: 0.4 }}
                className="p-6 bg-bg-elev rounded-lg border border-dashed border-line"
              >
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-h2 mb-3">+</div>
                  <div className="text-body-s text-text-2">
                    More corridors coming soon
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-8 p-6 bg-bg-elev rounded-lg shadow-card">
              <h4 className="font-medium text-text mb-3">What's in a corridor?</h4>
              <ul className="space-y-2 text-body-s text-text-2">
                <li className="flex items-start gap-2">
                  <span className="text-green">→</span>
                  <span><strong>FX routing:</strong> Real-time exchange rates with slippage protection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green">→</span>
                  <span><strong>Compliance rules:</strong> KYC requirements, sanctions checks, transaction limits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green">→</span>
                  <span><strong>Settlement config:</strong> USDC on Arc Testnet via Circle CCTP</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green">→</span>
                  <span><strong>Routing stats:</strong> Historical performance, success rate, average fees</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
