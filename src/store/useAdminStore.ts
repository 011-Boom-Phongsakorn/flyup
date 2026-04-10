import { create } from 'zustand'
import api from '../services/api'

export interface PendingProject {
    id: number
    title: string
    owner?: {
        first_name: string
        last_name: string
    }
    funding_goal: number
    state: string
    created_at: string
}

interface AdminStore {
    pendingProjects: PendingProject[]
    isLoading: boolean
    fetchPendingProjects: () => Promise<void>
}

export const useAdminStore = create<AdminStore>((set) => ({
    pendingProjects: [],
    isLoading: false,

    fetchPendingProjects: async () => {
        set({ isLoading: true })
        try {
            const res = await api.get('/admin/projects/pending-review')
            set({ pendingProjects: res.data.data ?? [] })
        } finally {
            set({ isLoading: false })
        }
    },
}))
