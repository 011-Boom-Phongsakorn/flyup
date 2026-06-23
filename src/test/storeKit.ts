import { AxiosError } from 'axios'
import { vi, type Mock } from 'vitest'

/**
 * Small helpers shared by the zustand store tests.
 *
 * Mocking convention used in each store test (robust against vi.mock hoisting —
 * the spies are created *inside* the factory, then grabbed via the mocked import):
 *
 *   vi.mock('../services/api', () => ({ default: makeApiMock() }))
 *   vi.mock('react-hot-toast', () => { const t = makeToast(); return { default: t, toast: t } })
 *   import api from '../services/api'
 *   const apiMock = api as unknown as ApiMock
 */

export type ApiMock = Record<'get' | 'post' | 'patch' | 'put' | 'delete', Mock>

export const makeApiMock = (): ApiMock => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
})

export const makeToast = () => ({ error: vi.fn(), success: vi.fn() })

/** `{ data: { data: payload } }` — the most common API envelope in this app. */
export const res = (data: unknown) => ({ data: { data } })

/** `{ data: payload }` — endpoints that put data at the top level. */
export const resTop = (data: unknown) => ({ data })

/** An AxiosError whose `response.data` carries a `message` (+ optional extras). */
export const apiError = (message?: string, extra: Record<string, unknown> = {}) => {
  const e = new AxiosError(message ?? 'error')
  ;(e as unknown as { response: unknown }).response = { data: { message, ...extra } }
  return e
}
