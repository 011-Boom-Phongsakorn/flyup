import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
import api from '../services/api'
import { useProjectDetailStore } from './useProjectDetailStore'

const apiMock = api as unknown as ApiMock

describe('useProjectDetailStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useProjectDetailStore.setState({ updates: [], threads: [], faqs: [], investorCount: 0, isLoading: false })
  })

  it('fetchUpdates loads project updates', async () => {
    apiMock.get.mockResolvedValueOnce(res([{ id: 1 }]))
    await useProjectDetailStore.getState().fetchUpdates(7)
    expect(apiMock.get).toHaveBeenCalledWith('/projects/7/updates')
    expect(useProjectDetailStore.getState().updates).toHaveLength(1)
  })

  it('fetchFAQs loads faqs', async () => {
    apiMock.get.mockResolvedValueOnce(res([{ id: 1 }, { id: 2 }]))
    await useProjectDetailStore.getState().fetchFAQs(7)
    expect(apiMock.get).toHaveBeenCalledWith('/projects/7/faqs')
    expect(useProjectDetailStore.getState().faqs).toHaveLength(2)
  })

  it('fetchInvestorCount reads the total', async () => {
    apiMock.get.mockResolvedValueOnce(res({ total: 42 }))
    await useProjectDetailStore.getState().fetchInvestorCount(7)
    expect(apiMock.get).toHaveBeenCalledWith('/investments/projects/7/investors')
    expect(useProjectDetailStore.getState().investorCount).toBe(42)
  })

  it('fetchInvestorCount falls back to 0 on failure', async () => {
    apiMock.get.mockRejectedValueOnce(new Error('500'))
    await useProjectDetailStore.getState().fetchInvestorCount(7)
    expect(useProjectDetailStore.getState().investorCount).toBe(0)
  })
})
