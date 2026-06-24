import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AxiosError } from 'axios'

// vi.mock is hoisted to the top of the file, so any value its factory references
// must be created with vi.hoisted (also hoisted) — otherwise we'd hit a
// "cannot access before initialization" error.
const { mockApi, setStoredToken, clearStoredTokens, toastError, toastSuccess } = vi.hoisted(() => ({
  mockApi: { get: vi.fn(), post: vi.fn(), patch: vi.fn() },
  setStoredToken: vi.fn(),
  clearStoredTokens: vi.fn(),
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}))

// ── Mock the api module (axios instance + token helpers) ───────────────────────
vi.mock('../services/api', () => ({
  default: mockApi,
  setStoredToken,
  clearStoredTokens,
}))

// ── Mock toast so we can assert on user-facing messages ────────────────────────
vi.mock('react-hot-toast', () => ({
  default: { error: toastError, success: toastSuccess },
  toast: { error: toastError, success: toastSuccess },
}))

import { useAuthStore } from './useAuthStore'

// Helper to build an AxiosError with a given response body
function axiosError(data: unknown, code?: string): AxiosError {
  const err = new AxiosError('request failed', code)
  // @ts-expect-error partial response is fine for the test
  err.response = { data }
  return err
}

describe('useAuthStore.login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({ authUser: null, isLoggingIn: false })
  })

  it('stores the token and sets authUser on success', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { token: 'jwt-123' } })
    mockApi.get.mockResolvedValueOnce({ data: { data: { role: 'booster', email: 'a@b.com' } } })

    await useAuthStore.getState().login({ email: 'a@b.com', password: 'pw' })

    expect(mockApi.post).toHaveBeenCalledWith('/signin', { email: 'a@b.com', password: 'pw' })
    expect(setStoredToken).toHaveBeenCalledWith('jwt-123')
    expect(useAuthStore.getState().authUser).toEqual({ role: 'booster', email: 'a@b.com' })
    expect(useAuthStore.getState().isLoggingIn).toBe(false)
  })

  it('shows "wrong email/password" on a generic auth failure', async () => {
    mockApi.post.mockRejectedValueOnce(axiosError({ error: 'invalid' }, 'ERR_BAD_REQUEST'))

    await useAuthStore.getState().login({ email: 'a@b.com', password: 'bad' })

    expect(toastError).toHaveBeenCalledWith('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    expect(useAuthStore.getState().authUser).toBeNull()
  })

  it('shows the verify-email message when backend asks for verification', async () => {
    mockApi.post.mockRejectedValueOnce(axiosError({ error: 'please verify email' }, 'ERR_BAD_REQUEST'))

    await useAuthStore.getState().login({ email: 'a@b.com', password: 'pw' })

    expect(toastError).toHaveBeenCalledWith('กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ')
  })

  it('shows a connection error on network failure', async () => {
    mockApi.post.mockRejectedValueOnce(axiosError({}, 'ERR_NETWORK'))

    await useAuthStore.getState().login({ email: 'a@b.com', password: 'pw' })

    expect(toastError).toHaveBeenCalledWith('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่')
  })
})

describe('useAuthStore.checkAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({ authUser: null, isCheckingAuth: true })
  })

  it('populates authUser from /user/me', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { data: { role: 'admin' } } })
    await useAuthStore.getState().checkAuth()
    expect(useAuthStore.getState().authUser).toEqual({ role: 'admin' })
    expect(useAuthStore.getState().isCheckingAuth).toBe(false)
  })

  it('leaves authUser null when /user/me fails', async () => {
    mockApi.get.mockRejectedValueOnce(new Error('401'))
    await useAuthStore.getState().checkAuth()
    expect(useAuthStore.getState().authUser).toBeNull()
    expect(useAuthStore.getState().isCheckingAuth).toBe(false)
  })
})

describe('useAuthStore.logout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({ authUser: { role: 'pioneer' } })
  })

  it('clears tokens and authUser even if the signout call fails', async () => {
    mockApi.post.mockRejectedValueOnce(new Error('network'))
    await useAuthStore.getState().logout()
    expect(clearStoredTokens).toHaveBeenCalled()
    expect(useAuthStore.getState().authUser).toBeNull()
  })
})
