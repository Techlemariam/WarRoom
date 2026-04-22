/**
 * Token Burn Tracker — Estimates AI token consumption across Brotherhood sessions.
 *
 * Since we don't have direct API access (Antigravity handles that), this module
 * tracks observable proxies: conversation count, file sizes read, and KI loads.
 * Data is stored in a local JSON file and exposed via the WarRoom API.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

export interface TokenBurnEntry {
  /** ISO timestamp */
  timestamp: string;
  /** Which project triggered the session */
  project: string;
  /** Estimated tokens consumed (input + output) */
  estimatedTokens: number;
  /** Source: 'antigravity' | 'claude-code' | 'n8n' | 'manual' */
  source: string;
  /** Optional session identifier */
  sessionId?: string;
}

export interface TokenBurnSummary {
  /** Total estimated tokens burned today */
  todayTotal: number;
  /** Total estimated tokens burned this week */
  weekTotal: number;
  /** Average tokens per session today */
  avgPerSession: number;
  /** Number of sessions today */
  sessionCount: number;
  /** Burn rate score (0-2.0 scale, for EntropyRadar) */
  burnScore: number;
  /** Status label */
  status: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  /** Recent entries (last 10) */
  recentEntries: TokenBurnEntry[];
}

const DATA_DIR = join(process.cwd(), 'data');
const BURN_FILE = join(DATA_DIR, 'token-burn.json');

// Budget thresholds (estimated tokens per day)
const DAILY_BUDGET = 500_000; // 500K tokens/day target
const THRESHOLDS = {
  LOW: 0.3,       // < 30% of budget
  MODERATE: 0.6,  // 30-60% of budget
  HIGH: 0.85,     // 60-85% of budget
  CRITICAL: 1.0,  // > 85% of budget
};

async function ensureDataDir(): Promise<void> {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory exists
  }
}

async function readBurnLog(): Promise<TokenBurnEntry[]> {
  try {
    const raw = await readFile(BURN_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeBurnLog(entries: TokenBurnEntry[]): Promise<void> {
  await ensureDataDir();
  // Keep only last 30 days of data
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const filtered = entries.filter((e) => new Date(e.timestamp) > cutoff);
  await writeFile(BURN_FILE, JSON.stringify(filtered, null, 2));
}

/**
 * Log a token burn event (called by external integrations or n8n webhooks).
 */
export async function logTokenBurn(entry: Omit<TokenBurnEntry, 'timestamp'>): Promise<void> {
  const entries = await readBurnLog();
  entries.push({
    ...entry,
    timestamp: new Date().toISOString(),
  });
  await writeBurnLog(entries);
}

/**
 * Estimate tokens from a text length (rough heuristic: 1 token ≈ 4 chars).
 */
export function estimateTokens(charCount: number): number {
  return Math.ceil(charCount / 4);
}

/**
 * Get the token burn summary for EntropyRadar integration.
 */
export async function getTokenBurnSummary(): Promise<TokenBurnSummary> {
  const entries = await readBurnLog();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  const todayEntries = entries.filter((e) => new Date(e.timestamp) >= todayStart);
  const weekEntries = entries.filter((e) => new Date(e.timestamp) >= weekStart);

  const todayTotal = todayEntries.reduce((acc, e) => acc + e.estimatedTokens, 0);
  const weekTotal = weekEntries.reduce((acc, e) => acc + e.estimatedTokens, 0);
  const sessionCount = todayEntries.length;
  const avgPerSession = sessionCount > 0 ? Math.round(todayTotal / sessionCount) : 0;

  // Calculate burn score (0-2.0 for EntropyRadar)
  const budgetUsage = todayTotal / DAILY_BUDGET;
  const burnScore = Math.min(budgetUsage * 2.0, 2.0);

  let status: TokenBurnSummary['status'];
  if (budgetUsage < THRESHOLDS.LOW) status = 'LOW';
  else if (budgetUsage < THRESHOLDS.MODERATE) status = 'MODERATE';
  else if (budgetUsage < THRESHOLDS.HIGH) status = 'HIGH';
  else status = 'CRITICAL';

  return {
    todayTotal,
    weekTotal,
    avgPerSession,
    sessionCount,
    burnScore: Number(burnScore.toFixed(1)),
    status,
    recentEntries: entries.slice(-10),
  };
}
