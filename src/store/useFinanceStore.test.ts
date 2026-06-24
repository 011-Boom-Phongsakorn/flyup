import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
import api from '../services/api'
import { useFinanceStore } from './useFinanceStore'

const apiMock = api as unknown as ApiMock

describe('useFinanceStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useFinanceStore.setState({ summary: null, projects: [], isLoadingSummary: false, isLoadingProjects: false })
  })

  it('fetchSummary loads the financial summary', async () => {
    apiMock.get.mockResolvedValueOnce(res({ total_funding: 99999 }))
    await useFinanceStore.getState().fetchSummary()
    expect(apiMock.get).toHaveBeenCalledWith('/admin/financial/summary')
    expect(useFinanceStore.getState().summary).toEqual({ total_funding: 99999 })
    expect(useFinanceStore.getState().isLoadingSummary).toBe(false)
  })

  it('fetchProjects loads the per-project breakdown', async () => {
    apiMock.get.mockResolvedValueOnce(res([{ id: 1 }, { id: 2 }]))
    await useFinanceStore.getState().fetchProjects()
    expect(apiMock.get).toHaveBeenCalledWith('/admin/financial/projects')
    expect(useFinanceStore.getState().projects).toHaveLength(2)
  })

  it('leaves summary null when the request fails', async () => {
    apiMock.get.mockRejectedValueOnce(new Error('500'))
    await useFinanceStore.getState().fetchSummary()
    expect(useFinanceStore.getState().summary).toBeNull()
    expect(useFinanceStore.getState().isLoadingSummary).toBe(false)
  })
})
