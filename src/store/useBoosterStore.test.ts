import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, type ApiMock, res, apiError } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
import api from '../services/api'
import { useBoosterStore } from './useBoosterStore'

const apiMock = api as unknown as ApiMock

describe('useBoosterStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useBoosterStore.setState({ investments: [], currentInvestment: null, isLoading: false, isDetailLoading: false })
  })

  it('fetchMyInvestments merges project metadata', async () => {
    apiMock.get
      .mockResolvedValueOnce(res([{ id: 1, project_id: 1, amount: 100 }]))                    // /investments
      .mockResolvedValueOnce(res([{ project_id: 1, title: 'P', cover_image: null, profit_share_pct: 10 }])) // /investments/my-projects
    await useBoosterStore.getState().fetchMyInvestments()
    expect(apiMock.get).toHaveBeenCalledWith('/investments')
    const list = useBoosterStore.getState().investments
    expect(list).toHaveLength(1)
    expect(list[0].project?.title).toBe('P')
  })

  it('fetchMyInvestments resets to empty on failure', async () => {
    apiMock.get.mockRejectedValueOnce(new Error('500'))
    await useBoosterStore.getState().fetchMyInvestments()
    expect(useBoosterStore.getState().investments).toEqual([])
    expect(useBoosterStore.getState().isLoading).toBe(false)
  })

  it('requestRefund returns true on success', async () => {
    apiMock.post.mockResolvedValueOnce(res({}))
    const ok = await useBoosterStore.getState().requestRefund(5, 'changed mind')
    expect(apiMock.post).toHaveBeenCalledWith('/investments/5/refund', { note: 'changed mind' })
    expect(ok).toBe(true)
  })

  it('voteOnMilestone returns true on success', async () => {
    apiMock.post.mockResolvedValueOnce(res({}))
    const result = await useBoosterStore.getState().voteOnMilestone(9, { choice: 'approve' })
    expect(apiMock.post).toHaveBeenCalledWith('/investments/milestones/9/vote', { choice: 'approve' })
    expect(result).toBe(true)
  })

  it('voteOnMilestone reports already_voted', async () => {
    apiMock.post.mockRejectedValueOnce(apiError('you have already voted'))
    const result = await useBoosterStore.getState().voteOnMilestone(9, { choice: 'reject' })
    expect(result).toBe('already_voted')
  })
})
