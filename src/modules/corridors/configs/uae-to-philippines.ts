/**
 * UAE → Philippines Corridor Configuration
 * Part of Mizan extension to ArcPay
 *
 * Primary remittance corridor for Filipino expats in UAE
 */

import { Corridor } from '../types';

export const uaeToPhilippinesCorridor: Corridor = {
  id: 'uae-to-philippines',
  name: 'UAE → Philippines',

  source: {
    code: 'AE',
    name: 'United Arab Emirates',
    currency: 'AED',
    flag: '🇦🇪'
  },

  destination: {
    code: 'PH',
    name: 'Philippines',
    currency: 'PHP',
    flag: '🇵🇭'
  },

  fx: {
    provider: 'chainlink-oracle',
    sourceCurrency: 'AED',
    targetCurrency: 'PHP',
    slippageTolerance: 0.5  // 0.5%
  },

  routing: {
    defaultChain: 'arc',
    supportedChains: ['arc', 'base', 'polygon'],
    preferDirectTransfer: true,
    enableCCTP: true,
    gasOptimization: 'balanced'
  },

  rules: [
    {
      id: 'sanctions-check-ph',
      type: 'sanctions-check',
      config: {
        enabled: true,
        errorMessage: 'Recipient failed sanctions screening'
      }
    },
    {
      id: 'amount-limit-ph',
      type: 'amount-limit',
      config: {
        enabled: true,
        threshold: 10000,  // $10,000 per transaction
        errorMessage: 'Transaction exceeds $10,000 limit for Philippines corridor'
      }
    },
    {
      id: 'velocity-limit-ph',
      type: 'velocity-limit',
      config: {
        enabled: true,
        threshold: 50000,  // $50,000 per month
        period: 2592000,   // 30 days in seconds
        errorMessage: 'Monthly volume limit exceeded for Philippines corridor'
      }
    }
  ],

  metadata: {
    description: 'Primary remittance corridor for Filipino expats in UAE. High volume, instant settlement.',
    averageSettlementTime: 3,      // 3 seconds
    averageFeePercentage: 0.01,    // 1%
    tags: ['remittance', 'high-volume', 'expat-corridor', 'southeast-asia']
  },

  enabled: true,
  createdAt: new Date('2026-04-01'),
  updatedAt: new Date('2026-04-28')
};
