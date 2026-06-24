import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, makeToast, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
vi.mock('react-hot-toast', () => { const t = makeToast(); return { default: t, toast: t } })
import api from '../services/api'
import toast from 'react-hot-toast'
import { useMeetingStore } from './useMeetingStore'

const apiMock = api as unknown as ApiMock

describe('useMeetingStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useMeetingStore.setState({ meetings: [], milestones: [], isSubmitting: false })
  })

  it('createMeeting posts and returns true', async () => {
    apiMock.post.mockResolvedValueOnce(res({}))
    const ok = await useMeetingStore.getState().createMeeting({ milestone_id: 1 } as never)
    expect(apiMock.post).toHaveBeenCalledWith('/pioneer/projects/meeting', { milestone_id: 1 })
    expect(toast.success).toHaveBeenCalledWith('ส่งนัดหมายเรียบร้อยแล้ว')
    expect(ok).toBe(true)
    expect(useMeetingStore.getState().isSubmitting).toBe(false)
  })

  it('editMeeting patches the meeting', async () => {
    apiMock.patch.mockResolvedValueOnce(res({}))
    const ok = await useMeetingStore.getState().editMeeting(7, { milestone_id: 1 } as never)
    expect(apiMock.patch).toHaveBeenCalledWith('/pioneer/projects/meeting/7', { milestone_id: 1 })
    expect(ok).toBe(true)
  })

  it('cancelMeeting patches the cancel endpoint', async () => {
    apiMock.patch.mockResolvedValueOnce(res({}))
    const ok = await useMeetingStore.getState().cancelMeeting(7)
    expect(apiMock.patch).toHaveBeenCalledWith('/pioneer/projects/cancel/meeting/7')
    expect(toast.success).toHaveBeenCalledWith('ยกเลิกนัดหมายเรียบร้อยแล้ว')
    expect(ok).toBe(true)
  })

  it('createMeeting returns false on failure', async () => {
    apiMock.post.mockRejectedValueOnce(new Error('400'))
    const ok = await useMeetingStore.getState().createMeeting({ milestone_id: 1 } as never)
    expect(ok).toBe(false)
  })
})
