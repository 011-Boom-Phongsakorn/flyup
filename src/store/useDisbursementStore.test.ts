import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, makeToast, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
vi.mock('react-hot-toast', () => { const t = makeToast(); return { default: t, toast: t } })
import api from '../services/api'
import toast from 'react-hot-toast'
import { useDisbursementStore } from './useDisbursementStore'

const apiMock = api as unknown as ApiMock

describe('useDisbursementStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useDisbursementStore.setState({ disbursements: [], isLoading: false })
  })

  it('fetchAll loads every disbursement', async () => {
    apiMock.get.mockResolvedValueOnce(res([{ id: 1 }, { id: 2 }]))
    await useDisbursementStore.getState().fetchAll()
    expect(apiMock.get).toHaveBeenCalledWith('/admin/disbursements')
    expect(useDisbursementStore.getState().disbursements).toHaveLength(2)
  })

  it('fetchPending hits the pending endpoint', async () => {
    apiMock.get.mockResolvedValueOnce(res([{ id: 9 }]))
    await useDisbursementStore.getState().fetchPending()
    expect(apiMock.get).toHaveBeenCalledWith('/admin/disbursements/pending')
  })

  it('confirm posts transfer details and returns true', async () => {
    apiMock.patch.mockResolvedValueOnce(res({}))
    const ok = await useDisbursementStore.getState().confirm(5, 'REF-1', 'note')
    expect(apiMock.patch).toHaveBeenCalledWith('/admin/disbursements/5/confirm', { transfer_ref: 'REF-1', note: 'note' })
    expect(toast.success).toHaveBeenCalledWith('ยืนยันการโอนเงินสำเร็จ')
    expect(ok).toBe(true)
  })

  it('confirm returns false on failure', async () => {
    apiMock.patch.mockRejectedValueOnce(new Error('400'))
    const ok = await useDisbursementStore.getState().confirm(5, 'REF', 'n')
    expect(ok).toBe(false)
  })
})
