import { create } from 'zustand'
import api from '../services/api'

export interface ProfitPayoutItem {
  id: number
  project_id: number
  project_title: string
  cover_image?: string | null
  quarter_no: number
  amount: number
  share_pct: number
  status: 'pending' | 'confirmed'
  transfer_ref: string
  confirmed_at?: string
  created_at: string
}

interface BoosterProfitStore {
  items: ProfitPayoutItem[]
  isLoading: boolean
  totalConfirmed: number
  fetchProfitPayouts: () => Promise<void>
}

export const useBoosterProfitStore = create<BoosterProfitStore>((set) => ({
  items: [],
  isLoading: false,
  totalConfirmed: 0,

  fetchProfitPayouts: async () => {
    set({ isLoading: true })
    try {
      const res = await api.get('/me/profit-payouts')
      const items: ProfitPayoutItem[] = res.data?.data ?? []
      const totalConfirmed = items
        .filter(i => i.status === 'confirmed')
        .reduce((s, i) => s + i.amount, 0)
      set({ items, totalConfirmed })
    } catch {
      // ignore
    } finally {
      set({ isLoading: false })
    }
  },
}))
