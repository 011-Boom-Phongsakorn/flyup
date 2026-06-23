import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { makeApiMock, type ApiMock, resTop } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))

let authUser: Record<string, unknown> | null = null
vi.mock('../store/useAuthStore', () => ({
  useAuthStore: () => ({ authUser, checkAuth: vi.fn() }),
}))

import api from '../services/api'
import useNotificationSSE from './useNotificationSSE'

const apiMock = api as unknown as ApiMock

beforeEach(() => {
  vi.clearAllMocks()
  authUser = null
  // jsdom has no EventSource — stub it (never actually constructed in these tests)
  ;(globalThis as unknown as { EventSource: unknown }).EventSource = class {
    close = vi.fn()
  }
})

describe('useNotificationSSE', () => {
  it('does nothing when there is no authenticated user', () => {
    renderHook(() => useNotificationSSE())
    expect(apiMock.post).not.toHaveBeenCalled()
  })

  it('requests a one-time SSE token when authenticated', () => {
    authUser = { role: 'booster' }
    apiMock.post.mockResolvedValueOnce(resTop({ token: '' })) // empty token → no EventSource opened
    renderHook(() => useNotificationSSE())
    expect(apiMock.post).toHaveBeenCalledWith('/notifications/sse-token')
  })
})
