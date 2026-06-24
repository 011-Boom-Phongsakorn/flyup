import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, makeToast, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
vi.mock('react-hot-toast', () => { const t = makeToast(); return { default: t, toast: t } })
import api from '../services/api'
import toast from 'react-hot-toast'
import { useComplaintStore } from './useComplaintStore'

const apiMock = api as unknown as ApiMock

describe('useComplaintStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useComplaintStore.setState({ complaints: [], selected: null, isLoading: false, isSubmitting: false })
  })

  it('fileComplaint posts and returns true on success', async () => {
    apiMock.post.mockResolvedValueOnce(res({}))
    const ok = await useComplaintStore.getState().fileComplaint(1, 'subj', 'body')
    expect(apiMock.post).toHaveBeenCalledWith('/complaints', { project_id: 1, subject: 'subj', body: 'body' })
    expect(toast.success).toHaveBeenCalled()
    expect(ok).toBe(true)
  })

  it('fetchMyComplaints loads the user list', async () => {
    apiMock.get.mockResolvedValueOnce(res([{ id: 1 }]))
    await useComplaintStore.getState().fetchMyComplaints()
    expect(apiMock.get).toHaveBeenCalledWith('/complaints/me')
    expect(useComplaintStore.getState().complaints).toHaveLength(1)
  })

  it('fetchAdminDetail loads a single complaint', async () => {
    apiMock.get.mockResolvedValueOnce(res({ id: 9, subject: 's' }))
    await useComplaintStore.getState().fetchAdminDetail(9)
    expect(apiMock.get).toHaveBeenCalledWith('/admin/complaints/9')
    expect(useComplaintStore.getState().selected).toEqual({ id: 9, subject: 's' })
  })

  it('resolveComplaint patches and returns true', async () => {
    apiMock.patch.mockResolvedValueOnce(res({}))
    const ok = await useComplaintStore.getState().resolveComplaint(9, 'handled')
    expect(apiMock.patch).toHaveBeenCalledWith('/admin/complaints/9/resolve', { admin_note: 'handled' })
    expect(ok).toBe(true)
  })
})
