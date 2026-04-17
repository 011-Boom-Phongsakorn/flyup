import { create } from 'zustand'
import api from '../services/api'
import toast from 'react-hot-toast'

export interface RefundRequest {
    id: number
    amount: number
    status: string
    requested_at: string
    approved_at?: string
    project?: { id: number; title: string }
    booster?: { first_name: string; last_name: string; email: string }
}

interface RefundStore {
    refunds: RefundRequest[]
    isLoading: boolean
    fetchRefunds: () => Promise<void>
    approveRefund: (id: number) => Promise<void>
}

export const useRefundStore = create<RefundStore>((set) => ({
    refunds: [],
    isLoading: false,

    fetchRefunds: async () => {
        set({ isLoading: true })
        try {
            const res = await api.get('/admin/investments/refund-requests')
            set({ refunds: res.data.data ?? [] })
        } catch {
            toast.error('โหลดข้อมูลไม่สำเร็จ')
        } finally {
            set({ isLoading: false })
        }
    },

    approveRefund: async (id) => {
        await api.patch(`/admin/investments/${id}/approve-refund`)
        toast.success('อนุมัติการคืนเงินสำเร็จ')
        set((state) => ({
            refunds: state.refunds.map((r) =>
                r.id === id ? { ...r, status: 'approved', approved_at: new Date().toISOString() } : r
            ),
        }))
    },
}))
