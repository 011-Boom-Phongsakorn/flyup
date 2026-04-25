import { create } from 'zustand'
import api from '../services/api'
import toast from 'react-hot-toast'

export interface DisbursementBankAccount {
    bank_name: string
    account_name: string
    account_number: string
}

export interface Disbursement {
    id: number
    milestone_id: number
    project_id: number
    project_title: string
    pioneer_user_id: number
    pioneer_name: string
    pioneer_email: string
    phase_no: number
    percent_release: number
    amount: number
    status: string
    transfer_ref: string
    admin_note: string
    created_at: string
    confirmed_at?: string | null
    bank_account: DisbursementBankAccount | null
}

interface DisbursementStore {
    disbursements: Disbursement[]
    isLoading: boolean
    fetchAll: () => Promise<void>
    fetchPending: () => Promise<void>
    confirm: (id: number, transferRef: string, note: string) => Promise<boolean>
}

export const useDisbursementStore = create<DisbursementStore>((set) => ({
    disbursements: [],
    isLoading: false,

    fetchAll: async () => {
        set({ isLoading: true })
        try {
            const res = await api.get('/admin/disbursements')
            set({ disbursements: res.data?.data ?? [] })
        } catch {
            toast.error('โหลดข้อมูลการปล่อยเงินไม่สำเร็จ')
        } finally {
            set({ isLoading: false })
        }
    },

    fetchPending: async () => {
        set({ isLoading: true })
        try {
            const res = await api.get('/admin/disbursements/pending')
            set({ disbursements: res.data?.data ?? [] })
        } catch {
            toast.error('โหลดข้อมูลการปล่อยเงินไม่สำเร็จ')
        } finally {
            set({ isLoading: false })
        }
    },

    confirm: async (id, transferRef, note) => {
        try {
            await api.patch(`/admin/disbursements/${id}/confirm`, { transfer_ref: transferRef, note })
            toast.success('ยืนยันการโอนเงินสำเร็จ')
            set((state) => ({
                disbursements: state.disbursements.map((d) =>
                    d.id === id
                        ? { ...d, status: 'confirmed', transfer_ref: transferRef, admin_note: note, confirmed_at: new Date().toISOString() }
                        : d
                ),
            }))
            return true
        } catch {
            toast.error('ยืนยันการโอนเงินไม่สำเร็จ')
            return false
        }
    },
}))
