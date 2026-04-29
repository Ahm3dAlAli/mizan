/**
 * Corridor Types
 * Part of Mizan extension to ArcPay
 *
 * Defines corridor configuration types for cross-border payments
 */

export type ChainName = 'arc' | 'base' | 'arbitrum' | 'ethereum' | 'polygon' | 'avalanche';
export type Currency = 'AED' | 'USD' | 'PHP' | 'INR' | 'EGP' | 'PKR' | 'NGN' | 'USDC' | 'EURC';
export type FXProvider = 'circle-fx' | 'chainlink-oracle' | 'fixed-rate' | 'manual';

export interface ComplianceRule {
  id: string;
  type: 'sanctions-check' | 'kyc-required' | 'amount-limit' | 'velocity-limit' | 'whitelist-only';
  config: {
    enabled: boolean;
    threshold?: number;        // For amount/velocity limits
    period?: number;           // For velocity limits (in seconds)
    whitelist?: string[];      // For whitelist rules
    errorMessage?: string;
  };
}

export interface CountryConfig {
  code: string;               // ISO 3166-1 alpha-2 (e.g., 'AE', 'PH')
  name: string;
  currency: Currency;
  flag?: string;              // Unicode flag emoji
}

export interface FXConfig {
  provider: FXProvider;
  sourceCurrency: Currency;
  targetCurrency: Currency;
  fixedRate?: number;         // For 'fixed-rate' provider
  oracleAddress?: string;     // For 'chainlink-oracle' provider
  slippageTolerance?: number; // Percentage (e.g., 0.5 for 0.5%)
}

export interface RoutingConfig {
  defaultChain: ChainName;
  supportedChains: ChainName[];
  preferDirectTransfer: boolean;    // Use direct transfer if recipient on same chain
  enableCCTP: boolean;               // Use Circle's CCTP for cross-chain
  gasOptimization: 'speed' | 'cost' | 'balanced';
}

export interface CorridorMetadata {
  description?: string;
  averageSettlementTime: number;    // In seconds
  averageFeePercentage: number;     // As decimal (e.g., 0.03 for 3%)
  monthlyVolume?: number;           // In USD
  activeUsers?: number;
  tags?: string[];
}

export interface Corridor {
  id: string;                       // e.g., 'uae-to-philippines'
  name: string;                     // e.g., 'UAE → Philippines'
  source: CountryConfig;
  destination: CountryConfig;
  fx: FXConfig;
  routing: RoutingConfig;
  rules: ComplianceRule[];
  metadata: CorridorMetadata;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CorridorPaymentRequest {
  corridorId: string;
  to: string;                       // Recipient address or email
  amount: number;
  sourceCurrency?: Currency;        // If not specified, uses corridor default
  memo?: string;
  metadata?: Record<string, any>;
}

export interface CorridorPaymentResult {
  success: boolean;
  corridorId: string;
  txHash?: string;
  chain: ChainName;
  amount: number;
  fxRate?: number;
  convertedAmount?: number;
  fee: number;
  settlementTime: number;           // Actual time taken (seconds)
  recipient: string;
  timestamp: Date;
  error?: string;
  rulesEvaluated: string[];         // IDs of rules that were checked
  rulesPassed: boolean;
  agentActions?: Array<{
    agent: string;
    action: string;
    reasoning: string;
    timestamp: Date;
  }>;
}

export interface CorridorResolver {
  resolveCorridor(id: string): Corridor | null;
  getAllCorridors(): Corridor[];
  getCorridorsBySource(countryCode: string): Corridor[];
  getCorridorsByDestination(countryCode: string): Corridor[];
  registerCorridor(corridor: Corridor): void;
  updateCorridor(id: string, updates: Partial<Corridor>): void;
  disableCorridor(id: string): void;
}

export interface CorridorStats {
  corridorId: string;
  totalTransactions: number;
  totalVolume: number;              // In USD
  averageAmount: number;
  successRate: number;              // Percentage
  averageSettlementTime: number;    // In seconds
  averageFee: number;               // In USD
  lastTransactionAt?: Date;
  popularDestinations: Array<{
    address: string;
    count: number;
  }>;
}
