import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, makeToast, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
vi.mock('react-hot-toast', () => { const t = makeToast(); return { default: t, toast: t } })
import api from '../services/api'
import { useAdminCategoryStore } from './useAdminCategoryStore'

const apiMock = api as unknown as ApiMock

describe('useAdminCategoryStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAdminCategoryStore.setState({ categories: [], isCategoriesLoading: false })
    // create/update/delete re-fetch categories → stub the trailing GET
    apiMock.get.mockResolvedValue(res([]))
  })

  it('fetchCategories loads the list', async () => {
    apiMock.get.mockResolvedValueOnce(res([{ id: 1, name: 'เทคโนโลยี' }]))
    await useAdminCategoryStore.getState().fetchCategories()
    expect(apiMock.get).toHaveBeenCalledWith('/categories')
    expect(useAdminCategoryStore.getState().categories).toHaveLength(1)
  })

  it('createCategory POSTs to /admin/categories', async () => {
    apiMock.post.mockResolvedValueOnce(res({ id: 2 }))
    await useAdminCategoryStore.getState().createCategory({ name: 'ใหม่' } as never)
    expect(apiMock.post).toHaveBeenCalledWith('/admin/categories', { name: 'ใหม่' })
  })

  it('updateCategory PUTs to /admin/categories/:id', async () => {
    apiMock.put.mockResolvedValueOnce(res({}))
    await useAdminCategoryStore.getState().updateCategory(3, { name: 'แก้' } as never)
    expect(apiMock.put).toHaveBeenCalledWith('/admin/categories/3', { name: 'แก้' })
  })

  it('deleteCategory DELETEs /admin/categories/:id', async () => {
    apiMock.delete.mockResolvedValueOnce(res({}))
    await useAdminCategoryStore.getState().deleteCategory(4)
    expect(apiMock.delete).toHaveBeenCalledWith('/admin/categories/4')
  })
})
