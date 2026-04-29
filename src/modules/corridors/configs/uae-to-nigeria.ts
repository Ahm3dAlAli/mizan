/**
 * UAE → Nigeria Corridor Configuration
 * Part of Mizan extension to ArcPay
 */

import { Corridor } from '../types';

export const uaeToNigeriaCorridor: Corridor = {
  id: 'uae-to-nigeria',
  name: 'UAE → Nigeria',

  source: {
    code: 'AE',
    name: 'United Arab Emirates',
    currency: 'AED',
    flag: '🇦🇪'
  },

  destination: {
    code: 'NG',
    name: 'Nigeria',
    currency: 'NGN',
    flag: '🇳🇬'
  },

  fx: {
    provider: 'chainlink-oracle',
    sourceCurrency: 'AED',
    targetCurrency: 'NGN',
    slippageTolerance: 1.5  // Higher tolerance for NGN volatility
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
      id: 'sanctions-check-ng',
      type: 'sanctions-check',
      config: {
        enabled: true,
        errorMessage: 'Recipient failed sanctions screening'
      }
    },
    {
      id: 'kyc-required-ng',
      type: 'kyc-required',
      config: {
        enabled: true,
        threshold: 3000,  // Lower KYC threshold for Nigeria
        errorMessage: 'KYC verification required for amounts above $3,000'
      }
    },
    {
      id: 'amount-limit-ng',
      type: 'amount-limit',
      config: {
        enabled: true,
        threshold: 8000,
        errorMessage: 'Transaction exceeds $8,000 limit for Nigeria corridor'
      }
    },
    {
      id: 'velocity-limit-ng',
      type: 'velocity-limit',
      config: {
        enabled: true,
        threshold: 40000,
        period: 2592000,
        errorMessage: 'Monthly volume limit exceeded for Nigeria corridor'
      }
    }
  ],

  metadata: {
    description: 'Growing corridor for Nigerian freelancers and expats. Enhanced fraud prevention.',
    averageSettlementTime: 3,
    averageFeePercentage: 0.015,  // 1.5% - reflects higher risk profile
    tags: ['remittance', 'high-compliance', 'africa', 'emerging-market']
  },

  enabled: true,
  createdAt: new Date('2026-04-01'),
  updatedAt: new Date('2026-04-28')
};
