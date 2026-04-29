/**
 * UAE → Pakistan Corridor Configuration
 * Part of Mizan extension to ArcPay
 */

import { Corridor } from '../types';

export const uaeToPakistanCorridor: Corridor = {
  id: 'uae-to-pakistan',
  name: 'UAE → Pakistan',

  source: {
    code: 'AE',
    name: 'United Arab Emirates',
    currency: 'AED',
    flag: '🇦🇪'
  },

  destination: {
    code: 'PK',
    name: 'Pakistan',
    currency: 'PKR',
    flag: '🇵🇰'
  },

  fx: {
    provider: 'chainlink-oracle',
    sourceCurrency: 'AED',
    targetCurrency: 'PKR',
    slippageTolerance: 0.8
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
      id: 'sanctions-check-pk',
      type: 'sanctions-check',
      config: {
        enabled: true,
        errorMessage: 'Recipient failed sanctions screening'
      }
    },
    {
      id: 'kyc-required-pk',
      type: 'kyc-required',
      config: {
        enabled: true,
        threshold: 5000,  // KYC required above $5,000
        errorMessage: 'KYC verification required for amounts above $5,000'
      }
    },
    {
      id: 'amount-limit-pk',
      type: 'amount-limit',
      config: {
        enabled: true,
        threshold: 10000,
        errorMessage: 'Transaction exceeds $10,000 limit for Pakistan corridor'
      }
    },
    {
      id: 'velocity-limit-pk',
      type: 'velocity-limit',
      config: {
        enabled: true,
        threshold: 50000,
        period: 2592000,
        errorMessage: 'Monthly volume limit exceeded for Pakistan corridor'
      }
    }
  ],

  metadata: {
    description: 'High-compliance corridor for Pakistani expats. Enhanced KYC requirements.',
    averageSettlementTime: 3,
    averageFeePercentage: 0.012,  // 1.2% - reflects compliance overhead
    tags: ['remittance', 'high-compliance', 'expat-corridor', 'south-asia']
  },

  enabled: true,
  createdAt: new Date('2026-04-01'),
  updatedAt: new Date('2026-04-28')
};
