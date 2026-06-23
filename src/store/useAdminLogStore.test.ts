import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, type ApiMock, resTop } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
import api from '../services/api'
import { useAdminLogStore } from './useAdminLogStore'

const apiMock = api as unknown as ApiMock

describe('useAdminLogStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAdminLogStore.setState({
      logs: [], meta: { total: 0, page: 1, page_size: 20 }, isLoading: false,
      filter: { page: 1, page_size: 20 },
    })
  })

  it('setFilter merges and resets the page', () => {
    useAdminLogStore.getState().setFilter({ action: 'approve' })
    expect(useAdminLogStore.getState().filter).toMatchObject({ action: 'approve', page: 1 })
  })

  it('fetchLogs loads logs + meta and builds the query string', async () => {
    apiMock.get.mockResolvedValueOnce(resTop({ data: [{ id: 1 }], meta: { total: 1, page: 1, page_size: 20 } }))
    await useAdminLogStore.getState().fetchLogs()
    const calledUrl = apiMock.get.mock.calls[0][0] as string
    expect(calledUrl).toContain('/admin/logs?')
    expect(calledUrl).toContain('page=1')
    expect(useAdminLogStore.getState().logs).toHaveLength(1)
    expect(useAdminLogStore.getState().meta.total).toBe(1)
  })

  it('resets to empty on failure', async () => {
    useAdminLogStore.setState({ logs: [{ id: 99 } as never] })
    apiMock.get.mockRejectedValueOnce(new Error('500'))
    await useAdminLogStore.getState().fetchLogs()
    expect(useAdminLogStore.getState().logs).toEqual([])
  })
})
