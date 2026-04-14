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
    CreatedAt: string
}

export interface PendingMilestone {
    id: number
    phase_no: number
    title: string
    status: string
    submitted_at: string
    project_id: number
    project_title: string
    owner?: {
        first_name: string
        last_name: string
    }
}

interface AdminStore {
    pendingProjects: PendingProject[]
    pendingMilestones: PendingMilestone[]
    isLoading: boolean
    isMilestoneLoading: boolean
    fetchPendingProjects: () => Promise<void>
    fetchPendingMilestones: () => Promise<void>
}

export const useAdminStore = create<AdminStore>((set) => ({
    pendingProjects: [],
    pendingMilestones: [],
    isLoading: false,
    isMilestoneLoading: false,

    fetchPendingProjects: async () => {
        set({ isLoading: true })
        try {
            const res = await api.get('/admin/projects/pending-review')
            set({ pendingProjects: res.data.data ?? [] })
        } finally {
            set({ isLoading: false })
        }
    },

    fetchPendingMilestones: async () => {
        set({ isMilestoneLoading: true })
        try {
            const res = await api.get('/admin/milestones/submitted')
            set({ pendingMilestones: res.data.data ?? [] })
        } finally {
            set({ isMilestoneLoading: false })
        }
    },
}))
