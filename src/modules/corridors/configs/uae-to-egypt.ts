/**
 * UAE → Egypt Corridor Configuration
 * Part of Mizan extension to ArcPay
 */

import { Corridor } from '../types';

export const uaeToEgyptCorridor: Corridor = {
  id: 'uae-to-egypt',
  name: 'UAE → Egypt',

  source: {
    code: 'AE',
    name: 'United Arab Emirates',
    currency: 'AED',
    flag: '🇦🇪'
  },

  destination: {
    code: 'EG',
    name: 'Egypt',
    currency: 'EGP',
    flag: '🇪🇬'
  },

  fx: {
    provider: 'chainlink-oracle',
    sourceCurrency: 'AED',
    targetCurrency: 'EGP',
    slippageTolerance: 1.0  // Higher tolerance for EGP volatility
  },

  routing: {
    defaultChain: 'arc',
    supportedChains: ['arc', 'base'],
    preferDirectTransfer: true,
    enableCCTP: true,
    gasOptimization: 'cost'  // Cost-optimized for price-sensitive corridor
  },

  rules: [
    {
      id: 'sanctions-check-eg',
      type: 'sanctions-check',
      config: {
        enabled: true,
        errorMessage: 'Recipient failed sanctions screening'
      }
    },
    {
      id: 'amount-limit-eg',
      type: 'amount-limit',
      config: {
        enabled: true,
        threshold: 8000,
        errorMessage: 'Transaction exceeds $8,000 limit for Egypt corridor'
      }
    },
    {
      id: 'velocity-limit-eg',
      type: 'velocity-limit',
      config: {
        enabled: true,
        threshold: 40000,
        period: 2592000,
        errorMessage: 'Monthly volume limit exceeded for Egypt corridor'
      }
    }
  ],

  metadata: {
    description: 'MENA corridor for Egyptian expats. Cost-optimized routing for price-sensitive market.',
    averageSettlementTime: 3,
    averageFeePercentage: 0.008,  // 0.8% - lower fee structure
    tags: ['remittance', 'mena', 'expat-corridor', 'cost-optimized']
  },

  enabled: true,
  createdAt: new Date('2026-04-01'),
  updatedAt: new Date('2026-04-28')
};
