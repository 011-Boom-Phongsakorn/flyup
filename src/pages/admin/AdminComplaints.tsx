import { useEffect, useState } from 'react'
import { Loader2, MessageSquareWarning, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useComplaintStore, type Complaint, type ComplaintStatus } from '../../store/useComplaintStore'
import { useAdminBadgeStore } from '../../store/useAdminBadgeStore'
import SearchBar from '../../components/admin/SearchBar'
import StatusBadge from '../../components/admin/StatusBadge'
import PageHeader from '../../components/admin/PageHeader'
import ComplaintDetailModal from '../../components/admin/complaint/ComplaintDetailModal'
import ComplaintResolveModal from '../../components/admin/complaint/ComplaintResolveModal'

const STATUS_CONFIG: Record<ComplaintStatus, { label: string; className: string; icon: React.ReactNode }> = {
    open:     { label: 'รอดำเนินการ', className: 'bg-amber-50 text-amber-600 border border-amber-200',   icon: <Clock size={12} /> },
    resolved: { label: 'ปิดเรื่องแล้ว', className: 'bg-green-50 text-green-600 border border-green-200', icon: <CheckCircle size={12} /> },
    rejected: { label: 'ปฏิเสธแล้ว',  className: 'bg-red-50 text-red-600 border border-red-200',         icon: <XCircle size={12} /> },
}

const fmtDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

const AdminComplaints = () => {
    const { complaints, isLoading, isSubmitting, fetchAdminList, resolveComplaint, rejectComplaint } = useComplaintStore()
    const fetchBadges = useAdminBadgeStore((s) => s.fetchBadges)
    const [tab, setTab] = useState<ComplaintStatus | 'all'>('open')
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState<Complaint | null>(null)
    const [modalMode, setModalMode] = useState<'resolve' | 'reject' | null>(null)

    useEffect(() => {
        fetchAdminList(tab)
    }, [tab, fetchAdminList])

    const handleSubmitNote = async (note: string) => {
        if (!selected || !modalMode) return
        const ok = modalMode === 'resolve'
            ? await resolveComplaint(selected.id, note)
            : await rejectComplaint(selected.id, note)
        if (ok) {
            setModalMode(null)
            setSelected(null)
            fetchBadges()
        }
    }

    const filtered = complaints.filter((c) => {
        const q = search.toLowerCase()
        const fullname = c.complainant ? `${c.complainant.first_name} ${c.complainant.last_name}` : ''
        return (
            c.subject.toLowerCase().includes(q) ||
            c.body.toLowerCase().includes(q) ||
            fullname.toLowerCase().includes(q) ||
            (c.project?.title ?? '').toLowerCase().includes(q)
        )
    })

    const tabs: { key: ComplaintStatus | 'all'; label: string }[] = [
        { key: 'open', label: 'รอดำเนินการ' },
        { key: 'resolved', label: 'ปิดเรื่องแล้ว' },
        { key: 'rejected', label: 'ปฏิเสธแล้ว' },
        { key: 'all', label: 'ทั้งหมด' },
    ]

    return (
        <div className="flex flex-col gap-[16px]">
            <PageHeader title="คำร้องเรียน" subtitle="รับเรื่องและจัดการคำร้องเรียนจากผู้ใช้" />

            <div className="flex gap-2 px-2.5 flex-wrap">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                            tab === t.key ? 'bg-primary text-white' : 'bg-white border border-border text-foreground hover:bg-gray-50'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <SearchBar value={search} onChange={setSearch} placeholder="ค้นหาหัวข้อ ผู้ร้องเรียน หรือโปรเจกต์..." resultCount={filtered.length} />

            <div className="bg-white rounded-xl border border-border overflow-hidden text-[14px]">
                <div className="grid grid-cols-[2fr_1fr_2fr_80px_100px_80px] bg-[#f8f9fc] px-4 py-3 font-medium text-gray-500 border-b border-border">
                    <div>หัวข้อ</div>
                    <div className="text-center">ผู้ร้องเรียน</div>
                    <div>โปรเจกต์</div>
                    <div className="text-center">รายงาน</div>
                    <div className="text-center">สถานะ</div>
                    <div className="text-center">จัดการ</div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <Loader2 className="animate-spin text-muted-foreground" size={28} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-[10px] text-muted-foreground">
                        <MessageSquareWarning size={28} className="opacity-40" />
                        <p className="text-sm">{search ? 'ไม่พบรายการที่ค้นหา' : 'ยังไม่มีรายการคำร้องเรียน'}</p>
                    </div>
                ) : (
                    filtered.map((c) => {
                        const status = STATUS_CONFIG[c.status]
                        const fullname = c.complainant ? `${c.complainant.first_name} ${c.complainant.last_name}` : '-'
                        return (
                            <div
                                key={c.id}
                                onClick={() => setSelected(c)}
                                className="grid grid-cols-[2fr_1fr_2fr_80px_100px_80px] border-b border-border last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="h-14 flex flex-col justify-center px-2">
                                    <span className="font-medium text-[13px] truncate">{c.subject}</span>
                                    <span className="text-[11px] text-muted-foreground">{fmtDate(c.created_at)}</span>
                                </div>
                                <div className="h-14 flex flex-col justify-center items-center gap-[2px]">
                                    <span className="text-[13px]">{fullname}</span>
                                    <span className="text-[11px] text-muted-foreground truncate max-w-[110px]">{c.complainant?.email ?? ''}</span>
                                </div>
                                <div className="h-14 flex flex-col justify-center px-2">
                                    <span className="text-[13px] truncate">{c.project?.title ?? `ID: ${c.project_id}`}</span>
                                </div>
                                <div className="h-14 flex justify-center items-center">
                                    {c.total_reports > 0 && (
                                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                            c.resolved_reports >= COMPLAINT_THRESHOLD
                                                ? 'bg-red-100 text-red-600'
                                                : c.resolved_reports >= COMPLAINT_THRESHOLD - 1
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {c.resolved_reports}/{COMPLAINT_THRESHOLD}
                                        </span>
                                    )}
                                </div>
                                <div className="h-14 flex justify-center items-center">
                                    <StatusBadge label={status.label} className={status.className} icon={status.icon} />
                                </div>
                                <div className="h-14 flex justify-center items-center">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelected(c) }}
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
                <ComplaintDetailModal
                    complaint={selected}
                    onClose={() => setSelected(null)}
                    onResolve={() => setModalMode('resolve')}
                    onReject={() => setModalMode('reject')}
                />
            )}

            {selected && modalMode && (
                <ComplaintResolveModal
                    complaint={selected}
                    mode={modalMode}
                    onClose={() => setModalMode(null)}
                    onConfirm={handleSubmitNote}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    )
}

export default AdminComplaints
