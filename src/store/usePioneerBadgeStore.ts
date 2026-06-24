import { create } from 'zustand'
import api from '../services/api'

export interface PioneerBadgeCounts {
    active_milestones: number
    upcoming_meetings: number
    pending_payouts: number
}

interface PioneerBadgeStore {
    counts: PioneerBadgeCounts
    fetchBadges: () => Promise<void>
}

const empty: PioneerBadgeCounts = {
    active_milestones: 0,
    upcoming_meetings: 0,
    pending_payouts: 0,
}

export const usePioneerBadgeStore = create<PioneerBadgeStore>((set) => ({
    counts: empty,
    fetchBadges: async () => {
        try {
            const res = await api.get('/pioneer/badges')
            set({ counts: res.data?.data ?? empty })
        } catch {
            // ignore
        }
    },
}))
