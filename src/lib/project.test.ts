import { describe, it, expect } from 'vitest'
import { getProgress, getDaysLeft } from './project'

describe('getProgress', () => {
  it('returns 0 when there is no funding goal', () => {
    expect(getProgress({ funding_goal: 0, current_funding: 100 })).toBe(0)
    expect(getProgress({ current_funding: 100 })).toBe(0)
  })

  it('computes a rounded percentage', () => {
    expect(getProgress({ funding_goal: 1000, current_funding: 250 })).toBe(25)
    expect(getProgress({ funding_goal: 3, current_funding: 1 })).toBe(33)
  })

  it('clamps at 100 when over-funded', () => {
    expect(getProgress({ funding_goal: 1000, current_funding: 5000 })).toBe(100)
  })

  it('treats missing current_funding as 0', () => {
    expect(getProgress({ funding_goal: 1000 })).toBe(0)
  })
})

describe('getDaysLeft', () => {
  const NOW = new Date('2026-01-01T00:00:00Z').getTime()

  it('falls back to duration_days when there is no end date', () => {
    expect(getDaysLeft({ duration_days: 30 }, NOW)).toBe(30)
    expect(getDaysLeft({}, NOW)).toBe(0)
  })

  it('counts whole days until the end date', () => {
    const end = new Date('2026-01-11T00:00:00Z').toISOString()
    expect(getDaysLeft({ end_date: end }, NOW)).toBe(10)
  })

  it('never returns a negative number for past end dates', () => {
    const past = new Date('2025-12-01T00:00:00Z').toISOString()
    expect(getDaysLeft({ end_date: past }, NOW)).toBe(0)
  })
})
