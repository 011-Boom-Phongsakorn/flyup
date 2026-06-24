import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, makeToast, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
vi.mock('react-hot-toast', () => { const t = makeToast(); return { default: t, toast: t } })
import api from '../services/api'
import toast from 'react-hot-toast'
import { useRefundStore } from './useRefundStore'

const apiMock = api as unknown as ApiMock

describe('useRefundStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useRefundStore.setState({ refunds: [], isLoading: false })
  })

  it('fetchRefunds loads pending refund requests', async () => {
    apiMock.get.mockResolvedValueOnce(res([{ id: 1, status: 'pending' }]))
    await useRefundStore.getState().fetchRefunds()
    expect(apiMock.get).toHaveBeenCalledWith('/admin/investments/refund-requests')
    expect(useRefundStore.getState().refunds).toHaveLength(1)
  })

  it('toasts an error and stops loading on failure', async () => {
    apiMock.get.mockRejectedValueOnce(new Error('500'))
    await useRefundStore.getState().fetchRefunds()
    expect(toast.error).toHaveBeenCalledWith('โหลดข้อมูลไม่สำเร็จ')
    expect(useRefundStore.getState().isLoading).toBe(false)
  })

  it('approveRefund calls the approve endpoint and updates the row', async () => {
    useRefundStore.setState({ refunds: [{ id: 7, status: 'pending' } as never] })
    apiMock.patch.mockResolvedValueOnce(res({}))
    await useRefundStore.getState().approveRefund(7)
    expect(apiMock.patch).toHaveBeenCalledWith('/admin/investments/7/approve-refund')
    expect(toast.success).toHaveBeenCalledWith('อนุมัติการคืนเงินสำเร็จ')
  })
})
