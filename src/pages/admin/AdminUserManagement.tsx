import { useState } from 'react'
import { Loader2, UserX, RotateCcw, Search, AlertTriangle, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import api from '../../services/api'
import PageHeader from '../../components/admin/PageHeader'

const SuspendModal = ({
    userId,
    onClose,
    onConfirm,
    isSubmitting,
}: {
    userId: number
    onClose: () => void
    onConfirm: (reason: string) => Promise<void>
    isSubmitting: boolean
}) => {
    const [reason, setReason] = useState('')
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-[420px] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-3">
                    <h2 className="text-lg font-bold text-foreground">ระงับผู้ใช้ ID #{userId}</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
                </div>
                <div className="flex flex-col gap-1 mb-5">
                    <label className="text-[13px] font-medium">เหตุผล <span className="text-error">*</span></label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={4}
                        placeholder="ระบุเหตุผลในการระงับบัญชีผู้ใช้นี้"
                        className="border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary resize-none"
                    />
                </div>
                <div className="flex gap-2 justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-[13px] rounded-lg border border-border hover:bg-gray-50">ยกเลิก</button>
                    <button
                        onClick={() => onConfirm(reason)}
                        disabled={!reason.trim() || isSubmitting}
                        className="px-4 py-2 text-[13px] rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <UserX size={14} />}
                        ระงับ
                    </button>
                </div>
            </div>
        </div>
    )
}

const AdminUserManagement = () => {
    const [userId, setUserId] = useState('')
    const [showSuspendModal, setShowSuspendModal] = useState(false)
    const [isSuspending, setIsSuspending] = useState(false)
    const [isRollingBack, setIsRollingBack] = useState(false)

    const parsedId = Number(userId)
    const isValidId = Number.isInteger(parsedId) && parsedId > 0

    const handleSuspend = async (reason: string) => {
        if (!isValidId) return
        setIsSuspending(true)
        try {
            await api.patch(`/admin/suspend-user/${parsedId}`, { reason })
            toast.success(`ระงับผู้ใช้ #${parsedId} สำเร็จ`)
            setShowSuspendModal(false)
        } catch (error) {
            const msg = error instanceof AxiosError ? error.response?.data?.message : null
            toast.error(msg || 'ระงับไม่สำเร็จ')
        } finally {
            setIsSuspending(false)
        }
    }

    const handleRollback = async () => {
        if (!isValidId) return
        setIsRollingBack(true)
        try {
            await api.patch(`/admin/rollback-user/${parsedId}`)
            toast.success(`คืนสถานะผู้ใช้ #${parsedId} สำเร็จ`)
        } catch (error) {
            const msg = error instanceof AxiosError ? error.response?.data?.message : null
            toast.error(msg || 'คืนสถานะไม่สำเร็จ')
        } finally {
            setIsRollingBack(false)
        }
    }

    return (
        <div className="flex flex-col gap-[16px]">
            <PageHeader title="จัดการผู้ใช้" subtitle="ระงับหรือคืนสถานะบัญชีผู้ใช้" />

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mx-2.5">
                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                    <p className="text-[13px] font-semibold text-amber-800">ข้อจำกัดปัจจุบัน</p>
                    <p className="text-[12px] text-amber-700">Backend ยังไม่มี endpoint สำหรับดึงรายชื่อผู้ใช้ทั้งหมด ตอนนี้รองรับเฉพาะการค้นหาด้วย User ID เท่านั้น</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-6 mx-2.5 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium">User ID</label>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="number"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="กรอก User ID เช่น 42"
                            className="w-full border border-border rounded-lg pl-9 pr-3 py-2.5 text-[14px] outline-none focus:border-primary"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => isValidId && setShowSuspendModal(true)}
                        disabled={!isValidId}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[13px] font-medium disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                        <UserX size={15} /> ระงับบัญชี
                    </button>
                    <button
                        onClick={handleRollback}
                        disabled={!isValidId || isRollingBack}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-medium disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                        {isRollingBack ? <Loader2 size={15} className="animate-spin" /> : <RotateCcw size={15} />}
                        คืนสถานะ
                    </button>
                </div>
            </div>

            {showSuspendModal && isValidId && (
                <SuspendModal
                    userId={parsedId}
                    onClose={() => setShowSuspendModal(false)}
                    onConfirm={handleSuspend}
                    isSubmitting={isSuspending}
                />
            )}
        </div>
    )
}

export default AdminUserManagement
