/**
 * Corridor Resolver
 * Part of Mizan extension to ArcPay
 *
 * Resolves corridor configurations and manages corridor registry
 */

import { Corridor, CorridorResolver, CorridorStats } from './types';
import { corridors, corridorMap } from './configs';

export class DefaultCorridorResolver implements CorridorResolver {
  private corridors: Map<string, Corridor>;
  private stats: Map<string, CorridorStats>;

  constructor() {
    this.corridors = new Map();
    this.stats = new Map();

    // Load default corridors
    corridors.forEach(corridor => {
      this.corridors.set(corridor.id, corridor);
      this.initStats(corridor.id);
    });
  }

  /**
   * Resolve corridor by ID
   */
  resolveCorridor(id: string): Corridor | null {
    const corridor = this.corridors.get(id);
    return corridor && corridor.enabled ? corridor : null;
  }

  /**
   * Get all enabled corridors
   */
  getAllCorridors(): Corridor[] {
    return Array.from(this.corridors.values()).filter(c => c.enabled);
  }

  /**
   * Get corridors by source country
   */
  getCorridorsBySource(countryCode: string): Corridor[] {
    return Array.from(this.corridors.values())
      .filter(c => c.enabled && c.source.code === countryCode.toUpperCase());
  }

  /**
   * Get corridors by destination country
   */
  getCorridorsByDestination(countryCode: string): Corridor[] {
    return Array.from(this.corridors.values())
      .filter(c => c.enabled && c.destination.code === countryCode.toUpperCase());
  }

  /**
   * Register a new corridor
   */
  registerCorridor(corridor: Corridor): void {
    if (this.corridors.has(corridor.id)) {
      throw new Error(`Corridor ${corridor.id} already exists`);
    }

    corridor.createdAt = new Date();
    corridor.updatedAt = new Date();
    this.corridors.set(corridor.id, corridor);
    this.initStats(corridor.id);
  }

  /**
   * Update existing corridor
   */
  updateCorridor(id: string, updates: Partial<Corridor>): void {
    const corridor = this.corridors.get(id);
    if (!corridor) {
      throw new Error(`Corridor ${id} not found`);
    }

    const updated = {
      ...corridor,
      ...updates,
      updatedAt: new Date()
    };

    this.corridors.set(id, updated);
  }

  /**
   * Disable corridor
   */
  disableCorridor(id: string): void {
    this.updateCorridor(id, { enabled: false });
  }

  /**
   * Get corridor statistics
   */
  getStats(corridorId: string): CorridorStats | null {
    return this.stats.get(corridorId) || null;
  }

  /**
   * Update statistics after a transaction
   */
  recordTransaction(
    corridorId: string,
    amount: number,
    settlementTime: number,
    fee: number,
    success: boolean,
    recipientAddress: string
  ): void {
    const stats = this.stats.get(corridorId);
    if (!stats) return;

    stats.totalTransactions += 1;

    if (success) {
      stats.totalVolume += amount;
      stats.averageAmount = stats.totalVolume / stats.totalTransactions;

      // Update average settlement time (rolling average)
      const n = stats.totalTransactions;
      stats.averageSettlementTime =
        (stats.averageSettlementTime * (n - 1) + settlementTime) / n;

      // Update average fee
      stats.averageFee = (stats.averageFee * (n - 1) + fee) / n;
    }

    // Update success rate
    const successfulTxs = Math.round(stats.successRate * (stats.totalTransactions - 1) / 100);
    const newSuccessfulTxs = success ? successfulTxs + 1 : successfulTxs;
    stats.successRate = (newSuccessfulTxs / stats.totalTransactions) * 100;

    stats.lastTransactionAt = new Date();

    // Track popular destinations
    const destIndex = stats.popularDestinations.findIndex(
      d => d.address === recipientAddress
    );

    if (destIndex >= 0) {
      stats.popularDestinations[destIndex].count += 1;
    } else {
      stats.popularDestinations.push({
        address: recipientAddress,
        count: 1
      });
    }

    // Sort and keep top 10
    stats.popularDestinations.sort((a, b) => b.count - a.count);
    stats.popularDestinations = stats.popularDestinations.slice(0, 10);
  }

  /**
   * Initialize statistics for a corridor
   */
  private initStats(corridorId: string): void {
    this.stats.set(corridorId, {
      corridorId,
      totalTransactions: 0,
      totalVolume: 0,
      averageAmount: 0,
      successRate: 100,
      averageSettlementTime: 0,
      averageFee: 0,
      popularDestinations: []
    });
  }

  /**
   * Get all statistics
   */
  getAllStats(): CorridorStats[] {
    return Array.from(this.stats.values());
  }

  /**
   * Auto-select best corridor based on source and destination
   */
  autoCorridor(sourceCountry: string, destCountry: string): Corridor | null {
    const candidates = Array.from(this.corridors.values()).filter(
      c => c.enabled &&
           c.source.code === sourceCountry.toUpperCase() &&
           c.destination.code === destCountry.toUpperCase()
    );

    if (candidates.length === 0) return null;
    if (candidates.length === 1) return candidates[0];

    // If multiple corridors exist, pick the one with best stats
    const stats = candidates.map(c => this.stats.get(c.id)!);
    const bestIndex = stats.reduce((maxIdx, stat, idx, arr) => {
      const maxStat = arr[maxIdx];
      // Score: (successRate * 0.5 + (1 / avgSettlementTime) * 0.3 + (1 / avgFee) * 0.2)
      const score = stat.successRate * 0.5 +
                    (1 / (stat.averageSettlementTime || 1)) * 30 +
                    (1 / (stat.averageFee || 1)) * 20;
      const maxScore = maxStat.successRate * 0.5 +
                       (1 / (maxStat.averageSettlementTime || 1)) * 30 +
                       (1 / (maxStat.averageFee || 1)) * 20;
      return score > maxScore ? idx : maxIdx;
    }, 0);

    return candidates[bestIndex];
  }
}

// Singleton instance
export const corridorResolver = new DefaultCorridorResolver();
