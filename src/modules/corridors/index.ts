/**
 * Corridors Module
 * Part of Mizan extension to ArcPay
 *
 * Main entry point for corridor-based payments
 */

export * from './types';
export * from './configs';
export * from './resolver';
export * from './executor';

import { ArcPay } from '../../core/client';
import { CorridorExecutor } from './executor';
import { corridorResolver } from './resolver';
import { CorridorPaymentRequest } from './types';

/**
 * Corridor-based payment API
 */
export class CorridorAPI {
  private executor: CorridorExecutor;

  constructor(arcpay: ArcPay) {
    this.executor = new CorridorExecutor(arcpay);
  }

  /**
   * Get corridor information
   */
  getCorridor(corridorId: string) {
    return corridorResolver.resolveCorridor(corridorId);
  }

  /**
   * List all available corridors
   */
  getAllCorridors() {
    return corridorResolver.getAllCorridors();
  }

  /**
   * Get corridors by source country
   */
  getBySource(countryCode: string) {
    return corridorResolver.getCorridorsBySource(countryCode);
  }

  /**
   * Get corridors by destination country
   */
  getByDestination(countryCode: string) {
    return corridorResolver.getCorridorsByDestination(countryCode);
  }

  /**
   * Execute a corridor payment
   */
  async pay(request: CorridorPaymentRequest) {
    return this.executor.pay(request);
  }

  /**
   * Execute batch payments
   */
  async payBatch(requests: CorridorPaymentRequest[]) {
    return this.executor.payBatch(requests);
  }

  /**
   * Get corridor statistics
   */
  getStats(corridorId?: string) {
    if (corridorId) {
      return corridorResolver.getStats(corridorId);
    }
    return corridorResolver.getAllStats();
  }

  /**
   * Fluent API: Select corridor and pay
   */
  corridor(corridorId: string) {
    const self = this;
    return {
      async pay(params: Omit<CorridorPaymentRequest, 'corridorId'>) {
        return self.pay({
          corridorId,
          ...params
        });
      },
      getInfo() {
        return self.getCorridor(corridorId);
      },
      getStats() {
        return corridorResolver.getStats(corridorId);
      }
    };
  }
}

/**
 * Add corridor API to ArcPay client
 */
declare module '../../core/client' {
  interface ArcPay {
    corridors: CorridorAPI;
  }
}
