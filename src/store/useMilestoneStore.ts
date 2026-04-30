import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import api from '../services/api'
import { addDays } from '../components/pioneer/milestone/types'
import type { MilestoneData, MilestoneStatus, EvidenceLink } from '../components/pioneer/milestone/types'

const PHASE_PERCENTS = [0.15, 0.20, 0.30, 0.35]

// แปลง status จาก backend (draft/waiting/active/submitted/approved/paid/rejected/failed)
// เป็น status ที่ frontend ใช้ใน STATUS_CONFIG
const mapBackendStatus = (s: string | undefined): MilestoneStatus => {
  switch (s) {
    case 'active':            return 'in_progress'
    case 'submitted':         return 'submitted'
    case 'approved':          return 'approved'
    case 'paid':              return 'completed'
    case 'rejected':
    case 'failed':            return 'rejected'
    case 'draft':
    case 'waiting':
    default:                  return 'pending'
  }
}

interface MilestoneStore {
  milestones: MilestoneData[]
  projectTitle: string
  isLoading: boolean
  isSubmitting: boolean
  fetchMilestones: (projectId: string) => Promise<number | null> // returns index of first active phase
  submitEvidence: (
    milestoneId: number,
    projectId: string,
    files: File[],
    links: EvidenceLink[],
    checkedCriteria: string[]
  ) => Promise<boolean>
  recallEvidence: (milestoneId: number) => Promise<boolean>
  isOpeningVoting: boolean
  openVoting: (milestoneId: number) => Promise<boolean>
}

export const useMilestoneStore = create<MilestoneStore>((set) => ({
  milestones: [],
  projectTitle: '',
  isLoading: false,
  isSubmitting: false,
  isOpeningVoting: false,

  fetchMilestones: async (projectId) => {
    set({ isLoading: true })
    try {
      const [projRes, msRes] = await Promise.all([
        api.get(`/pioneer/projects/${projectId}`),
        api.get(`/projects/${projectId}/milestones`),
      ])

      const proj = projRes.data?.data ?? {}
      const fundingGoal: number = proj.funding_goal ?? 0
      const baseDate: Date | null = proj.funded_at ? new Date(proj.funded_at) : null

      const raw: {
        id?: number
        phase_no?: number
        title?: string
        description?: string
        duration?: number
        funding_goal?: number
        acceptance_criteria?: string
        status?: MilestoneStatus
        progress_pct?: number
        admin_note?: string
        voting_open?: boolean
      }[] = msRes.data?.data ?? []

      const milestones: MilestoneData[] = Array.from({ length: 4 }, (_, i) => {
        const bm = raw.find(m => (m.phase_no ?? 0) === i + 1) ?? {}
        const duration = bm.duration ?? 0

        let startDate: Date | null = null
        let endDate: Date | null = null
        if (baseDate && duration > 0) {
          const prevDays = raw
            .filter(m => (m.phase_no ?? 0) < i + 1)
            .reduce((sum, m) => sum + (m.duration ?? 0), 0)
          startDate = addDays(baseDate, prevDays)
          endDate = addDays(startDate, duration - 1)
        }

        return {
          id: bm.id,
          phase_no: i + 1,
          title: bm.title ?? `Phase ${i + 1}`,
          description: bm.description ?? '',
          duration,
          startDate,
          endDate,
          amount: bm.funding_goal ?? Math.round(fundingGoal * PHASE_PERCENTS[i]),
          criteria: bm.acceptance_criteria
            ? bm.acceptance_criteria.split('\n').filter(Boolean)
            : [],
          status: mapBackendStatus(bm.status),
          progress_pct: mapBackendStatus(bm.status) === 'completed' ? 100 : (bm.progress_pct ?? 0),
          admin_note: bm.admin_note,
          voting_open: bm.voting_open ?? false,
        }
      })

      set({ projectTitle: proj.title ?? '', milestones })

      const firstActive = milestones.findIndex(
        m => m.status === 'in_progress' || m.status === 'rejected'
      )
      return firstActive !== -1 ? firstActive : null
    } catch {
      toast.error('ไม่สามารถโหลดข้อมูล Milestone ได้')
      return null
    } finally {
      set({ isLoading: false })
    }
  },

  submitEvidence: async (milestoneId, _projectId, files, links, checkedCriteria) => {
    set({ isSubmitting: true })
    try {
      const attachments: string[] = []
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await api.post('/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 120000,
        })
        const url: string | undefined = res.data?.data?.url
        if (url) attachments.push(url)
      }

      const body = {
        criteria: checkedCriteria,
        attachments,
        links: links.map(l => l.url.trim()).filter(Boolean),
      }

      await api.patch(
        `/pioneer/projects/milestones/${milestoneId}/submit`,
        body
      )

      toast.success('ส่งหลักฐานเรียบร้อยแล้ว รอ Admin ตรวจสอบ')

      set(state => ({
        milestones: state.milestones.map(m =>
          m.id === milestoneId ? { ...m, status: 'submitted' as MilestoneStatus } : m
        ),
      }))

      return true
    } catch {
      toast.error('เกิดข้อผิดพลาดในการส่งหลักฐาน')
      return false
    } finally {
      set({ isSubmitting: false })
    }
  },

  openVoting: async (milestoneId) => {
    set({ isOpeningVoting: true })
    try {
      await api.patch(`/pioneer/projects/milestones/${milestoneId}/open-vote`)
      toast.success('เปิดการโหวตเรียบร้อยแล้ว')
      set(state => ({
        milestones: state.milestones.map(m =>
          m.id === milestoneId ? { ...m, voting_open: true } : m
        ),
      }))
      return true
    } catch {
      toast.error('ไม่สามารถเปิดการโหวตได้')
      return false
    } finally {
      set({ isOpeningVoting: false })
    }
  },

  recallEvidence: async (milestoneId) => {
    try {
      await api.patch(`/pioneer/projects/milestones/${milestoneId}/recall`)
      toast.success('ยกเลิกการส่งหลักฐานเรียบร้อยแล้ว')
      set(state => ({
        milestones: state.milestones.map(m =>
          m.id === milestoneId ? { ...m, status: 'in_progress' as MilestoneStatus } : m
        ),
      }))
      return true
    } catch {
      toast.error('ไม่สามารถยกเลิกได้')
      return false
    }
  },
}))
