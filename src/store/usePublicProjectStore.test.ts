import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
import api from '../services/api'
import { usePublicProjectStore } from './usePublicProjectStore'

const apiMock = api as unknown as ApiMock

describe('usePublicProjectStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    usePublicProjectStore.setState({
      publicProjects: [], currentPublicProject: null, categories: [],
      platformStats: null, isLoading: false, isDetailLoading: false,
    })
  })

  it('fetchPublicProjects loads the listing', async () => {
    apiMock.get.mockResolvedValueOnce(res([{ id: 1, slug: 'a' }, { id: 2, slug: 'b' }]))
    await usePublicProjectStore.getState().fetchPublicProjects()
    expect(apiMock.get).toHaveBeenCalledWith('/projects')
    expect(usePublicProjectStore.getState().publicProjects).toHaveLength(2)
    expect(usePublicProjectStore.getState().isLoading).toBe(false)
  })

  it('fetchHomeProjects fans out to the four section endpoints', async () => {
    apiMock.get.mockResolvedValue(res([]))
    await usePublicProjectStore.getState().fetchHomeProjects()
    const urls = apiMock.get.mock.calls.map((c) => c[0])
    expect(urls).toEqual(expect.arrayContaining([
      '/projects/recommend', '/projects/new', '/projects/ending', '/projects/executing',
    ]))
  })

  it('fetchPublicProjectBySlug stores the current project', async () => {
    apiMock.get.mockResolvedValueOnce(res({ id: 7, slug: 'alpha' }))
    await usePublicProjectStore.getState().fetchPublicProjectBySlug('alpha')
    expect(apiMock.get).toHaveBeenCalledWith('/projects/slug/alpha')
    expect(usePublicProjectStore.getState().currentPublicProject).toEqual({ id: 7, slug: 'alpha' })
  })

  it('fetchPlatformStats stores stats', async () => {
    apiMock.get.mockResolvedValueOnce(res({ total_projects: 5 }))
    await usePublicProjectStore.getState().fetchPlatformStats()
    expect(apiMock.get).toHaveBeenCalledWith('/stats')
    expect(usePublicProjectStore.getState().platformStats).toEqual({ total_projects: 5 })
  })

  it('clears the current project to null on detail failure', async () => {
    apiMock.get.mockRejectedValueOnce(new Error('404'))
    await usePublicProjectStore.getState().fetchPublicProjectById(123)
    expect(usePublicProjectStore.getState().currentPublicProject).toBeNull()
  })
})
