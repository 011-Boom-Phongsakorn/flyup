import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Loader2, ChevronRight, Flag } from 'lucide-react'
import { useProjectStore, type ProjectSummary } from '../../store/useProjectStore'

const STATE_LABEL: Record<string, string> = {
  funding:        'กำลังระดมทุน',
  executing:      'กำลังดำเนินการ',
  closed:         'เสร็จสิ้น',
  pending_review: 'รอตรวจสอบ',
  draft:          'แบบร่าง',
  cancelled:      'ถูกยกเลิก',
}

const STATE_BADGE: Record<string, string> = {
  funding:        'bg-[#8B5CF6] text-white',
  executing:      'bg-[#3B82F6] text-white',
  closed:         'bg-[#2BA88E] text-white',
  pending_review: 'bg-[#F5A623] text-white',
  draft:          'bg-[#F1F3F5] text-[#6C757D]',
  cancelled:      'bg-[#EF4444] text-white',
}

const MILESTONE_ELIGIBLE = ['funding', 'executing', 'closed']

const ProjectRow = ({ project }: { project: ProjectSummary }) => {
  const navigate = useNavigate()
  const eligible = MILESTONE_ELIGIBLE.includes(project.state)
  const badge = STATE_BADGE[project.state] ?? 'bg-[#F1F3F5] text-[#6C757D]'
  const label = STATE_LABEL[project.state] ?? project.state

  const progress = project.funding_goal > 0
    ? Math.min(100, Math.round((project.current_funding / project.funding_goal) * 100))
    : 0

  return (
    <div className={`bg-white rounded-[14px] border border-border p-[18px] flex items-center gap-[14px] ${eligible ? 'hover:border-primary/50 hover:shadow-md transition-all cursor-pointer' : 'opacity-60'}`}
      onClick={() => eligible && navigate(`/pioneer/dashboard/projects/${project.id}/milestones`)}
    >
      {/* Thumbnail */}
      <div className="shrink-0 w-[52px] h-[52px] rounded-[10px] bg-[#F1F3F5] overflow-hidden">
        {project.thumbnail_url
          ? <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Flag size={20} /></div>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-[8px] mb-[4px]">
          <span className="font-semibold text-[14px] text-foreground truncate">{project.title}</span>
          <span className={`shrink-0 text-[11px] font-medium px-[8px] py-[2px] rounded-full ${badge}`}>{label}</span>
        </div>
        <div className="flex items-center gap-[8px]">
          <div className="flex-1 h-[5px] rounded-full bg-[#F1F3F5] overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[11px] text-muted-foreground shrink-0">{progress}%</span>
        </div>
      </div>

      {/* Arrow */}
      {eligible && <ChevronRight size={16} className="text-muted-foreground shrink-0" />}
    </div>
  )
}

const MilestoneListPage = () => {
  const { projects, isLoading, fetchMyProjects } = useProjectStore()

  useEffect(() => {
    fetchMyProjects()
  }, [fetchMyProjects])

  const eligible = projects.filter(p => MILESTONE_ELIGIBLE.includes(p.state))
  const others = projects.filter(p => !MILESTONE_ELIGIBLE.includes(p.state))

  return (
    <div className="flex flex-col gap-[24px] pb-[40px]">
      <div>
        <h1 className="text-[22px] font-bold text-foreground">Milestone</h1>
        <p className="text-[13px] text-muted-foreground mt-[2px]">เลือกโปรเจกต์เพื่อจัดการ Milestone</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[40vh]">
          <Loader2 className="size-7 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-[12px] py-[60px] border border-dashed border-border rounded-[16px] bg-white text-muted-foreground">
          <Flag size={32} />
          <span className="text-[14px]">ยังไม่มีโปรเจกต์</span>
        </div>
      ) : (
        <div className="flex flex-col gap-[24px]">
          {eligible.length > 0 && (
            <div className="flex flex-col gap-[10px]">
              <p className="text-[13px] font-semibold text-foreground">โปรเจกต์ที่จัดการ Milestone ได้</p>
              {eligible.map(p => <ProjectRow key={p.id} project={p} />)}
            </div>
          )}

          {others.length > 0 && (
            <div className="flex flex-col gap-[10px]">
              <p className="text-[13px] font-semibold text-muted-foreground">โปรเจกต์อื่นๆ</p>
              {others.map(p => <ProjectRow key={p.id} project={p} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MilestoneListPage
