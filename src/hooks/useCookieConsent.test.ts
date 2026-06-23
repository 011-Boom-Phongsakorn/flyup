import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useCookieConsent } from './useCookieConsent'

const KEY = 'flyup_cookie_consent'

describe('useCookieConsent', () => {
  beforeEach(() => { localStorage.clear(); vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('shows the banner after 800ms when no choice is stored', () => {
    const { result } = renderHook(() => useCookieConsent())
    expect(result.current.status).toBeNull()
    expect(result.current.isPending).toBe(false)
    act(() => { vi.advanceTimersByTime(800) })
    expect(result.current.isPending).toBe(true)
  })

  it('accept() stores the choice and hides the banner', () => {
    const { result } = renderHook(() => useCookieConsent())
    act(() => { result.current.accept() })
    expect(result.current.status).toBe('accepted')
    expect(result.current.isPending).toBe(false)
    expect(JSON.parse(localStorage.getItem(KEY)!).status).toBe('accepted')
  })

  it('reads an existing valid choice on mount (no banner)', () => {
    localStorage.setItem(KEY, JSON.stringify({ status: 'declined', version: '1' }))
    const { result } = renderHook(() => useCookieConsent())
    expect(result.current.status).toBe('declined')
    act(() => { vi.advanceTimersByTime(800) })
    expect(result.current.isPending).toBe(false)
  })

  it('ignores a stored choice from an old policy version', () => {
    localStorage.setItem(KEY, JSON.stringify({ status: 'accepted', version: '0' }))
    const { result } = renderHook(() => useCookieConsent())
    expect(result.current.status).toBeNull()
  })
})
