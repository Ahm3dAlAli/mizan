/**
 * Corridor Payment Executor
 * Part of Mizan extension to ArcPay
 *
 * Executes payments through corridors using ArcPay infrastructure
 */

import { ArcPay } from '../../core/client';
import {
  Corridor,
  CorridorPaymentRequest,
  CorridorPaymentResult,
  ComplianceRule
} from './types';
import { corridorResolver } from './resolver';

export class CorridorExecutor {
  constructor(private arcpay: ArcPay) {}

  /**
   * Execute a corridor payment
   */
  async pay(request: CorridorPaymentRequest): Promise<CorridorPaymentResult> {
    const startTime = Date.now();

    try {
      // Resolve corridor
      const corridor = corridorResolver.resolveCorridor(request.corridorId);
      if (!corridor) {
        return this.errorResult(
          request.corridorId,
          'arc',
          `Corridor ${request.corridorId} not found or disabled`
        );
      }

      // Evaluate compliance rules
      const ruleCheck = await this.evaluateRules(corridor, request);
      if (!ruleCheck.passed) {
        return this.errorResult(
          request.corridorId,
          corridor.routing.defaultChain,
          ruleCheck.error || 'Compliance check failed',
          ruleCheck.rulesEvaluated
        );
      }

      // Get FX rate if currency conversion needed
      const fxRate = await this.getFXRate(corridor, request);

      // Calculate converted amount
      const sourceCurrency = request.sourceCurrency || corridor.source.currency;
      const convertedAmount = sourceCurrency === 'USDC'
        ? request.amount
        : request.amount * (fxRate || 1);

      // Calculate fee
      const fee = convertedAmount * corridor.metadata.averageFeePercentage;
      const netAmount = convertedAmount - fee;

      // Execute transfer via ArcPay
      const txHash = await this.executeTransfer(
        corridor,
        request.to,
        netAmount
      );

      // Calculate settlement time
      const settlementTime = (Date.now() - startTime) / 1000;

      // Record transaction statistics
      corridorResolver.recordTransaction(
        corridor.id,
        convertedAmount,
        settlementTime,
        fee,
        true,
        request.to
      );

      return {
        success: true,
        corridorId: corridor.id,
        txHash,
        chain: corridor.routing.defaultChain,
        amount: convertedAmount,
        fxRate,
        convertedAmount: netAmount,
        fee,
        settlementTime,
        recipient: request.to,
        timestamp: new Date(),
        rulesEvaluated: ruleCheck.rulesEvaluated,
        rulesPassed: true
      };
    } catch (error: any) {
      return this.errorResult(
        request.corridorId,
        'arc',
        error.message || 'Payment execution failed'
      );
    }
  }

  /**
   * Evaluate compliance rules
   */
  private async evaluateRules(
    corridor: Corridor,
    request: CorridorPaymentRequest
  ): Promise<{
    passed: boolean;
    error?: string;
    rulesEvaluated: string[];
  }> {
    const rulesEvaluated: string[] = [];

    for (const rule of corridor.rules) {
      rulesEvaluated.push(rule.id);

      if (!rule.config.enabled) continue;

      switch (rule.type) {
        case 'amount-limit':
          if (rule.config.threshold && request.amount > rule.config.threshold) {
            return {
              passed: false,
              error: rule.config.errorMessage || 'Amount limit exceeded',
              rulesEvaluated
            };
          }
          break;

        case 'sanctions-check':
          // In production, this would call an external sanctions API
          // For demo purposes, we'll pass all checks
          // Example: const isSanctioned = await checkSanctions(request.to);
          break;

        case 'kyc-required':
          if (rule.config.threshold && request.amount > rule.config.threshold) {
            // In production, verify KYC status
            // For demo, we'll assume KYC is complete
          }
          break;

        case 'velocity-limit':
          // In production, check recent transaction volume
          // For demo, we'll pass
          break;

        case 'whitelist-only':
          if (rule.config.whitelist) {
            const isWhitelisted = rule.config.whitelist.includes(request.to);
            if (!isWhitelisted) {
              return {
                passed: false,
                error: rule.config.errorMessage || 'Recipient not whitelisted',
                rulesEvaluated
              };
            }
          }
          break;
      }
    }

    return {
      passed: true,
      rulesEvaluated
    };
  }

  /**
   * Get FX rate for currency conversion
   */
  private async getFXRate(
    corridor: Corridor,
    request: CorridorPaymentRequest
  ): Promise<number | undefined> {
    const sourceCurrency = request.sourceCurrency || corridor.source.currency;

    // If source is already USDC, no conversion needed
    if (sourceCurrency === 'USDC') {
      return undefined;
    }

    // In production, this would fetch real FX rates from:
    // - Circle StableFX API
    // - Chainlink Price Feeds
    // - Other oracle providers

    // Demo fixed rates (approximate as of 2026)
    const demoRates: Record<string, number> = {
      'AED': 0.27,    // 1 AED = 0.27 USD
      'PHP': 0.017,   // 1 PHP = 0.017 USD
      'INR': 0.012,   // 1 INR = 0.012 USD
      'EGP': 0.020,   // 1 EGP = 0.020 USD
      'PKR': 0.0036,  // 1 PKR = 0.0036 USD
      'NGN': 0.00065  // 1 NGN = 0.00065 USD
    };

    return demoRates[sourceCurrency] || 1;
  }

  /**
   * Execute actual transfer via ArcPay
   */
  private async executeTransfer(
    corridor: Corridor,
    recipient: string,
    amount: number
  ): Promise<string> {
    const chain = corridor.routing.defaultChain;

    // Direct transfer on Arc (native USDC)
    if (chain === 'arc' && corridor.routing.preferDirectTransfer) {
      const result = await this.arcpay.sendUSDC(recipient, amount);
      return result.hash;
    }

    // Cross-chain transfer via CCTP
    if (corridor.routing.enableCCTP) {
      const bridge = this.arcpay.getBridgeModule();
      const result = await bridge.transfer({
        to: recipient,
        amount,
        toChain: this.getChainId(chain)
      });
      return result.txHash;
    }

    // Fallback: direct transfer
    const result = await this.arcpay.sendUSDC(recipient, amount);
    return result.hash;
  }

  /**
   * Helper: Get chain ID from chain name
   */
  private getChainId(chainName: string): number {
    const chainIds: Record<string, number> = {
      'arc': 5042002,
      'base': 84532,
      'arbitrum': 421614,
      'ethereum': 11155111,
      'polygon': 80002,
      'avalanche': 43113
    };
    return chainIds[chainName] || 5042002;
  }

  /**
   * Helper: Create error result
   */
  private errorResult(
    corridorId: string,
    chain: string,
    error: string,
    rulesEvaluated: string[] = []
  ): CorridorPaymentResult {
    return {
      success: false,
      corridorId,
      chain: chain as any,
      amount: 0,
      fee: 0,
      settlementTime: 0,
      recipient: '',
      timestamp: new Date(),
      error,
      rulesEvaluated,
      rulesPassed: false
    };
  }

  /**
   * Batch payment across multiple corridors
   */
  async payBatch(
    requests: CorridorPaymentRequest[]
  ): Promise<CorridorPaymentResult[]> {
    const results = await Promise.all(
      requests.map(req => this.pay(req))
    );
    return results;
  }
}
