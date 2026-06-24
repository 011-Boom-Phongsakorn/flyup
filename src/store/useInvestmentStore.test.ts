import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, makeToast, type ApiMock, res, apiError } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
vi.mock('react-hot-toast', () => { const t = makeToast(); return { default: t, toast: t } })
import api from '../services/api'
import { useInvestmentStore } from './useInvestmentStore'

const apiMock = api as unknown as ApiMock

describe('useInvestmentStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useInvestmentStore.setState({ isSubmitting: false, investmentData: null })
  })

  it('createInvestment stores the response and returns true', async () => {
    apiMock.post.mockResolvedValueOnce(res({ id: 1, amount: 500 }))
    const ok = await useInvestmentStore.getState().createInvestment({ project_id: 1, amount: 500 } as never)
    expect(apiMock.post).toHaveBeenCalledWith('/investments', { project_id: 1, amount: 500 })
    expect(ok).toBe(true)
    expect(useInvestmentStore.getState().investmentData).toEqual({ id: 1, amount: 500 })
    expect(useInvestmentStore.getState().isSubmitting).toBe(false)
  })

  it('createInvestment returns false on failure', async () => {
    apiMock.post.mockRejectedValueOnce(apiError('limit exceeded'))
    const ok = await useInvestmentStore.getState().createInvestment({ project_id: 1, amount: 999 } as never)
    expect(ok).toBe(false)
    expect(useInvestmentStore.getState().isSubmitting).toBe(false)
  })

  it('clearInvestmentData resets investmentData', () => {
    useInvestmentStore.setState({ investmentData: { id: 1 } as never })
    useInvestmentStore.getState().clearInvestmentData()
    expect(useInvestmentStore.getState().investmentData).toBeNull()
  })
})
