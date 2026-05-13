import { Loader2, CheckCircle, XCircle, X, ExternalLink, ChevronRight, Clock } from 'lucide-react'
import { useNavigate } from 'react-router'
import StatusBadge from '../StatusBadge'
import type { CancelProject, CancelPreview } from './cancelTypes'
import { STATE_CONFIG, FALLBACK_BADGE, fmt, fmtDate } from './cancelTypes'

interface Props {
  project: CancelProject
  preview: CancelPreview | null
  isLoadingPreview: boolean
  onClose: () => void
  onApprove: () => void
  onReject: () => void
}

export default function CancelDetailModal({ project, preview, isLoadingPreview, onClose, onApprove, onReject }: Props) {
  const navigate = useNavigate()
  const badge = STATE_CONFIG[project.state] ?? FALLBACK_BADGE
  const isPending = project.state === 'pending_cancel'

  const iconMap: Record<string, React.ReactNode> = {
    pending_cancel:  <Clock size={12} />,
    cancelled:       <CheckCircle size={12} />,
    cancel_rejected: <XCircle size={12} />,
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[680px] max-h-[90vh] overflow-y-auto p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-foreground">{project.title}</h2>
              <StatusBadge label={badge.label} className={badge.className} icon={iconMap[project.state] ?? null} />
            </div>
            <p className="text-[12px] text-muted-foreground">ส่งเมื่อ {fmtDate(project.UpdatedAt)}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={18} /></button>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4 flex justify-between text-[13px]">
          <div>
            <span className="text-muted-foreground">เจ้าของโปรเจกต์</span>
            <span className="font-medium ml-2">
              {project.owner ? `${project.owner.first_name} ${project.owner.last_name}`.trim() : `#${project.owner_user_id}`}
            </span>
          </div>
          <button onClick={() => navigate(`/admin/projects/${project.id}`)} className="text-[11px] text-primary hover:underline inline-flex items-center gap-1 cursor-pointer">
            ดูโปรเจกต์ <ExternalLink size={10} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-[13px] font-semibold text-foreground mb-2">เหตุผลที่ขอยกเลิก</p>
          <p className="text-[13px] bg-white border border-border rounded-lg px-3 py-2">{project.cancel_reason || '-'}</p>
        </div>

        {project.cancel_description && (
          <div className="mb-4">
            <p className="text-[13px] font-semibold text-foreground mb-2">รายละเอียดเพิ่มเติม</p>
            <p className="text-[13px] whitespace-pre-wrap leading-relaxed bg-white border border-border rounded-lg p-3">{project.cancel_description}</p>
          </div>
        )}

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
                        {m.is_confirmed
                          ? <span className="text-orange-600 font-medium">เบิกแล้ว ฿{fmt(m.disbursed_amount)}</span>
                          : <span className="text-green-600">ยังไม่เบิก</span>
                        }
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
            <button onClick={onReject} className="px-4 py-2 text-[13px] rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 flex items-center gap-2 cursor-pointer">
              <XCircle size={14} /> ปฏิเสธ
            </button>
            <button onClick={onApprove} className="px-4 py-2 text-[13px] rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 cursor-pointer">
              <CheckCircle size={14} /> อนุมัติ & คืนเงินนักลงทุน
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
