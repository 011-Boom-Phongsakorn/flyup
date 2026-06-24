import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn (className merge helper)', () => {
  it('joins multiple class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('ignores falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b')
  })

  it('applies conditional classes via objects', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
  })

  it('lets later tailwind classes win on conflict (twMerge)', () => {
    // p-2 should be overridden by p-4
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('returns an empty string when given nothing', () => {
    expect(cn()).toBe('')
  })
})
