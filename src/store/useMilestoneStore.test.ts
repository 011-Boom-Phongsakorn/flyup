import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, makeToast, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
vi.mock('react-hot-toast', () => { const t = makeToast(); return { default: t, toast: t } })
import api from '../services/api'
import toast from 'react-hot-toast'
import { useMilestoneStore } from './useMilestoneStore'

const apiMock = api as unknown as ApiMock

describe('useMilestoneStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useMilestoneStore.setState({ milestones: [], isOpeningVoting: false, isSubmitting: false })
    apiMock.get.mockResolvedValue(res({}))
  })

  it('openVoting patches the open-vote endpoint and returns true', async () => {
    apiMock.patch.mockResolvedValueOnce(res({}))
    const ok = await useMilestoneStore.getState().openVoting(9, '1')
    expect(apiMock.patch).toHaveBeenCalledWith('/pioneer/projects/milestones/9/open-vote')
    expect(toast.success).toHaveBeenCalledWith('เปิดการโหวตเรียบร้อยแล้ว')
    expect(ok).toBe(true)
  })

  it('openVoting returns false on failure', async () => {
    apiMock.patch.mockRejectedValueOnce(new Error('400'))
    const ok = await useMilestoneStore.getState().openVoting(9, '1')
    expect(ok).toBe(false)
  })

  it('recallEvidence patches the cancel endpoint and flips status back', async () => {
    useMilestoneStore.setState({ milestones: [{ id: 5, status: 'voting' } as never] })
    apiMock.patch.mockResolvedValueOnce(res({}))
    const ok = await useMilestoneStore.getState().recallEvidence(5)
    expect(apiMock.patch).toHaveBeenCalledWith('/pioneer/projects/milestones/5/cancel')
    expect(ok).toBe(true)
    expect(useMilestoneStore.getState().milestones[0].status).toBe('in_progress')
  })
})
