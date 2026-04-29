import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { useMilestoneStore } from '../../store/useMilestoneStore'
import PhaseCard from '../../components/pioneer/milestone/PhaseCard'
import type { EvidenceLink } from '../../components/pioneer/milestone/types'

const MilestonePage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  const { milestones, projectTitle, isLoading, isSubmitting, fetchMilestones, submitEvidence } =
    useMilestoneStore()

  const [activePhase, setActivePhase] = useState<number | null>(null)

  useEffect(() => {
    if (!projectId) return
    fetchMilestones(projectId).then(firstActive => {
      if (firstActive !== null) setActivePhase(firstActive)
    })
  }, [projectId, fetchMilestones])

  const handleSubmit = async (
    milestoneId: number,
    files: File[],
    links: EvidenceLink[],
    checkedCriteria: string[]
  ) => {
    const ok = await submitEvidence(milestoneId, projectId!, files, links, checkedCriteria)
    if (ok) setActivePhase(null)
  }

  const completedCount = milestones.filter(m => m.status === 'completed').length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[24px] pb-[40px]">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-[6px] text-[14px] text-muted-foreground hover:text-foreground transition-colors w-fit cursor-pointer"
      >
        <ChevronLeft size={16} />
        กลับ
      </button>

      <div>
        <h1 className="text-[22px] font-bold text-foreground">จัดการ Milestone</h1>
        <p className="text-[13px] text-muted-foreground mt-[2px]">
          {projectTitle
            ? `โปรเจกต์ ${projectTitle} — ติดตามและส่งหลักฐานการดำเนินงาน`
            : 'ติดตามและส่งหลักฐานการดำเนินงาน'}
        </p>
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-[16px] border border-border p-[20px] shadow-sm">
        <div className="flex items-center justify-between mb-[10px]">
          <span className="text-[13px] font-medium text-foreground">ความคืบหน้ารวม</span>
          <span className="text-[13px] font-semibold text-primary">{completedCount}/{milestones.length} สำเร็จ</span>
        </div>
        <div className="h-[8px] rounded-full bg-[#F1F3F5] overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Phase cards */}
      <div className="flex flex-col gap-[16px]">
        {milestones.map((m, idx) => (
          <PhaseCard
            key={m.phase_no}
            milestone={m}
            isActive={activePhase === idx}
            onToggle={() => setActivePhase(prev => prev === idx ? null : idx)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        ))}
      </div>
    </div>
  )
}

export default MilestonePage
