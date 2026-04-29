/**
 * Corridor Configurations Index
 * Part of Mizan extension to ArcPay
 *
 * Exports all 5 UAE → Global corridor configurations
 */

import { Corridor } from '../types';
import { uaeToPhilippinesCorridor } from './uae-to-philippines';
import { uaeToIndiaCorridor } from './uae-to-india';
import { uaeToEgyptCorridor } from './uae-to-egypt';
import { uaeToPakistanCorridor } from './uae-to-pakistan';
import { uaeToNigeriaCorridor } from './uae-to-nigeria';

export const corridors: Corridor[] = [
  uaeToPhilippinesCorridor,
  uaeToIndiaCorridor,
  uaeToEgyptCorridor,
  uaeToPakistanCorridor,
  uaeToNigeriaCorridor
];

export const corridorMap: Record<string, Corridor> = {
  'uae-to-philippines': uaeToPhilippinesCorridor,
  'uae-to-india': uaeToIndiaCorridor,
  'uae-to-egypt': uaeToEgyptCorridor,
  'uae-to-pakistan': uaeToPakistanCorridor,
  'uae-to-nigeria': uaeToNigeriaCorridor
};

export {
  uaeToPhilippinesCorridor,
  uaeToIndiaCorridor,
  uaeToEgyptCorridor,
  uaeToPakistanCorridor,
  uaeToNigeriaCorridor
};
