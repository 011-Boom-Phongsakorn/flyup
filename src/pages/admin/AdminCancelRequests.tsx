import { useCallback, useEffect, useState } from 'react'
import { Loader2, FolderX, CheckCircle, XCircle, Clock, X, ExternalLink, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import api from '../../services/api'
import SearchBar from '../../components/admin/SearchBar'
import StatusBadge from '../../components/admin/StatusBadge'
import PageHeader from '../../components/admin/PageHeader'

type CancelProject = {
    id: number
    title: string
    cancel_reason: string
    cancel_description: string
    state: string
    owner_user_id: number
    UpdatedAt: string
}

type PreviewMilestone = {
    phase_no: number
    title: string
    percent_release: number
    disbursed_amount: number
    is_confirmed: boolean
}

type PreviewInvestor = {
    user_id: number
    first_name: string
    last_name: string
    email: string
    total_amount: number
    refund_amount: number
}

type CancelPreview = {
    project_id: number
    title: string
    total_funding: number
    total_disbursed: number
    refundable_amount: number
    milestones: PreviewMilestone[]
    investors: PreviewInvestor[]
}

const STATE_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    pending_cancel:  { label: 'รอดำเนินการ', className: 'bg-amber-50 text-amber-600 border border-amber-200', icon: <Clock size={12} /> },
    cancelled:       { label: 'อนุมัติแล้ว',  className: 'bg-green-50 text-green-600 border border-green-200',  icon: <CheckCircle size={12} /> },
    cancel_rejected: { label: 'ปฏิเสธแล้ว',  className: 'bg-red-50 text-red-600 border border-red-200',         icon: <XCircle size={12} /> },
}

const FALLBACK_BADGE = { label: 'ไม่ทราบสถานะ', className: 'bg-gray-50 text-gray-500 border border-gray-200', icon: null }

const fmt = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

const DetailModal = ({
    project,
    preview,
    isLoadingPreview,
    onClose,
    onApprove,
    onReject,
}: {
    project: CancelProject
    preview: CancelPreview | null
    isLoadingPreview: boolean
    onClose: () => void
    onApprove: () => void
    onReject: () => void
}) => {
    const navigate = useNavigate()
    const badge = STATE_CONFIG[project.state] ?? FALLBACK_BADGE
    const isPending = project.state === 'pending_cancel'

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-[680px] max-h-[90vh] overflow-y-auto p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-lg font-bold text-foreground">{project.title}</h2>
                            <StatusBadge label={badge.label} className={badge.className} icon={badge.icon} />
                        </div>
                        <p className="text-[12px] text-muted-foreground">ส่งเมื่อ {fmtDate(project.UpdatedAt)}</p>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={18} />
                    </button>
                </div>

                {/* Project Info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4 flex justify-between text-[13px]">
                    <div>
                        <span className="text-muted-foreground">Owner ID</span>
                        <span className="font-medium ml-2">#{project.owner_user_id}</span>
                    </div>
                    <button
                        onClick={() => navigate(`/admin/projects/${project.id}`)}
                        className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                    >
                        ดูโปรเจกต์ <ExternalLink size={10} />
                    </button>
                </div>

                {/* Reason */}
                <div className="mb-4">
                    <p className="text-[13px] font-semibold text-foreground mb-2">เหตุผลที่ขอยกเลิก</p>
                    <p className="text-[13px] bg-white border border-border rounded-lg px-3 py-2">
                        {project.cancel_reason || '-'}
                    </p>
                </div>

                {project.cancel_description && (
                    <div className="mb-4">
                        <p className="text-[13px] font-semibold text-foreground mb-2">รายละเอียดเพิ่มเติม</p>
                        <p className="text-[13px] whitespace-pre-wrap leading-relaxed bg-white border border-border rounded-lg p-3">
                            {project.cancel_description}
                        </p>
                    </div>
                )}

                {/* Refund Preview */}
                <div className="border border-border rounded-xl overflow-hidden mb-4">
                    <div className="bg-[#f8f9fc] px-4 py-2.5 flex items-center justify-between">
                        <p className="text-[13px] font-semibold text-foreground">สรุปการคืนเงิน</p>
                        {isLoadingPreview && <Loader2 size={14} className="animate-spin text-muted-foreground" />}
                    </div>

                    {isLoadingPreview ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="animate-spin text-muted-foreground" size={24} />
                        </div>
                    ) : preview ? (
                        <div className="p-4 flex flex-col gap-4">
                            {/* Funding summary */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-blue-50 rounded-lg p-3 text-center">
                                    <p className="text-[11px] text-blue-600 mb-1">ทุนระดมได้ทั้งหมด</p>
                                    <p className="text-[14px] font-bold text-blue-700">฿{fmt(preview.total_funding)}</p>
                                </div>
                                <div className="bg-orange-50 rounded-lg p-3 text-center">
                                    <p className="text-[11px] text-orange-600 mb-1">เบิกจ่ายไปแล้ว</p>
                                    <p className="text-[14px] font-bold text-orange-700">฿{fmt(preview.total_disbursed)}</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-3 text-center">
                                    <p className="text-[11px] text-green-600 mb-1">คืนให้นักลงทุน</p>
                                    <p className="text-[14px] font-bold text-green-700">฿{fmt(preview.refundable_amount)}</p>
                                </div>
                            </div>

                            {/* Milestones */}
                            {preview.milestones.length > 0 && (
                                <div>
                                    <p className="text-[12px] font-semibold text-muted-foreground mb-2">สถานะ Milestone</p>
                                    <div className="flex flex-col gap-1">
                                        {preview.milestones.map((m) => (
                                            <div key={m.phase_no} className="flex items-center justify-between text-[12px] py-1.5 px-3 rounded-lg bg-gray-50">
                                                <div className="flex items-center gap-2">
                                                    <ChevronRight size={12} className="text-muted-foreground" />
                                                    <span className="font-medium">Phase {m.phase_no}</span>
                                                    <span className="text-muted-foreground truncate max-w-[180px]">{m.title}</span>
                                                    <span className="text-muted-foreground">({m.percent_release}%)</span>
                                                </div>
                                                {m.is_confirmed ? (
                                                    <span className="text-orange-600 font-medium">เบิกแล้ว ฿{fmt(m.disbursed_amount)}</span>
                                                ) : (
                                                    <span className="text-green-600">ยังไม่เบิก</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Investors */}
                            {preview.investors.length > 0 && (
                                <div>
                                    <p className="text-[12px] font-semibold text-muted-foreground mb-2">รายการคืนเงินนักลงทุน ({preview.investors.length} ราย)</p>
                                    <div className="border border-border rounded-lg overflow-hidden">
                                        <div className="grid grid-cols-[1fr_100px_100px] bg-[#f8f9fc] px-3 py-2 text-[11px] font-medium text-gray-500 border-b border-border">
                                            <div>นักลงทุน</div>
                                            <div className="text-right">ลงทุน</div>
                                            <div className="text-right">ได้คืน</div>
                                        </div>
                                        {preview.investors.map((inv) => (
                                            <div key={inv.user_id} className="grid grid-cols-[1fr_100px_100px] px-3 py-2 border-b border-border last:border-0 text-[12px]">
                                                <div>
                                                    <p className="font-medium">{inv.first_name} {inv.last_name}</p>
                                                    <p className="text-[11px] text-muted-foreground">{inv.email}</p>
                                                </div>
                                                <div className="text-right text-muted-foreground">฿{fmt(inv.total_amount)}</div>
                                                <div className="text-right font-medium text-green-700">฿{fmt(inv.refund_amount)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-[13px] text-muted-foreground text-center py-6">ไม่สามารถโหลดข้อมูลการคืนเงินได้</p>
                    )}
                </div>

                {isPending && (
                    <div className="flex gap-2 justify-end pt-2 border-t border-border">
                        <button
                            onClick={onReject}
                            className="px-4 py-2 text-[13px] rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 flex items-center gap-2"
                        >
                            <XCircle size={14} /> ปฏิเสธ
                        </button>
                        <button
                            onClick={onApprove}
                            className="px-4 py-2 text-[13px] rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                        >
                            <CheckCircle size={14} /> อนุมัติ & คืนเงินนักลงทุน
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

const ConfirmModal = ({
    project,
    mode,
    onClose,
    onConfirm,
    isSubmitting,
}: {
    project: CancelProject
    mode: 'approve' | 'reject'
    onClose: () => void
    onConfirm: (note: string) => Promise<void>
    isSubmitting: boolean
}) => {
    const [note, setNote] = useState('')
    const isApprove = mode === 'approve'

    return (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-[460px] p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between mb-3">
                    <h2 className="text-lg font-bold text-foreground">
                        {isApprove ? 'ยืนยันอนุมัติการยกเลิก' : 'ปฏิเสธคำขอยกเลิก'}
                    </h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={18} />
                    </button>
                </div>
                <p className="text-[13px] text-muted-foreground mb-1">
                    โปรเจกต์: <span className="font-medium text-foreground">{project.title}</span>
                </p>
                {isApprove && (
                    <p className="text-[12px] text-green-600 bg-green-50 rounded-lg px-3 py-2 mb-4">
                        ระบบจะคืนเงินให้นักลงทุนทุกรายอัตโนมัติหลังอนุมัติ
                    </p>
                )}
                <div className="flex flex-col gap-1 mb-5">
                    <label className="text-[13px] font-medium">
                        หมายเหตุจาก Admin <span className="text-error">*</span>
                    </label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={4}
                        placeholder={isApprove ? 'ยืนยันการอนุมัติและแจ้งขั้นตอนต่อไป' : 'เหตุผลที่ปฏิเสธคำขอยกเลิก'}
                        className="border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary resize-none"
                    />
                </div>
                <div className="flex gap-2 justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-[13px] rounded-lg border border-border hover:bg-gray-50">
                        ยกเลิก
                    </button>
                    <button
                        onClick={() => onConfirm(note)}
                        disabled={!note.trim() || isSubmitting}
                        className={`px-4 py-2 text-[13px] rounded-lg text-white disabled:opacity-50 flex items-center gap-2 ${
                            isApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : isApprove ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {isApprove ? 'อนุมัติ' : 'ปฏิเสธ'}
                    </button>
                </div>
            </div>
        </div>
    )
}

const AdminCancelRequests = () => {
    const [projects, setProjects] = useState<CancelProject[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState<CancelProject | null>(null)
    const [preview, setPreview] = useState<CancelPreview | null>(null)
    const [isLoadingPreview, setIsLoadingPreview] = useState(false)
    const [modalMode, setModalMode] = useState<'approve' | 'reject' | null>(null)

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

    useEffect(() => {
        fetchRequests()
    }, [fetchRequests])

    const openDetail = async (project: CancelProject) => {
        setSelected(project)
        setPreview(null)
        setIsLoadingPreview(true)
        try {
            const res = await api.get(`/admin/projects/${project.id}/cancel-preview`)
            setPreview(res.data?.data ?? null)
        } catch {
            // preview fails gracefully — modal still opens without it
        } finally {
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
        } catch (err) {
            const msg = err instanceof AxiosError ? err.response?.data?.message : null
            toast.error(msg || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
        } finally {
            setIsSubmitting(false)
        }
    }

    const filtered = projects.filter((r) => {
        const q = search.toLowerCase()
        return (
            (r.title ?? '').toLowerCase().includes(q) ||
            (r.cancel_reason ?? '').toLowerCase().includes(q)
        )
    })

    return (
        <div className="flex flex-col gap-[16px]">
            <PageHeader
                title="คำขอยกเลิกโปรเจกต์"
                subtitle="ตรวจสอบและอนุมัติคำขอยกเลิกโปรเจกต์จาก Pioneer"
            />

            <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="ค้นหาชื่อโปรเจกต์ หรือเหตุผล..."
                resultCount={filtered.length}
            />

            <div className="bg-white rounded-xl border border-border overflow-hidden text-[14px]">
                <div className="grid grid-cols-[2fr_1fr_2fr_120px_100px] bg-[#f8f9fc] px-4 py-3 font-medium text-gray-500 border-b border-border">
                    <div>โปรเจกต์</div>
                    <div className="text-center">Owner ID</div>
                    <div>เหตุผล</div>
                    <div className="text-center">สถานะ</div>
                    <div className="text-center">จัดการ</div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <Loader2 className="animate-spin text-muted-foreground" size={28} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-[10px] text-muted-foreground">
                        <FolderX size={28} className="opacity-40" />
                        <p className="text-sm">
                            {search ? 'ไม่พบรายการที่ค้นหา' : 'ยังไม่มีคำขอยกเลิกโปรเจกต์'}
                        </p>
                    </div>
                ) : (
                    filtered.map((r) => {
                        const badge = STATE_CONFIG[r.state] ?? FALLBACK_BADGE
                        return (
                            <div
                                key={r.id}
                                onClick={() => openDetail(r)}
                                className="grid grid-cols-[2fr_1fr_2fr_120px_100px] border-b border-border last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="h-14 flex flex-col justify-center px-2">
                                    <span className="font-medium text-[13px] truncate">{r.title}</span>
                                    <span className="text-[11px] text-muted-foreground">{fmtDate(r.UpdatedAt)}</span>
                                </div>
                                <div className="h-14 flex justify-center items-center">
                                    <span className="text-[13px] text-muted-foreground">#{r.owner_user_id}</span>
                                </div>
                                <div className="h-14 flex items-center px-2">
                                    <span className="text-[13px] truncate">{r.cancel_reason || '-'}</span>
                                </div>
                                <div className="h-14 flex justify-center items-center">
                                    <StatusBadge label={badge.label} className={badge.className} icon={badge.icon} />
                                </div>
                                <div className="h-14 flex justify-center items-center">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openDetail(r) }}
                                        className="px-3 py-1.5 rounded-lg bg-[#F1F3F5] hover:bg-[#E9ECEF] text-[12px] font-medium text-foreground"
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
                <DetailModal
                    project={selected}
                    preview={preview}
                    isLoadingPreview={isLoadingPreview}
                    onClose={() => { setSelected(null); setPreview(null) }}
                    onApprove={() => setModalMode('approve')}
                    onReject={() => setModalMode('reject')}
                />
            )}

            {selected && modalMode && (
                <ConfirmModal
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
