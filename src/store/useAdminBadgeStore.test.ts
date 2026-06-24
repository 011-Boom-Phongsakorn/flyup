import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
import api from '../services/api'
import { useAdminBadgeStore } from './useAdminBadgeStore'

const apiMock = api as unknown as ApiMock

describe('useAdminBadgeStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAdminBadgeStore.setState({
      counts: {
        pending_projects: 0, submitted_milestones: 0, pending_cancel_requests: 0,
        open_complaints: 0, pending_refunds: 0, pending_verifications: 0,
        pending_disbursements: 0, pending_profit_pools: 0,
      },
    })
  })

  it('fetchBadges loads counts from /admin/badges', async () => {
    apiMock.get.mockResolvedValueOnce(res({ pending_projects: 5, submitted_milestones: 2 }))
    await useAdminBadgeStore.getState().fetchBadges()
    expect(apiMock.get).toHaveBeenCalledWith('/admin/badges')
    expect(useAdminBadgeStore.getState().counts.pending_projects).toBe(5)
  })

  it('keeps counts at zero on failure', async () => {
    apiMock.get.mockRejectedValueOnce(new Error('network'))
    await useAdminBadgeStore.getState().fetchBadges()
    expect(useAdminBadgeStore.getState().counts.pending_projects).toBe(0)
  })
})
