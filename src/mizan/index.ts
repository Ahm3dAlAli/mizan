/**
 * Mizan SDK
 * Part of Mizan extension to ArcPay
 *
 * High-level SDK that combines ArcPay with Mizan corridors
 */

import { ArcPay } from '../core/client';
import { CorridorAPI } from '../modules/corridors';

export interface MizanConfig {
  privateKey: string;
  circleApiKey?: string;
  rpcUrl?: string;
  apiEndpoint?: string;  // Mizan orchestration API
}

export class Mizan {
  public arcpay: ArcPay;
  public corridors: CorridorAPI;
  private apiEndpoint: string;

  constructor(config: MizanConfig) {
    // Initialize ArcPay
    this.arcpay = new ArcPay({
      privateKey: config.privateKey,
      circleApiKey: config.circleApiKey,
      rpcUrl: config.rpcUrl
    });

    // Initialize Corridor API
    this.corridors = new CorridorAPI(this.arcpay);

    // Mizan orchestration API endpoint
    this.apiEndpoint = config.apiEndpoint || 'http://localhost:8000';
  }

  /**
   * Fluent API: Select corridor
   */
  corridor(corridorId: string) {
    return this.corridors.corridor(corridorId);
  }

  /**
   * Agent-orchestrated payroll run
   * Calls the Mizan orchestration API (Python/LangGraph backend)
   */
  async agent(operation: 'payroll', params: any): Promise<any> {
    const response = await fetch(`${this.apiEndpoint}/api/${operation}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`Agent operation failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get all corridors
   */
  getAllCorridors() {
    return this.corridors.getAllCorridors();
  }

  /**
   * Get corridor stats
   */
  getStats(corridorId?: string) {
    return this.corridors.getStats(corridorId);
  }
}

/**
 * Simple factory function
 */
export function createMizan(config: MizanConfig): Mizan {
  return new Mizan(config);
}

// Re-export important types
export type {
  Corridor,
  CorridorPaymentRequest,
  CorridorPaymentResult,
  CorridorStats
} from '../modules/corridors';

export { corridorResolver } from '../modules/corridors';
