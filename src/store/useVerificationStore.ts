import { create } from 'zustand'
import api from '../services/api'
import toast from 'react-hot-toast'

export interface VerifUser {
    email: string
    role: string
}

export interface StudentVerification {
    id: number
    user_id: number
    document: string
    status: string
    CreatedAt: string
    User: VerifUser
}

export interface IDCardVerification {
    id: number
    user_id: number
    document: string
    selfie_url: string | null
    status: string
    face_score: number | null
    CreatedAt: string
    User: VerifUser
}

interface VerificationStore {
    studentVerifications: StudentVerification[]
    idCardVerifications: IDCardVerification[]
    isLoading: boolean
    fetchVerifications: () => Promise<void>
    approveStudentCard: (userId: number) => Promise<void>
    rejectStudentCard: (userId: number) => Promise<void>
    approveIdCard: (userId: number) => Promise<void>
    rejectIdCard: (userId: number) => Promise<void>
}

export const useVerificationStore = create<VerificationStore>((set, get) => ({
    studentVerifications: [],
    idCardVerifications: [],
    isLoading: false,

    fetchVerifications: async () => {
        set({ isLoading: true })
        try {
            const [sRes, iRes] = await Promise.all([
                api.get('/admin/student-verifications'),
                api.get('/admin/id-card-verifications'),
            ])
            set({
                studentVerifications: sRes.data?.data ?? [],
                idCardVerifications: iRes.data?.data ?? [],
            })
        } catch {
            toast.error('โหลดข้อมูลไม่สำเร็จ')
        } finally {
            set({ isLoading: false })
        }
    },

    approveStudentCard: async (userId) => {
        await api.patch(`/admin/approve-student-card/${userId}`)
        toast.success('อนุมัติบัตรนักศึกษาสำเร็จ')
        await get().fetchVerifications()
    },

    rejectStudentCard: async (userId) => {
        await api.patch(`/admin/reject-student-card/${userId}`)
        toast.success('ปฏิเสธบัตรนักศึกษาแล้ว')
        await get().fetchVerifications()
    },

    approveIdCard: async (userId) => {
        await api.patch(`/admin/approve-id-card/${userId}`)
        toast.success('อนุมัติบัตรประชาชนสำเร็จ')
        await get().fetchVerifications()
    },

    rejectIdCard: async (userId) => {
        await api.patch(`/admin/reject-id-card/${userId}`)
        toast.success('ปฏิเสธบัตรประชาชนแล้ว')
        await get().fetchVerifications()
    },
}))
