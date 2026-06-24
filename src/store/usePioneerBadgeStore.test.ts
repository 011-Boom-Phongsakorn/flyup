import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
import api from '../services/api'
import { usePioneerBadgeStore } from './usePioneerBadgeStore'

const apiMock = api as unknown as ApiMock
const empty = { active_milestones: 0, upcoming_meetings: 0, pending_payouts: 0 }

describe('usePioneerBadgeStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    usePioneerBadgeStore.setState({ counts: empty })
  })

  it('fetchBadges loads counts from /pioneer/badges', async () => {
    apiMock.get.mockResolvedValueOnce(res({ active_milestones: 3, upcoming_meetings: 1, pending_payouts: 2 }))
    await usePioneerBadgeStore.getState().fetchBadges()
    expect(apiMock.get).toHaveBeenCalledWith('/pioneer/badges')
    expect(usePioneerBadgeStore.getState().counts).toEqual({ active_milestones: 3, upcoming_meetings: 1, pending_payouts: 2 })
  })

  it('keeps counts empty when the request fails', async () => {
    apiMock.get.mockRejectedValueOnce(new Error('network'))
    await usePioneerBadgeStore.getState().fetchBadges()
    expect(usePioneerBadgeStore.getState().counts).toEqual(empty)
  })
})
