import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ChevronLeft, Loader2, Upload, X, Plus, CheckCircle2, Circle, Calendar, Send, ExternalLink } from 'lucide-react'
import api from '../../services/api'
import { toast } from 'react-hot-toast'

// ─── Types ────────────────────────────────────────────────────────────────────

type MilestoneStatus =
  | 'pending'       // ยังไม่เริ่ม
  | 'in_progress'   // กำลังดำเนินการ
  | 'submitted'     // ส่งหลักฐานแล้ว รอ Admin
  | 'approved'      // Admin อนุมัติแล้ว
  | 'rejected'      // Admin ปฏิเสธ

interface MilestoneData {
  id?: number
  phase_no: number
  title: string
  description: string
  start_date: string
  end_date: string
  amount: number
  criteria: string[]
  status: MilestoneStatus
  progress_pct: number
  admin_note?: string
}

interface EvidenceLink {
  name: string
  url: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<MilestoneStatus, { label: string; className: string }> = {
  pending:     { label: 'ยังไม่เริ่ม',        className: 'bg-[#F1F3F5] text-[#6C757D]' },
  in_progress: { label: 'กำลังดำเนินการ',    className: 'bg-[#7C4DDB] text-white' },
  submitted:   { label: 'รอ Admin ตรวจสอบ',  className: 'bg-[#F5A623] text-white' },
  approved:    { label: 'สำเร็จ',             className: 'bg-[#2BA88E] text-white' },
  rejected:    { label: 'ถูกปฏิเสธ',         className: 'bg-[#EF4444] text-white' },
}

const fmt = (d: string) =>
  d ? new Date(d).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''

const fmtBaht = (v: number) => `฿${v.toLocaleString('th-TH')}`

// ─── Sub-components ───────────────────────────────────────────────────────────

interface PhaseCardProps {
  milestone: MilestoneData
  isActive: boolean
  onToggle: () => void
  onSubmit: (milestoneId: number, files: File[], links: EvidenceLink[], checkedCriteria: boolean[]) => Promise<void>
  isSubmitting: boolean
}

const PhaseCard = ({ milestone, isActive, onToggle, onSubmit, isSubmitting }: PhaseCardProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [links, setLinks] = useState<EvidenceLink[]>([{ name: '', url: '' }])
  const [checkedCriteria, setCheckedCriteria] = useState<boolean[]>(
    milestone.criteria.map(() => false)
  )

  const badge = STATUS_BADGE[milestone.status] ?? STATUS_BADGE['pending']
  const canSubmit = milestone.status === 'in_progress' || milestone.status === 'rejected'
  const isApproved = milestone.status === 'approved'

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setFiles(prev => [...prev, ...Array.from(e.target.files!)])
  }

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx))

  const addLink = () => setLinks(prev => [...prev, { name: '', url: '' }])
  const removeLink = (idx: number) => setLinks(prev => prev.filter((_, i) => i !== idx))
  const updateLink = (idx: number, field: 'name' | 'url', value: string) =>
    setLinks(prev => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)))

  const toggleCriteria = (idx: number) =>
    setCheckedCriteria(prev => prev.map((v, i) => (i === idx ? !v : v)))

  const handleSubmit = async () => {
    if (!milestone.id) return
    const validLinks = links.filter(l => l.url.trim())
    await onSubmit(milestone.id, files, validLinks, checkedCriteria)
  }

  return (
    <div className={`rounded-[16px] border overflow-hidden ${isApproved ? 'border-[#2BA88E]/40' : 'border-border'} bg-white shadow-sm`}>
      {/* Header Row */}
      <div className="flex items-start gap-[16px] p-[20px]">
        {/* Phase number */}
        <div className={`shrink-0 w-[36px] h-[36px] rounded-full flex items-center justify-center font-bold text-[15px] ${isApproved ? 'bg-[#2BA88E] text-white' : 'bg-primary/10 text-primary'}`}>
          {milestone.phase_no}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-[8px] mb-[4px]">
            <span className="font-bold text-[15px] text-foreground">Phase {milestone.phase_no}: {milestone.title}</span>
            <span className={`text-[11px] font-medium px-[10px] py-[2px] rounded-full ${badge.className}`}>
              {badge.label}
            </span>
          </div>

          <div className="flex items-center gap-[6px] text-muted-foreground text-[12px]">
            <Calendar size={12} />
            <span>{fmt(milestone.start_date)} — {fmt(milestone.end_date)}</span>
            <span className="ml-[4px] font-medium text-foreground">{fmtBaht(milestone.amount)}</span>
          </div>

          {/* Progress bar */}
          <div className="mt-[10px] flex items-center gap-[10px]">
            <div className="flex-1 h-[6px] rounded-full bg-[#F1F3F5] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isApproved ? 'bg-[#2BA88E]' : 'bg-primary'}`}
                style={{ width: `${milestone.progress_pct}%` }}
              />
            </div>
            <span className="text-[12px] text-muted-foreground shrink-0">
              {milestone.progress_pct}% {isApproved ? 'สำเร็จ' : 'ไม่สำเร็จ'}
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="shrink-0 flex items-center gap-[8px]">
          {isApproved && (
            <div className="flex items-center gap-[4px] text-[#2BA88E] text-[13px] font-medium">
              <CheckCircle2 size={16} />
              <span>อนุมัติแล้ว</span>
            </div>
          )}
          {milestone.status === 'submitted' && (
            <span className="text-[12px] text-muted-foreground">รอตรวจสอบ...</span>
          )}
          {canSubmit && (
            <button
              onClick={onToggle}
              className="flex items-center gap-[6px] px-[14px] py-[7px] rounded-[10px] bg-primary text-white text-[13px] font-medium hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Send size={14} />
              {isActive ? 'ยุบ' : 'จัดการ'}
            </button>
          )}
        </div>
      </div>

      {/* Admin note (rejected) */}
      {milestone.status === 'rejected' && milestone.admin_note && (
        <div className="mx-[20px] mb-[12px] p-[12px] rounded-[10px] bg-[#FEF2F2] border border-[#FCA5A5] text-[13px] text-[#DC2626]">
          <span className="font-semibold">หมายเหตุจาก Admin: </span>{milestone.admin_note}
        </div>
      )}

      {/* Expanded evidence form */}
      {isActive && canSubmit && (
        <div className="border-t border-border px-[20px] py-[20px] flex flex-col gap-[20px]">

          {/* Acceptance criteria */}
          {milestone.criteria.length > 0 && (
            <div>
              <p className="text-[13px] font-semibold text-foreground mb-[10px]">
                เกณฑ์การยอมรับ <span className="text-[#EF4444]">*</span>
              </p>
              <p className="text-[12px] text-muted-foreground mb-[10px]">(ติ๊กทุกข้อที่ทำเสร็จการเรียบร้อยแล้ว)</p>
              <div className="flex flex-col gap-[8px]">
                {milestone.criteria.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => toggleCriteria(i)}
                    className="flex items-center gap-[10px] p-[12px] rounded-[10px] border border-border hover:bg-[#F8F9FA] transition-colors cursor-pointer text-left w-full"
                  >
                    {checkedCriteria[i]
                      ? <CheckCircle2 size={18} className="text-primary shrink-0" />
                      : <Circle size={18} className="text-muted-foreground shrink-0" />
                    }
                    <span className="text-[13px] text-foreground">{c}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* File upload */}
          <div>
            <p className="text-[13px] font-semibold text-foreground mb-[4px]">
              ไฟล์แนบ <span className="text-[#EF4444]">*</span>
            </p>
            <p className="text-[12px] text-muted-foreground mb-[10px]">รูปภาพ (≤10MB) หรือ PDF (≤50MB)</p>
            <label className="flex flex-col items-center justify-center gap-[8px] p-[24px] border-2 border-dashed border-border rounded-[12px] cursor-pointer hover:border-primary/50 hover:bg-[#F8F9FA] transition-colors">
              <Upload size={20} className="text-muted-foreground" />
              <span className="text-[13px] text-muted-foreground">อัปโหลดไฟล์</span>
              <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
            </label>
            {files.length > 0 && (
              <div className="flex flex-col gap-[6px] mt-[10px]">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between px-[12px] py-[8px] rounded-[8px] bg-[#F8F9FA] border border-border">
                    <span className="text-[12px] text-foreground truncate max-w-[80%]">{f.name}</span>
                    <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-[#EF4444] transition-colors cursor-pointer">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* External links */}
          <div>
            <p className="text-[13px] font-semibold text-foreground mb-[4px]">
              ลิงก์ภายนอก <span className="text-[#EF4444]">*</span>
            </p>
            <p className="text-[12px] text-muted-foreground mb-[10px]">GitHub, Figma, วิดีโอ หรือลิงก์อื่นๆ</p>
            <div className="flex flex-col gap-[8px]">
              {links.map((link, i) => (
                <div key={i} className="flex items-center gap-[8px]">
                  <input
                    type="text"
                    placeholder="ชื่อ (เช่น GitHub)"
                    value={link.name}
                    onChange={e => updateLink(i, 'name', e.target.value)}
                    className="w-[140px] shrink-0 px-[10px] py-[8px] rounded-[8px] border border-border text-[13px] outline-none focus:border-primary"
                  />
                  <div className="flex-1 flex items-center gap-[6px] px-[10px] py-[8px] rounded-[8px] border border-border focus-within:border-primary">
                    <ExternalLink size={14} className="text-muted-foreground shrink-0" />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={link.url}
                      onChange={e => updateLink(i, 'url', e.target.value)}
                      className="flex-1 text-[13px] outline-none bg-transparent"
                    />
                  </div>
                  {links.length > 1 && (
                    <button onClick={() => removeLink(i)} className="text-muted-foreground hover:text-[#EF4444] transition-colors cursor-pointer">
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addLink}
                className="flex items-center gap-[6px] text-[13px] text-primary hover:underline w-fit mt-[2px] cursor-pointer"
              >
                <Plus size={14} /> เพิ่มลิงก์
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-[10px] pt-[4px]">
            <button
              onClick={onToggle}
              className="px-[20px] py-[9px] rounded-[10px] border border-border text-[13px] font-medium text-foreground hover:bg-[#F8F9FA] transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-[6px] px-[20px] py-[9px] rounded-[10px] bg-primary text-white text-[13px] font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              ส่งหลักฐาน
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const MilestonePage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  const [milestones, setMilestones] = useState<MilestoneData[]>([])
  const [projectTitle, setProjectTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [activePhase, setActivePhase] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ── Load data ──
  useEffect(() => {
    if (!projectId) return
    const load = async () => {
      setIsLoading(true)
      try {
        const [projRes, msRes] = await Promise.all([
          api.get(`/pioneer/projects/${projectId}`),
          api.get(`/pioneer/projects/${projectId}/milestones`),
        ])

        setProjectTitle(projRes.data?.data?.title ?? '')

        const raw: {
          id?: number
          phase_no?: number
          title?: string
          description?: string
          start_date?: string
          end_date?: string
          funding_goal?: number
          acceptance_criteria?: string
          status?: MilestoneStatus
          progress_pct?: number
          admin_note?: string
        }[] = msRes.data?.data ?? []

        const fundingGoal: number = projRes.data?.data?.funding_goal ?? 0
        const phasePercents = [0.15, 0.20, 0.30, 0.35]

        const mapped: MilestoneData[] = Array.from({ length: 4 }, (_, i) => {
          const bm = raw.find(m => (m.phase_no ?? 0) === i + 1) ?? {}
          return {
            id: bm.id,
            phase_no: i + 1,
            title: bm.title ?? `Phase ${i + 1}`,
            description: bm.description ?? '',
            start_date: bm.start_date ?? '',
            end_date: bm.end_date ?? '',
            amount: bm.funding_goal ?? Math.round(fundingGoal * phasePercents[i]),
            criteria: bm.acceptance_criteria
              ? bm.acceptance_criteria.split('\n').filter(Boolean)
              : [],
            status: bm.status ?? 'pending',
            progress_pct: bm.progress_pct ?? 0,
            admin_note: bm.admin_note,
          }
        })

        setMilestones(mapped)

        // Auto-expand the first in_progress or rejected phase
        const activeIdx = mapped.findIndex(
          m => m.status === 'in_progress' || m.status === 'rejected'
        )
        if (activeIdx !== -1) setActivePhase(activeIdx)
      } catch (err) {
        console.error('MilestonePage load error:', err)
        toast.error('ไม่สามารถโหลดข้อมูล Milestone ได้')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [projectId])

  // ── Submit evidence ──
  const handleSubmit = async (
    milestoneId: number,
    files: File[],
    links: EvidenceLink[],
    checkedCriteria: boolean[]
  ) => {
    if (!projectId) return
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      files.forEach(f => formData.append('files', f))
      formData.append('links', JSON.stringify(links))
      formData.append('checked_criteria', JSON.stringify(checkedCriteria))

      await api.post(
        `/pioneer/projects/${projectId}/milestones/${milestoneId}/submit`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      toast.success('ส่งหลักฐานเรียบร้อยแล้ว รอ Admin ตรวจสอบ')

      // Optimistic update
      setMilestones(prev =>
        prev.map(m => (m.id === milestoneId ? { ...m, status: 'submitted' as MilestoneStatus } : m))
      )
      setActivePhase(null)
    } catch (err) {
      console.error('Submit evidence error:', err)
      toast.error('เกิดข้อผิดพลาดในการส่งหลักฐาน')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Derived stats ──
  const approvedCount = milestones.filter(m => m.status === 'approved').length
  const totalCount = milestones.length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[24px] pb-[40px]">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-[6px] text-[14px] text-muted-foreground hover:text-foreground transition-colors w-fit cursor-pointer"
      >
        <ChevronLeft size={16} />
        กลับ
      </button>

      {/* Page header */}
      <div>
        <h1 className="text-[22px] font-bold text-foreground">จัดการ Milestone</h1>
        <p className="text-[13px] text-muted-foreground mt-[2px]">
          {projectTitle
            ? `โปรเจกต์ ${projectTitle} — ติดตามและส่งหลักฐานการดำเนินงาน`
            : 'ติดตามและส่งหลักฐานการดำเนินงาน'}
        </p>
      </div>

      {/* Progress overview */}
      <div className="bg-white rounded-[16px] border border-border p-[20px] shadow-sm">
        <div className="flex items-center justify-between mb-[10px]">
          <span className="text-[13px] font-medium text-foreground">ความคืบหน้ารวม</span>
          <span className="text-[13px] font-semibold text-primary">
            {approvedCount}/{totalCount} สำเร็จ
          </span>
        </div>
        <div className="h-[8px] rounded-full bg-[#F1F3F5] overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${totalCount > 0 ? (approvedCount / totalCount) * 100 : 0}%` }}
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
            onToggle={() => setActivePhase(prev => (prev === idx ? null : idx))}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        ))}
      </div>
    </div>
  )
}

export default MilestonePage
