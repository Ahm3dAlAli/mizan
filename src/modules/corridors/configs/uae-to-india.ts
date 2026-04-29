/**
 * UAE → India Corridor Configuration
 * Part of Mizan extension to ArcPay
 */

import { Corridor } from '../types';

export const uaeToIndiaCorridor: Corridor = {
  id: 'uae-to-india',
  name: 'UAE → India',

  source: {
    code: 'AE',
    name: 'United Arab Emirates',
    currency: 'AED',
    flag: '🇦🇪'
  },

  destination: {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    flag: '🇮🇳'
  },

  fx: {
    provider: 'chainlink-oracle',
    sourceCurrency: 'AED',
    targetCurrency: 'INR',
    slippageTolerance: 0.5
  },

  routing: {
    defaultChain: 'arc',
    supportedChains: ['arc', 'polygon', 'base'],
    preferDirectTransfer: true,
    enableCCTP: true,
    gasOptimization: 'balanced'
  },

  rules: [
    {
      id: 'sanctions-check-in',
      type: 'sanctions-check',
      config: {
        enabled: true,
        errorMessage: 'Recipient failed sanctions screening'
      }
    },
    {
      id: 'amount-limit-in',
      type: 'amount-limit',
      config: {
        enabled: true,
        threshold: 15000,
        errorMessage: 'Transaction exceeds $15,000 limit for India corridor'
      }
    },
    {
      id: 'velocity-limit-in',
      type: 'velocity-limit',
      config: {
        enabled: true,
        threshold: 75000,
        period: 2592000,
        errorMessage: 'Monthly volume limit exceeded for India corridor'
      }
    }
  ],

  metadata: {
    description: 'Largest remittance corridor from UAE. Supports high volumes with robust compliance.',
    averageSettlementTime: 3,
    averageFeePercentage: 0.01,
    tags: ['remittance', 'high-volume', 'expat-corridor', 'south-asia']
  },

  enabled: true,
  createdAt: new Date('2026-04-01'),
  updatedAt: new Date('2026-04-28')
};
