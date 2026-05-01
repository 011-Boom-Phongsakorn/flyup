import { useCallback, useEffect, useState } from 'react'
import { Loader2, FolderX, CheckCircle, XCircle, Clock, X, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import api from '../../services/api'
import SearchBar from '../../components/admin/SearchBar'
import StatusBadge from '../../components/admin/StatusBadge'
import PageHeader from '../../components/admin/PageHeader'

type CancelRequestStatus = 'pending' | 'approved' | 'rejected'

type CancelRequest = {
    id: number
    project_id: number
    project_title: string
    reason: string
    description: string
    status: CancelRequestStatus
    admin_note?: string | null
    created_at: string
    resolved_at?: string | null
    pioneer?: {
        first_name: string
        last_name: string
        email: string
    } | null
}

const STATUS_CONFIG: Record<CancelRequestStatus, { label: string; className: string; icon: React.ReactNode }> = {
    pending:  { label: 'รอดำเนินการ', className: 'bg-amber-50 text-amber-600 border border-amber-200', icon: <Clock size={12} /> },
    approved: { label: 'อนุมัติแล้ว',  className: 'bg-green-50 text-green-600 border border-green-200',  icon: <CheckCircle size={12} /> },
    rejected: { label: 'ปฏิเสธแล้ว',  className: 'bg-red-50 text-red-600 border border-red-200',         icon: <XCircle size={12} /> },
}

const fmtDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

const DetailModal = ({
    request,
    onClose,
    onApprove,
    onReject,
}: {
    request: CancelRequest
    onClose: () => void
    onApprove: () => void
    onReject: () => void
}) => {
    const navigate = useNavigate()
    const status = STATUS_CONFIG[request.status] ?? STATUS_CONFIG['pending']
    const fullName = request.pioneer ? `${request.pioneer.first_name} ${request.pioneer.last_name}` : '-'
    const isPending = request.status === 'pending'

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-lg font-bold text-foreground">{request.project_title}</h2>
                            <StatusBadge label={status.label} className={status.className} icon={status.icon} />
                        </div>
                        <p className="text-[12px] text-muted-foreground">ส่งเมื่อ {fmtDate(request.created_at)}</p>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={18} />
                    </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4 flex flex-col gap-2 text-[13px]">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Pioneer</span>
                        <div className="text-right">
                            <div className="font-medium">{fullName}</div>
                            <div className="text-[11px] text-muted-foreground">{request.pioneer?.email ?? '-'}</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">โปรเจกต์</span>
                        <button
                            onClick={() => navigate(`/admin/projects/${request.project_id}`)}
                            className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                        >
                            ดูโปรเจกต์ <ExternalLink size={10} />
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-[13px] font-semibold text-foreground mb-2">เหตุผลที่ขอยกเลิก</p>
                    <p className="text-[13px] text-foreground bg-white border border-border rounded-lg px-3 py-2">
                        {request.reason}
                    </p>
                </div>

                <div className="mb-4">
                    <p className="text-[13px] font-semibold text-foreground mb-2">รายละเอียดเพิ่มเติม</p>
                    <p className="text-[13px] text-foreground whitespace-pre-wrap leading-relaxed bg-white border border-border rounded-lg p-3">
                        {request.description}
                    </p>
                </div>

                {request.admin_note && (
                    <div className="mb-4">
                        <p className="text-[13px] font-semibold text-foreground mb-2">หมายเหตุจาก Admin</p>
                        <p className="text-[13px] text-foreground whitespace-pre-wrap leading-relaxed bg-amber-50 border border-amber-200 rounded-lg p-3">
                            {request.admin_note}
                        </p>
                        {request.resolved_at && (
                            <p className="text-[11px] text-muted-foreground mt-1">
                                ดำเนินการเมื่อ {fmtDate(request.resolved_at)}
                            </p>
                        )}
                    </div>
                )}

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
                            <CheckCircle size={14} /> อนุมัติ
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

const ConfirmModal = ({
    request,
    mode,
    onClose,
    onConfirm,
    isSubmitting,
}: {
    request: CancelRequest
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
                        {isApprove ? 'อนุมัติการยกเลิกโปรเจกต์' : 'ปฏิเสธคำขอยกเลิก'}
                    </h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={18} />
                    </button>
                </div>
                <p className="text-[13px] text-muted-foreground mb-4">
                    โปรเจกต์: <span className="font-medium text-foreground">{request.project_title}</span>
                </p>
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
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-[13px] rounded-lg border border-border hover:bg-gray-50"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={() => onConfirm(note)}
                        disabled={!note.trim() || isSubmitting}
                        className={`px-4 py-2 text-[13px] rounded-lg text-white disabled:opacity-50 flex items-center gap-2 ${
                            isApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {isSubmitting ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : isApprove ? (
                            <CheckCircle size={14} />
                        ) : (
                            <XCircle size={14} />
                        )}
                        {isApprove ? 'อนุมัติ' : 'ปฏิเสธ'}
                    </button>
                </div>
            </div>
        </div>
    )
}

const AdminCancelRequests = () => {
    const [requests, setRequests] = useState<CancelRequest[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [tab, setTab] = useState<CancelRequestStatus | 'all'>('pending')
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState<CancelRequest | null>(null)
    const [modalMode, setModalMode] = useState<'approve' | 'reject' | null>(null)

    const fetchRequests = useCallback(async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (tab !== 'all') params.set('status', tab)
            const res = await api.get(`/admin/projects/cancel-request?${params}`)
            setRequests(res.data?.data ?? res.data ?? [])
        } catch {
            toast.error('โหลดข้อมูลไม่สำเร็จ')
        } finally {
            setIsLoading(false)
        }
    }, [tab])

    useEffect(() => {
        fetchRequests()
    }, [fetchRequests])

    const handleConfirm = async (note: string) => {
        if (!selected || !modalMode) return
        setIsSubmitting(true)
        try {
            const action = modalMode === 'approve' ? 'approve-cancel' : 'reject-cancel'
            await api.patch(`/admin/projects/${selected.id}/${action}`, { admin_note: note })
            toast.success(modalMode === 'approve' ? 'อนุมัติการยกเลิกแล้ว' : 'ปฏิเสธคำขอยกเลิกแล้ว')
            setModalMode(null)
            setSelected(null)
            fetchRequests()
        } catch (err) {
            const msg = err instanceof AxiosError ? err.response?.data?.message : null
            toast.error(msg || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
        } finally {
            setIsSubmitting(false)
        }
    }

    const filtered = requests.filter((r) => {
        const q = search.toLowerCase()
        const fullname = r.pioneer ? `${r.pioneer.first_name} ${r.pioneer.last_name}` : ''
        return (
            (r.project_title ?? '').toLowerCase().includes(q) ||
            (r.reason ?? '').toLowerCase().includes(q) ||
            fullname.toLowerCase().includes(q)
        )
    })

    const tabs: { key: CancelRequestStatus | 'all'; label: string }[] = [
        { key: 'pending',  label: 'รอดำเนินการ' },
        { key: 'approved', label: 'อนุมัติแล้ว' },
        { key: 'rejected', label: 'ปฏิเสธแล้ว' },
        { key: 'all',      label: 'ทั้งหมด' },
    ]

    return (
        <div className="flex flex-col gap-[16px]">
            <PageHeader
                title="คำขอยกเลิกโปรเจกต์"
                subtitle="ตรวจสอบและอนุมัติคำขอยกเลิกโปรเจกต์จาก Pioneer"
            />

            <div className="flex gap-2 px-2.5 flex-wrap">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                            tab === t.key
                                ? 'bg-primary text-white'
                                : 'bg-white border border-border text-foreground hover:bg-gray-50'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="ค้นหาโปรเจกต์ หรือ Pioneer..."
                resultCount={filtered.length}
            />

            <div className="bg-white rounded-xl border border-border overflow-hidden text-[14px]">
                <div className="grid grid-cols-7 bg-[#f8f9fc] px-4 py-3 font-medium text-gray-500 border-b border-border">
                    <div className="col-span-2">โปรเจกต์</div>
                    <div className="text-center">Pioneer</div>
                    <div className="col-span-2">เหตุผล</div>
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
                        const status = STATUS_CONFIG[r.status] ?? STATUS_CONFIG['pending']
                        const fullname = r.pioneer
                            ? `${r.pioneer.first_name} ${r.pioneer.last_name}`
                            : '-'
                        return (
                            <div
                                key={r.id}
                                onClick={() => setSelected(r)}
                                className="grid grid-cols-7 border-b border-border last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="col-span-2 h-14 flex flex-col justify-center px-2">
                                    <span className="font-medium text-[13px] truncate">{r.project_title}</span>
                                    <span className="text-[11px] text-muted-foreground">{fmtDate(r.created_at)}</span>
                                </div>
                                <div className="h-14 flex flex-col justify-center items-center gap-[2px]">
                                    <span className="text-[13px]">{fullname}</span>
                                    <span className="text-[11px] text-muted-foreground truncate max-w-[110px]">
                                        {r.pioneer?.email ?? ''}
                                    </span>
                                </div>
                                <div className="col-span-2 h-14 flex items-center px-2">
                                    <span className="text-[13px] truncate">{r.reason}</span>
                                </div>
                                <div className="h-14 flex justify-center items-center">
                                    <StatusBadge label={status.label} className={status.className} icon={status.icon} />
                                </div>
                                <div className="h-14 flex justify-center items-center">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelected(r) }}
                                        className="px-[12px] py-[6px] rounded-[8px] bg-[#F1F3F5] hover:bg-[#E9ECEF] text-[12px] font-medium text-foreground"
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
                    request={selected}
                    onClose={() => setSelected(null)}
                    onApprove={() => setModalMode('approve')}
                    onReject={() => setModalMode('reject')}
                />
            )}

            {selected && modalMode && (
                <ConfirmModal
                    request={selected}
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
