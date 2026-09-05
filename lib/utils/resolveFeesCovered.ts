import { calculateStripeFees } from './stripeFees'

// a single source of truth for the covered-fee value, always dollars
export function resolveFeesCovered(coverFees: boolean, baseAmount: number): number {
  return coverFees ? Math.round(calculateStripeFees(baseAmount) * 100) / 100 : 0
}
