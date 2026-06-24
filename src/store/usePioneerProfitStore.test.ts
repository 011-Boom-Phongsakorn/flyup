import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, makeToast, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
vi.mock('react-hot-toast', () => { const t = makeToast(); return { default: t, toast: t } })
import api from '../services/api'
import toast from 'react-hot-toast'
import { usePioneerProfitStore } from './usePioneerProfitStore'

const apiMock = api as unknown as ApiMock

describe('usePioneerProfitStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    usePioneerProfitStore.setState({ pools: [], isLoading: false, isSubmitting: false })
  })

  it('fetchPools loads profit pools', async () => {
    apiMock.get.mockResolvedValueOnce(res([{ id: 1 }]))
    await usePioneerProfitStore.getState().fetchPools()
    expect(apiMock.get).toHaveBeenCalledWith('/pioneer/profit-pools')
    expect(usePioneerProfitStore.getState().pools).toHaveLength(1)
  })

  it('submitProfit posts to the project pool endpoint and returns true', async () => {
    apiMock.post.mockResolvedValueOnce(res({}))
    const ok = await usePioneerProfitStore.getState().submitProfit(3, 2, 10000, 'REF-9')
    expect(apiMock.post).toHaveBeenCalledWith('/pioneer/profit-pools/3', expect.any(Object))
    expect(toast.success).toHaveBeenCalledWith('แจ้งโอนกำไรไตรมาส 2 เรียบร้อยแล้ว')
    expect(ok).toBe(true)
  })

  it('submitProfit returns false on failure', async () => {
    apiMock.post.mockRejectedValueOnce(new Error('400'))
    const ok = await usePioneerProfitStore.getState().submitProfit(3, 2, 10000, 'REF-9')
    expect(ok).toBe(false)
    expect(usePioneerProfitStore.getState().isSubmitting).toBe(false)
  })
})
