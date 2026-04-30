import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import api from '../services/api'

export interface PioneerPayoutItem {
  id: number
  milestone_id: number
  project_id: number
  project_title: string
  phase_no: number
  percent_release: number
  amount: number
  status: 'pending' | 'confirmed'
  transfer_ref: string
  admin_note: string
  created_at: string
  confirmed_at?: string
  all_phases_complete: boolean
}

interface PioneerPayoutStore {
  payouts: PioneerPayoutItem[]
  isLoading: boolean
  fetchPayouts: () => Promise<void>
}

export const usePioneerPayoutStore = create<PioneerPayoutStore>((set) => ({
  payouts: [],
  isLoading: false,

  fetchPayouts: async () => {
    set({ isLoading: true })
    try {
      const res = await api.get('/pioneer/payouts')
      set({ payouts: res.data?.data ?? [] })
    } catch {
      toast.error('ไม่สามารถโหลดข้อมูลการจ่ายเงินได้')
    } finally {
      set({ isLoading: false })
    }
  },
}))
