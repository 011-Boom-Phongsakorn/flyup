import { CheckCircle, XCircle, X, ExternalLink, TriangleAlert } from 'lucide-react'
import { useNavigate } from 'react-router'
import StatusBadge from '../StatusBadge'
import type { Complaint, ComplaintStatus } from '../../../store/useComplaintStore'
import { COMPLAINT_THRESHOLD } from '../../../store/useComplaintStore'

const STATUS_CONFIG: Record<ComplaintStatus, { label: string; className: string; icon: React.ReactNode }> = {
  open:     { label: 'รอดำเนินการ',  className: 'bg-amber-50 text-amber-600 border border-amber-200',  icon: null },
  resolved: { label: 'ปิดเรื่องแล้ว', className: 'bg-green-50 text-green-600 border border-green-200', icon: null },
  rejected: { label: 'ปฏิเสธแล้ว',   className: 'bg-red-50 text-red-600 border border-red-200',        icon: null },
}

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

interface Props {
  complaint: Complaint
  onClose: () => void
  onResolve: () => void
  onReject: () => void
}

export default function ComplaintDetailModal({ complaint, onClose, onResolve, onReject }: Props) {
  const navigate = useNavigate()
  const status = STATUS_CONFIG[complaint.status]
  const fullName = complaint.complainant ? `${complaint.complainant.first_name} ${complaint.complainant.last_name}` : '-'
  const isOpen = complaint.status === 'open'

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-foreground">{complaint.subject}</h2>
              <StatusBadge label={status.label} className={status.className} icon={status.icon} />
            </div>
            <p className="text-[12px] text-muted-foreground">ส่งเมื่อ {fmtDate(complaint.created_at)}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4 flex flex-col gap-2 text-[13px]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ผู้ร้องเรียน</span>
            <div className="text-right">
              <div className="font-medium">{fullName}</div>
              <div className="text-[11px] text-muted-foreground">{complaint.complainant?.email ?? '-'}</div>
            </div>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground">โปรเจกต์</span>
            <div className="text-right">
              <div className="font-medium">{complaint.project?.title ?? `ID: ${complaint.project_id}`}</div>
              {complaint.project_id > 0 && (
                <button
                  onClick={() => {
                    const target = complaint.project?.state === 'pending_review'
                      ? `/admin/projects/${complaint.project_id}`
                      : `/projects/${(complaint.project as { slug?: string })?.slug || complaint.project_id}`
                    navigate(target)
                  }}
                  className="text-[11px] text-primary hover:underline inline-flex items-center gap-1 mt-0.5"
                >
                  เปิดหน้าโปรเจกต์ <ExternalLink size={10} />
                </button>
              )}
            </div>
          </div>
        </div>

        {complaint.total_reports > 0 && (() => {
          const resolved = complaint.resolved_reports ?? 0
          const total = complaint.total_reports ?? 0
          const pct = Math.min((resolved / COMPLAINT_THRESHOLD) * 100, 100)
          const willSuspend = resolved >= COMPLAINT_THRESHOLD
          const nearThreshold = !willSuspend && resolved >= COMPLAINT_THRESHOLD - 1
          return (
            <div className={`rounded-xl p-4 mb-4 border ${willSuspend ? 'bg-red-50 border-red-200' : nearThreshold ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-border'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-[12px] font-semibold">
                  {(willSuspend || nearThreshold) && <TriangleAlert size={13} className={willSuspend ? 'text-red-500' : 'text-amber-500'} />}
                  <span className={willSuspend ? 'text-red-700' : nearThreshold ? 'text-amber-700' : 'text-foreground'}>สถิติรายงานโปรเจกต์นี้</span>
                </div>
                <span className={`text-[12px] font-bold ${willSuspend ? 'text-red-600' : 'text-foreground'}`}>{resolved} / {COMPLAINT_THRESHOLD} อนุมัติ</span>
              </div>
              <div className="w-full bg-white rounded-full h-2 border border-border overflow-hidden">
                <div className={`h-full rounded-full transition-all ${willSuspend ? 'bg-red-500' : nearThreshold ? 'bg-amber-400' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between mt-1.5 text-[11px] text-muted-foreground">
                <span>รายงานทั้งหมด {total} ครั้ง</span>
                {willSuspend
                  ? <span className="text-red-600 font-medium">โปรเจกต์ถูกระงับอัตโนมัติแล้ว</span>
                  : <span>อีก {COMPLAINT_THRESHOLD - resolved} ครั้งจะระงับอัตโนมัติ</span>
                }
              </div>
            </div>
          )
        })()}

        <div className="mb-4">
          <p className="text-[13px] font-semibold text-foreground mb-2">รายละเอียด</p>
          <p className="text-[13px] text-foreground whitespace-pre-wrap leading-relaxed bg-white border border-border rounded-lg p-3">{complaint.body}</p>
        </div>

        {complaint.admin_note && (
          <div className="mb-4">
            <p className="text-[13px] font-semibold text-foreground mb-2">หมายเหตุจากผู้ตรวจ</p>
            <p className="text-[13px] text-foreground whitespace-pre-wrap leading-relaxed bg-amber-50 border border-amber-200 rounded-lg p-3">{complaint.admin_note}</p>
            {complaint.resolved_at && <p className="text-[11px] text-muted-foreground mt-1">ดำเนินการเมื่อ {fmtDate(complaint.resolved_at)}</p>}
          </div>
        )}

        {isOpen && (
          <div className="flex gap-2 justify-end pt-2 border-t border-border">
            <button onClick={onReject} className="px-4 py-2 text-[13px] rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 flex items-center gap-2">
              <XCircle size={14} /> ปฏิเสธ
            </button>
            <button onClick={onResolve} className="px-4 py-2 text-[13px] rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
              <CheckCircle size={14} /> ปิดเรื่อง
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
