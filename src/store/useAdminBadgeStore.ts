import { create } from 'zustand'
import api from '../services/api'

export interface AdminBadgeCounts {
    pending_projects: number
    submitted_milestones: number
    pending_cancel_requests: number
    open_complaints: number
    pending_refunds: number
    pending_verifications: number
    pending_disbursements: number
    pending_profit_pools: number
}

interface AdminBadgeStore {
    counts: AdminBadgeCounts
    fetchBadges: () => Promise<void>
}

const empty: AdminBadgeCounts = {
    pending_projects: 0,
    submitted_milestones: 0,
    pending_cancel_requests: 0,
    open_complaints: 0,
    pending_refunds: 0,
    pending_verifications: 0,
    pending_disbursements: 0,
    pending_profit_pools: 0,
}

export const useAdminBadgeStore = create<AdminBadgeStore>((set) => ({
    counts: empty,
    fetchBadges: async () => {
        try {
            const res = await api.get('/admin/badges')
            set({ counts: res.data?.data ?? empty })
        } catch {
            // ignore
        }
    },
}))
