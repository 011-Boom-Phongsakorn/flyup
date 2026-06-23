import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
import api from '../services/api'
import { useBoosterBadgeStore } from './useBoosterBadgeStore'

const apiMock = api as unknown as ApiMock
const empty = { pending_votes: 0, upcoming_meetings: 0, pending_refunds: 0, open_complaints: 0 }

describe('useBoosterBadgeStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useBoosterBadgeStore.setState({ counts: empty })
  })

  it('fetchBadges loads counts from /booster/badges', async () => {
    apiMock.get.mockResolvedValueOnce(res({ pending_votes: 2, upcoming_meetings: 1, pending_refunds: 0, open_complaints: 3 }))
    await useBoosterBadgeStore.getState().fetchBadges()
    expect(apiMock.get).toHaveBeenCalledWith('/booster/badges')
    expect(useBoosterBadgeStore.getState().counts.open_complaints).toBe(3)
  })

  it('keeps counts empty on failure', async () => {
    apiMock.get.mockRejectedValueOnce(new Error('network'))
    await useBoosterBadgeStore.getState().fetchBadges()
    expect(useBoosterBadgeStore.getState().counts).toEqual(empty)
  })
})
