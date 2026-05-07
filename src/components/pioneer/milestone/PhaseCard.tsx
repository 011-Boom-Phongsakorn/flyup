import { CheckCircle2, Calendar, Undo2, Vote, Loader2, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import { STATUS_CONFIG, fmtDateRange, fmtBaht } from './types'
import type { MilestoneData, EvidenceLink } from './types'
import EvidenceForm from './EvidenceForm'

interface PhaseCardProps {
  milestone: MilestoneData
  isActive: boolean
  onToggle: () => void
  onSubmit: (milestoneId: number, files: File[], links: EvidenceLink[], checkedCriteria: string[]) => Promise<void>
  onRecall: (milestoneId: number) => Promise<void>
  onOpenVoting: (milestoneId: number) => Promise<void>
  isSubmitting: boolean
  isOpeningVoting: boolean
}

const PhaseCard = ({ milestone, isActive, onToggle, onSubmit, onRecall, onOpenVoting, isSubmitting, isOpeningVoting }: PhaseCardProps) => {
  const navigate = useNavigate()
  const cfg = STATUS_CONFIG[milestone.status] ?? STATUS_CONFIG['pending']
  const canSubmit = milestone.status === 'in_progress' || milestone.status === 'rejected'
  const isCompleted = milestone.status === 'completed'
  const isApproved = milestone.status === 'approved'

  const now = new Date()

  const getMeetingDatetime = (m: { date: string; time: string }) => {
    try {
      const d = new Date(m.date)
      const t = new Date(m.time)
      // time ถูกเก็บเป็น UTC แต่แทนค่า local time จริงๆ ใช้ local date เพื่อให้ compare กับ now() ถูกต้อง
      return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), t.getUTCHours(), t.getUTCMinutes())
    } catch { return null }
  }

  const activeMeetings = (milestone.meetings ?? []).filter(m => m.status !== 'cancelled')
  const hasMeeting = activeMeetings.length > 0
  const meetingPassed = activeMeetings.some(m => {
    const dt = getMeetingDatetime(m)
    return dt !== null && dt <= now
  })
  const canOpenVoting = hasMeeting && meetingPassed
  const nextMeeting = !meetingPassed && hasMeeting
    ? [...activeMeetings].sort((a, b) => {
        const da = getMeetingDatetime(a)?.getTime() ?? 0
        const db = getMeetingDatetime(b)?.getTime() ?? 0
        return da - db
      })[0]
    : null
  const voteDisabledReason = !hasMeeting
    ? 'กรุณานัดประชุมก่อนเปิด Vote'
    : nextMeeting
    ? `ต้องรอถึงเวลาประชุม ${getMeetingDatetime(nextMeeting)?.toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) ?? ''}`
    : ''

  const handleEvidenceSubmit = async (
    files: File[],
    links: EvidenceLink[],
    checkedCriteria: string[]
  ) => {
    if (!milestone.id) return
    await onSubmit(milestone.id, files, links, checkedCriteria)
  }

  return (
    <div className={`rounded-[16px] border-2 bg-white overflow-hidden shadow-sm ${cfg.borderCls}`}>

      {/* ── Header ── */}
      <div className="px-[20px] pt-[18px] pb-[14px] flex items-start gap-[14px]">
        <div className={`shrink-0 w-[34px] h-[34px] rounded-full flex items-center justify-center font-bold text-[15px] mt-[1px]
          ${isCompleted ? 'bg-[#2BA88E] text-white' : 'bg-primary/10 text-primary'}`}>
          {milestone.phase_no}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-[8px]">
            <span className="font-bold text-[15px] text-foreground">
              Phase {milestone.phase_no}: {milestone.title}
            </span>
            <span className={`shrink-0 text-[11px] font-medium px-[10px] py-[3px] rounded-full whitespace-nowrap ${cfg.badgeCls}`}>
              {cfg.label}
            </span>
          </div>
          <p className="text-[12px] text-muted-foreground mt-[3px]">
            {fmtDateRange(milestone.startDate, milestone.endDate, milestone.duration)}
            <span className="ml-[8px] font-medium text-foreground">{fmtBaht(milestone.amount)}</span>
          </p>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="px-[20px]">
        <div className="h-[6px] rounded-full bg-[#F1F3F5] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${cfg.barCls}`}
            style={{ width: `${milestone.progress_pct}%` }}
          />
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-[20px] py-[12px] flex items-center justify-between">
        <span className={`text-[13px] font-medium ${isCompleted ? 'text-[#2BA88E]' : 'text-muted-foreground'}`}>
          {milestone.progress_pct}%{isCompleted ? ' สำเร็จ' : milestone.progress_pct > 0 ? ' กำลังดำเนินการ' : ''}
        </span>

        <div className="flex items-center gap-[8px]">
          {isCompleted && (
            <div className="flex items-center gap-[5px] text-[#2BA88E] text-[13px] font-medium">
              <CheckCircle2 size={16} />
              <span>อนุมัติแล้ว</span>
            </div>
          )}
          {isApproved && (
            <>
              <button
                onClick={() => navigate('/pioneer/dashboard/meetings')}
                className="flex items-center gap-[6px] px-[14px] py-[7px] rounded-[10px] border border-border text-[13px] font-medium text-foreground hover:bg-[#F8F9FA] transition-colors cursor-pointer"
              >
                <Calendar size={14} className="text-muted-foreground" />
                นัดประชุม
              </button>
              {milestone.voting_open ? (
                <span className="flex items-center gap-[6px] px-[14px] py-[7px] rounded-[10px] bg-amber-50 border border-amber-200 text-[13px] font-medium text-amber-700">
                  <Vote size={14} />
                  กำลัง Vote อยู่...
                </span>
              ) : (
                <div className="relative group">
                  <button
                    onClick={() => canOpenVoting && milestone.id && onOpenVoting(milestone.id)}
                    disabled={isOpeningVoting || !canOpenVoting}
                    className="flex items-center gap-[6px] px-[14px] py-[7px] rounded-[10px] bg-primary text-white text-[13px] font-medium hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isOpeningVoting ? <Loader2 size={14} className="animate-spin" /> : <Vote size={14} />}
                    เปิด Vote
                  </button>
                  {!canOpenVoting && voteDisabledReason && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 whitespace-nowrap bg-gray-800 text-white text-[11px] px-2 py-1 rounded-[6px] pointer-events-none">
                      {voteDisabledReason}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {milestone.status === 'submitted' && (
            <>
              <span className="text-[12px] text-muted-foreground">รอ Admin ตรวจสอบ...</span>
              <button
                onClick={async () => {
                  if (!milestone.id) return
                  const result = await Swal.fire({
                    title: 'ยืนยันการยกเลิกการส่ง?',
                    text: 'หลักฐานที่ส่งไปจะถูกยกเลิก และ Milestone จะกลับสู่สถานะกำลังดำเนินการ',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'ยืนยัน ยกเลิกการส่ง',
                    cancelButtonText: 'ไม่ยกเลิก',
                    confirmButtonColor: '#DC2626',
                    cancelButtonColor: '#6B7280',
                    reverseButtons: true,
                  })
                  if (result.isConfirmed) onRecall(milestone.id)
                }}
                className="flex items-center gap-[6px] px-[14px] py-[7px] rounded-[10px] border border-red-200 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Undo2 size={14} />
                ยกเลิกการส่ง
              </button>
            </>
          )}
          {canSubmit && (
            <button
              onClick={onToggle}
              className="flex items-center gap-[6px] px-[14px] py-[7px] rounded-[10px] bg-primary text-white text-[13px] font-medium hover:bg-primary/90 transition-colors cursor-pointer"
            >
              {isActive ? <ChevronUp size={16} /> : 'จัดการ'}
            </button>
          )}
          {milestone.status === 'pending' && (
            <span className="text-[12px] text-muted-foreground">รอดำเนินการ</span>
          )}
        </div>
      </div>

      {/* ── Admin rejection note ── */}
      {milestone.status === 'rejected' && milestone.admin_note && (
        <div className="mx-[20px] mb-[12px] p-[12px] rounded-[10px] bg-[#FEF2F2] border border-[#FCA5A5] text-[13px] text-[#DC2626]">
          <span className="font-semibold">หมายเหตุจาก Admin: </span>{milestone.admin_note}
        </div>
      )}

      {/* ── Evidence form (expanded) ── */}
      {isActive && canSubmit && (
        <EvidenceForm
          criteria={milestone.criteria}
          isSubmitting={isSubmitting}
          onCancel={onToggle}
          onSubmit={handleEvidenceSubmit}
        />
      )}
    </div>
  )
}

export default PhaseCard
