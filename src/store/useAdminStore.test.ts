import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, makeToast, type ApiMock, res, resTop } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
vi.mock('react-hot-toast', () => { const t = makeToast(); return { default: t, toast: t } })
import api from '../services/api'
import { useAdminStore } from './useAdminStore'

const apiMock = api as unknown as ApiMock

describe('useAdminStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAdminStore.setState({ pendingProjects: [], pendingMilestones: [], isLoading: false })
  })

  it('fetchPendingProjects loads the review queue', async () => {
    apiMock.get.mockResolvedValueOnce(res([{ id: 1 }]))
    await useAdminStore.getState().fetchPendingProjects()
    expect(apiMock.get).toHaveBeenCalledWith('/admin/projects/pending-review')
    expect(useAdminStore.getState().pendingProjects).toHaveLength(1)
  })

  it('fetchPendingMilestones loads submitted milestones', async () => {
    apiMock.get.mockResolvedValueOnce(res([{ id: 1 }, { id: 2 }]))
    await useAdminStore.getState().fetchPendingMilestones()
    expect(apiMock.get).toHaveBeenCalledWith('/admin/projects/milestones/submitted')
    expect(useAdminStore.getState().pendingMilestones).toHaveLength(2)
  })

  it('approveProject patches the approve endpoint', async () => {
    apiMock.patch.mockResolvedValueOnce(res({}))
    await useAdminStore.getState().approveProject(5)
    expect(apiMock.patch).toHaveBeenCalledWith('/admin/projects/5/approve')
  })

  it('fetchAdminUsers returns users + total from the paged response', async () => {
    apiMock.get.mockResolvedValueOnce(resTop({ data: [{ id: 1 }], meta: { total: 1 } }))
    const result = await useAdminStore.getState().fetchAdminUsers({ page: 1, pageSize: 20 })
    const url = apiMock.get.mock.calls[0][0] as string
    expect(url).toContain('/admin/list-users?')
    expect(result).toEqual({ users: [{ id: 1 }], total: 1 })
  })

  it('suspendUser patches with the reason', async () => {
    apiMock.patch.mockResolvedValueOnce(res({}))
    await useAdminStore.getState().suspendUser(3, 'spam')
    expect(apiMock.patch).toHaveBeenCalledWith('/admin/suspend-user/3', { reason: 'spam' })
  })
})
