import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, makeToast, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
vi.mock('react-hot-toast', () => { const t = makeToast(); return { default: t, toast: t } })
import api from '../services/api'
import toast from 'react-hot-toast'
import { usePioneerPayoutStore } from './usePioneerPayoutStore'

const apiMock = api as unknown as ApiMock

describe('usePioneerPayoutStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    usePioneerPayoutStore.setState({ payouts: [], isLoading: false })
  })

  it('fetchPayouts loads payouts from /pioneer/payouts', async () => {
    apiMock.get.mockResolvedValueOnce(res([{ id: 1 }]))
    await usePioneerPayoutStore.getState().fetchPayouts()
    expect(apiMock.get).toHaveBeenCalledWith('/pioneer/payouts')
    expect(usePioneerPayoutStore.getState().payouts).toHaveLength(1)
    expect(usePioneerPayoutStore.getState().isLoading).toBe(false)
  })

  it('toasts an error on failure', async () => {
    apiMock.get.mockRejectedValueOnce(new Error('500'))
    await usePioneerPayoutStore.getState().fetchPayouts()
    expect(toast.error).toHaveBeenCalledWith('ไม่สามารถโหลดข้อมูลการจ่ายเงินได้')
  })
})
