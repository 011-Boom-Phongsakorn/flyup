import { useCallback, useEffect, useState } from 'react'
import { Loader2, FolderX } from 'lucide-react'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import api from '../../services/api'
import SearchBar from '../../components/admin/SearchBar'
import StatusBadge from '../../components/admin/StatusBadge'
import PageHeader from '../../components/admin/PageHeader'
import { useAdminBadgeStore } from '../../store/useAdminBadgeStore'
import CancelDetailModal from '../../components/admin/cancel/CancelDetailModal'
import CancelConfirmModal from '../../components/admin/cancel/CancelConfirmModal'
import type { CancelProject, CancelPreview } from '../../components/admin/cancel/cancelTypes'
import { STATE_CONFIG, FALLBACK_BADGE, fmtDate } from '../../components/admin/cancel/cancelTypes'

const AdminCancelRequests = () => {
    const [projects, setProjects] = useState<CancelProject[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState<CancelProject | null>(null)
    const [preview, setPreview] = useState<CancelPreview | null>(null)
    const [isLoadingPreview, setIsLoadingPreview] = useState(false)
    const [modalMode, setModalMode] = useState<'approve' | 'reject' | null>(null)

    const fetchBadges = useAdminBadgeStore((s) => s.fetchBadges)

    const fetchRequests = useCallback(async () => {
        setIsLoading(true)
        try {
            const res = await api.get('/admin/projects/cancel-request')
            setProjects(res.data?.data ?? [])
        } catch {
            toast.error('โหลดข้อมูลไม่สำเร็จ')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => { fetchRequests() }, [fetchRequests])

    const openDetail = async (project: CancelProject) => {
        setSelected(project)
        setPreview(null)
        setIsLoadingPreview(true)
        try {
            const res = await api.get(`/admin/projects/${project.id}/cancel-preview`)
            setPreview(res.data?.data ?? null)
        } catch { /* preview fails gracefully */ } finally {
            setIsLoadingPreview(false)
        }
    }

    const handleConfirm = async (note: string) => {
        if (!selected || !modalMode) return
        setIsSubmitting(true)
        try {
            const action = modalMode === 'approve' ? 'approve-cancel' : 'reject-cancel'
            await api.patch(`/admin/projects/${selected.id}/${action}`, { admin_note: note })
            toast.success(modalMode === 'approve' ? 'อนุมัติการยกเลิกและคืนเงินนักลงทุนแล้ว' : 'ปฏิเสธคำขอยกเลิกแล้ว')
            setModalMode(null)
            setSelected(null)
            setPreview(null)
            fetchRequests()
            fetchBadges()
        } catch (err) {
            const msg = err instanceof AxiosError ? err.response?.data?.message : null
            toast.error(msg || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
        } finally {
            setIsSubmitting(false)
        }
    }

    const filtered = projects.filter((r) => {
        const q = search.toLowerCase()
        return (r.title ?? '').toLowerCase().includes(q) || (r.cancel_reason ?? '').toLowerCase().includes(q)
    })

    return (
        <div className="flex flex-col gap-4">
            <PageHeader title="คำขอยกเลิกโปรเจกต์" subtitle="ตรวจสอบและอนุมัติคำขอยกเลิกโปรเจกต์จาก Pioneer" />
            <SearchBar value={search} onChange={setSearch} placeholder="ค้นหาชื่อโปรเจกต์ หรือเหตุผล..." resultCount={filtered.length} />

            <div className="bg-white rounded-xl border border-border overflow-hidden text-[14px]">
                <div className="grid grid-cols-[2fr_1fr_2fr_120px_100px] bg-[#f8f9fc] px-4 py-3 font-medium text-gray-500 border-b border-border">
                    <div>โปรเจกต์</div>
                    <div className="text-center">เจ้าของโปรเจกต์</div>
                    <div>เหตุผล</div>
                    <div className="text-center">สถานะ</div>
                    <div className="text-center">จัดการ</div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <Loader2 className="animate-spin text-muted-foreground" size={28} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
                        <FolderX size={28} className="opacity-40" />
                        <p className="text-sm">{search ? 'ไม่พบรายการที่ค้นหา' : 'ยังไม่มีคำขอยกเลิกโปรเจกต์'}</p>
                    </div>
                ) : (
                    filtered.map((r) => {
                        const badge = STATE_CONFIG[r.state] ?? FALLBACK_BADGE
                        return (
                            <div key={r.id} onClick={() => openDetail(r)}
                                className="grid grid-cols-[2fr_1fr_2fr_120px_100px] border-b border-border last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="h-14 flex flex-col justify-center px-2">
                                    <span className="font-medium text-[13px] truncate">{r.title}</span>
                                    <span className="text-[11px] text-muted-foreground">{fmtDate(r.UpdatedAt)}</span>
                                </div>
                                <div className="h-14 flex justify-center items-center">
                                    <span className="text-[13px] text-muted-foreground">
                                        {r.owner ? `${r.owner.first_name} ${r.owner.last_name}`.trim() : `#${r.owner_user_id}`}
                                    </span>
                                </div>
                                <div className="h-14 flex items-center px-2">
                                    <span className="text-[13px] truncate">{r.cancel_reason || '-'}</span>
                                </div>
                                <div className="h-14 flex justify-center items-center">
                                    <StatusBadge label={badge.label} className={badge.className} icon={badge.icon} />
                                </div>
                                <div className="h-14 flex justify-center items-center">
                                    <button onClick={(e) => { e.stopPropagation(); openDetail(r) }}
                                        className="px-3 py-1.5 rounded-lg bg-[#F1F3F5] hover:bg-[#E9ECEF] text-[12px] font-medium text-foreground cursor-pointer"
                                    >
                                        ดูรายละเอียด
                                    </button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {selected && !modalMode && (
                <CancelDetailModal
                    project={selected}
                    preview={preview}
                    isLoadingPreview={isLoadingPreview}
                    onClose={() => { setSelected(null); setPreview(null) }}
                    onApprove={() => setModalMode('approve')}
                    onReject={() => setModalMode('reject')}
                />
            )}

            {selected && modalMode && (
                <CancelConfirmModal
                    project={selected}
                    mode={modalMode}
                    onClose={() => setModalMode(null)}
                    onConfirm={handleConfirm}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    )
}

export default AdminCancelRequests
