/**
 * Brotherhood Rarity Protocol - WarRoom Registry
 *
 * WarRoom is the central hub. It maps all project-specific states
 * to the global rarity standard.
 */

export const RARITY_COLORS = {
  POOR: 'var(--color-rarity-poor)',
  COMMON: 'var(--color-rarity-common)',
  UNCOMMON: 'var(--color-rarity-uncommon)',
  RARE: 'var(--color-rarity-rare)',
  EPIC: 'var(--color-rarity-epic)',
  LEGENDARY: 'var(--color-rarity-legendary)',
  GOLD: 'var(--color-rarity-gold)',
} as const;

export type RarityTier = keyof typeof RARITY_COLORS;

/**
 * Ecosystem-wide state mapping
 */
export const ECOSYSTEM_STATE_MAPPING: Record<string, RarityTier> = {
  // Operational
  healthy: 'UNCOMMON',
  degraded: 'GOLD',
  down: 'LEGENDARY',
  maintenance: 'RARE',

  // Tasks/Backlog
  debt: 'POOR',
  standard: 'COMMON',
  priority: 'RARE',
  critical: 'LEGENDARY',

  // AI/Intelligence
  prediction: 'EPIC',
  anomaly: 'GOLD',
  insight: 'EPIC',
};
