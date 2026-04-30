import { create } from 'zustand'
import api from '../services/api'

export interface Category {
    id: number
    name: string
}

export interface CategoryFormData {
    name: string
}

interface AdminCategoryStore {
    categories: Category[]
    isCategoriesLoading: boolean

    fetchCategories: () => Promise<void>
    createCategory: (data: CategoryFormData) => Promise<void>
    updateCategory: (id: number, data: CategoryFormData) => Promise<void>
    deleteCategory: (id: number) => Promise<void>
}

export const useAdminCategoryStore = create<AdminCategoryStore>((set) => ({
    categories: [],
    isCategoriesLoading: false,

    fetchCategories: async () => {
        set({ isCategoriesLoading: true })
        try {
            const res = await api.get('/categories')
            const categories: Category[] = res.data?.data ?? []
            set({ categories })
        } catch (error) {
            console.error('fetchCategories:', error)
        } finally {
            set({ isCategoriesLoading: false })
        }
    },

    createCategory: async (data: CategoryFormData) => {
        await api.post('/admin/categories', data)
    },

    updateCategory: async (id: number, data: CategoryFormData) => {
        await api.put(`/admin/categories/${id}`, data)
    },

    deleteCategory: async (id: number) => {
        await api.delete(`/admin/categories/${id}`)
    },
}))
