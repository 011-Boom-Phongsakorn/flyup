// Pure helpers for project funding display.
// Extracted from Home.tsx / Projects.tsx (where they were duplicated) so they
// can be shared and unit-tested in isolation.

export interface ProgressLike {
  funding_goal?: number
  current_funding?: number
}

export interface DaysLeftLike {
  end_date?: string | null
  duration_days?: number
}

/** Funding progress as a whole-number percentage, clamped to 0–100. */
export function getProgress(p: ProgressLike): number {
  if (!p.funding_goal || p.funding_goal === 0) return 0
  return Math.min(Math.round(((p.current_funding ?? 0) / p.funding_goal) * 100), 100)
}

/**
 * Days remaining until `end_date`. Falls back to `duration_days` when there's no
 * end date. Never negative. `now` is injectable so tests are deterministic.
 */
export function getDaysLeft(p: DaysLeftLike, now: number = Date.now()): number {
  if (!p.end_date) return p.duration_days || 0
  const diff = new Date(p.end_date).getTime() - now
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
