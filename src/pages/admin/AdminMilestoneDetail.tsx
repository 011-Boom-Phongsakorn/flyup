import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
    ChevronLeft, Loader2, CheckCircle, XCircle,
    Calendar, ExternalLink, FileText, CheckCircle2, Circle,
} from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

// ─── Types ────────────────────────────────────────────────────────────────────

interface EvidenceLink {
    name: string
    url: string
}

interface EvidenceFile {
    id: number
    url: string
    file_name: string
}

interface MilestoneDetail {
    id: number
    phase_no: number
    title: string
    description: string
    start_date: string
    end_date: string
    funding_goal: number
    acceptance_criteria: string
    status: string
    progress_pct: number
    admin_note?: string
    submitted_at?: string
    project_id: number
    project_title: string
    owner?: {
        first_name: string
        last_name: string
        email: string
    }
    evidence_files?: EvidenceFile[]
    evidence_links?: EvidenceLink[]
    checked_criteria?: boolean[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (d: string) =>
    d ? new Date(d).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'

const fmtBaht = (v: number) => `฿${v.toLocaleString('th-TH')}`

// ─── Component ────────────────────────────────────────────────────────────────

const AdminMilestoneDetail = () => {
    const { milestoneId } = useParams<{ milestoneId: string }>()
    const navigate = useNavigate()

    const [milestone, setMilestone] = useState<MilestoneDetail | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<'approve' | 'reject' | null>(null)
    const [rejectNote, setRejectNote] = useState('')
    const [showRejectForm, setShowRejectForm] = useState(false)

    useEffect(() => {
        if (!milestoneId) return
        setIsLoading(true)
        api.get(`/admin/milestones/${milestoneId}`)
            .then((res) => setMilestone(res.data?.data ?? null))
            .catch(() => toast.error('โหลดข้อมูลไม่สำเร็จ'))
            .finally(() => setIsLoading(false))
    }, [milestoneId])

    const handleApprove = async () => {
        if (!milestoneId) return
        setActionLoading('approve')
        try {
            await api.patch(`/admin/milestones/${milestoneId}/approve`)
            toast.success('อนุมัติ Milestone สำเร็จ')
            navigate('/admin/milestones')
        } catch (error) {
            const msg = error instanceof AxiosError ? error.response?.data?.message : null
            toast.error(msg || 'เกิดข้อผิดพลาด')
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async () => {
        if (!milestoneId) return
        if (!rejectNote.trim()) {
            toast.error('กรุณาระบุเหตุผลในการปฏิเสธ')
            return
        }
        setActionLoading('reject')
        try {
            await api.patch(`/admin/milestones/${milestoneId}/reject`, { note: rejectNote })
            toast.success('ปฏิเสธ Milestone แล้ว')
            navigate('/admin/milestones')
        } catch (error) {
            const msg = error instanceof AxiosError ? error.response?.data?.message : null
            toast.error(msg || 'เกิดข้อผิดพลาด')
        } finally {
            setActionLoading(null)
        }
    }

    const criteria = milestone?.acceptance_criteria
        ? milestone.acceptance_criteria.split('\n').filter(Boolean)
        : []
    const checkedCriteria = milestone?.checked_criteria ?? []

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!milestone) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-[12px] text-muted-foreground">
                <p>ไม่พบข้อมูล Milestone</p>
                <button onClick={() => navigate(-1)} className="text-[13px] text-primary hover:underline">
                    กลับไปหน้าก่อน
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-[24px] pb-[40px] max-w-[860px]">
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-[6px] text-[14px] text-muted-foreground hover:text-foreground transition-colors w-fit cursor-pointer"
            >
                <ChevronLeft size={16} />
                กลับ
            </button>

            {/* Header */}
            <div className="flex items-start justify-between gap-[16px] flex-wrap">
                <div>
                    <p className="text-[13px] text-muted-foreground mb-[4px]">{milestone.project_title}</p>
                    <h1 className="text-[22px] font-bold text-foreground">
                        Phase {milestone.phase_no}: {milestone.title}
                    </h1>
                    {milestone.description && (
                        <p className="text-[14px] text-muted-foreground mt-[6px]">{milestone.description}</p>
                    )}
                </div>

                {/* Action buttons (only for submitted) */}
                {milestone.status === 'submitted' && !showRejectForm && (
                    <div className="flex items-center gap-[8px] shrink-0">
                        <button
                            onClick={() => setShowRejectForm(true)}
                            disabled={!!actionLoading}
                            className="flex items-center gap-[6px] px-[16px] py-[9px] rounded-[10px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50 text-[13px] font-medium cursor-pointer"
                        >
                            <XCircle size={15} />
                            ปฏิเสธ
                        </button>
                        <button
                            onClick={handleApprove}
                            disabled={!!actionLoading}
                            className="flex items-center gap-[6px] px-[16px] py-[9px] rounded-[10px] bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 text-[13px] font-medium cursor-pointer"
                        >
                            {actionLoading === 'approve' ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <CheckCircle size={15} />
                            )}
                            อนุมัติ
                        </button>
                    </div>
                )}
            </div>

            {/* Reject form */}
            {showRejectForm && (
                <div className="bg-red-50 border border-red-200 rounded-[14px] p-[20px] flex flex-col gap-[12px]">
                    <p className="text-[14px] font-semibold text-red-700">ระบุเหตุผลในการปฏิเสธ</p>
                    <textarea
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        rows={3}
                        placeholder="เช่น หลักฐานไม่ครบถ้วน, ผลงานไม่ตรงตามเกณฑ์..."
                        className="w-full border border-red-200 rounded-[8px] px-[12px] py-[10px] text-[13px] outline-none focus:border-red-400 resize-none bg-white"
                    />
                    <div className="flex items-center gap-[8px] justify-end">
                        <button
                            onClick={() => { setShowRejectForm(false); setRejectNote('') }}
                            className="px-[16px] py-[8px] rounded-[8px] border border-border text-[13px] font-medium text-foreground hover:bg-[#F8F9FA] transition-colors cursor-pointer"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={!!actionLoading}
                            className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 text-[13px] font-medium cursor-pointer"
                        >
                            {actionLoading === 'reject' ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <XCircle size={14} />
                            )}
                            ยืนยันการปฏิเสธ
                        </button>
                    </div>
                </div>
            )}

            {/* Info cards row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[12px]">
                <InfoCard label="ช่วงเวลา" value={`${fmt(milestone.start_date)} – ${fmt(milestone.end_date)}`} icon={<Calendar size={14} />} />
                <InfoCard label="งบประมาณ" value={fmtBaht(milestone.funding_goal)} />
                <InfoCard label="ความคืบหน้า" value={`${milestone.progress_pct}%`} />
                <InfoCard
                    label="Pioneer"
                    value={milestone.owner ? `${milestone.owner.first_name} ${milestone.owner.last_name}` : '-'}
                />
            </div>

            {/* Acceptance criteria */}
            {criteria.length > 0 && (
                <div className="bg-white border border-border rounded-[16px] p-[24px] flex flex-col gap-[14px]">
                    <h2 className="font-semibold text-foreground">เกณฑ์การยอมรับ</h2>
                    <div className="flex flex-col gap-[8px]">
                        {criteria.map((c, i) => {
                            const checked = checkedCriteria[i] ?? false
                            return (
                                <div
                                    key={i}
                                    className={`flex items-center gap-[10px] p-[12px] rounded-[10px] border ${checked ? 'border-primary/30 bg-primary/5' : 'border-border bg-[#F8F9FA]'}`}
                                >
                                    {checked
                                        ? <CheckCircle2 size={18} className="text-primary shrink-0" />
                                        : <Circle size={18} className="text-muted-foreground shrink-0" />
                                    }
                                    <span className={`text-[13px] ${checked ? 'text-foreground' : 'text-muted-foreground'}`}>{c}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Evidence files */}
            {(milestone.evidence_files?.length ?? 0) > 0 && (
                <div className="bg-white border border-border rounded-[16px] p-[24px] flex flex-col gap-[14px]">
                    <h2 className="font-semibold text-foreground">ไฟล์แนบ</h2>
                    <div className="flex flex-col gap-[8px]">
                        {milestone.evidence_files!.map((file) => (
                            <a
                                key={file.id}
                                href={file.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px] border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
                            >
                                <FileText size={16} className="text-muted-foreground shrink-0" />
                                <span className="text-[13px] text-foreground flex-1 truncate">{file.file_name}</span>
                                <ExternalLink size={13} className="text-muted-foreground shrink-0" />
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Evidence links */}
            {(milestone.evidence_links?.length ?? 0) > 0 && (
                <div className="bg-white border border-border rounded-[16px] p-[24px] flex flex-col gap-[14px]">
                    <h2 className="font-semibold text-foreground">ลิงก์ภายนอก</h2>
                    <div className="flex flex-col gap-[8px]">
                        {milestone.evidence_links!.map((link, i) => (
                            <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px] border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
                            >
                                <ExternalLink size={15} className="text-primary shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-medium text-foreground">{link.name || link.url}</p>
                                    {link.name && (
                                        <p className="text-[11px] text-muted-foreground truncate">{link.url}</p>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Admin note (if rejected) */}
            {milestone.status === 'rejected' && milestone.admin_note && (
                <div className="p-[16px] rounded-[12px] bg-red-50 border border-red-200 text-[13px] text-red-700">
                    <span className="font-semibold">หมายเหตุที่ให้ไว้: </span>{milestone.admin_note}
                </div>
            )}
        </div>
    )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const InfoCard = ({
    label,
    value,
    icon,
}: {
    label: string
    value: string
    icon?: React.ReactNode
}) => (
    <div className="bg-white border border-border rounded-[12px] p-[16px]">
        <p className="text-[11px] text-muted-foreground mb-[4px] flex items-center gap-[4px]">
            {icon} {label}
        </p>
        <p className="text-[14px] font-semibold text-foreground">{value}</p>
    </div>
)

export default AdminMilestoneDetail
