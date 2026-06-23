import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, makeToast, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
vi.mock('react-hot-toast', () => { const t = makeToast(); return { default: t, toast: t } })
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAdminProfitPoolStore } from './useAdminProfitPoolStore'

const apiMock = api as unknown as ApiMock

describe('useAdminProfitPoolStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAdminProfitPoolStore.setState({ pools: [], detail: null, isLoading: false, isCreating: false, isConfirming: false })
  })

  it('fetchPools loads the pool list', async () => {
    apiMock.get.mockResolvedValueOnce(res([{ id: 1 }]))
    await useAdminProfitPoolStore.getState().fetchPools()
    expect(apiMock.get).toHaveBeenCalledWith('/admin/profit-pools')
    expect(useAdminProfitPoolStore.getState().pools).toHaveLength(1)
  })

  it('fetchDetail loads a single pool', async () => {
    apiMock.get.mockResolvedValueOnce(res({ id: 5 }))
    await useAdminProfitPoolStore.getState().fetchDetail(5)
    expect(apiMock.get).toHaveBeenCalledWith('/admin/profit-pools/5')
    expect(useAdminProfitPoolStore.getState().detail).toEqual({ id: 5 })
  })

  it('createPool posts and returns true on success', async () => {
    apiMock.post.mockResolvedValueOnce(res({ id: 1 }))
    const ok = await useAdminProfitPoolStore.getState().createPool(1, 1000, 'REF', 'note', 2)
    expect(apiMock.post).toHaveBeenCalledWith('/admin/profit-pools', expect.any(Object))
    expect(toast.success).toHaveBeenCalledWith('สร้างรายการกำไรสำเร็จ')
    expect(ok).toBe(true)
  })

  it('confirmPayout returns false on failure', async () => {
    apiMock.patch.mockRejectedValueOnce(new Error('400'))
    const ok = await useAdminProfitPoolStore.getState().confirmPayout(1, 2, 'REF', 'n')
    expect(ok).toBe(false)
  })
})
