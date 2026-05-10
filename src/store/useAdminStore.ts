import { create } from 'zustand'
import api from '../services/api'

export interface PendingProject {
    id: number
    title: string
    owner?: {
        first_name: string
        last_name: string
    }
    funding_goal: number
    state: string
    CreatedAt: string
}

export interface PendingMilestone {
    id: number
    phase_no: number
    title: string
    status: string
    submitted_at: string
    project_id: number
    project_title: string
    owner?: {
        first_name: string
        last_name: string
    }
}

export interface AdminProjectDetail {
    id: number
    title: string
    description: string | null
    risk: string | null
    state: string
    category?: { id: number; name: string } | null
    funding_goal: number
    softcap: number
    current_funding: number
    profit_share_pct: number
    min_invest_amount: number
    max_invest_amount: number
    duration_days: number
    duration_months: number
    platform_fee: number
    CreatedAt: string
    owner: {
        first_name: string
        last_name: string
        email: string
        picture?: string | null
        student_profile?: {
            bio?: string | null
            university?: { name_th?: string | null } | null
        } | null
        student_card_verification?: { status?: string | null } | null
    } | null
    media: { id: number; type: string | string[]; url: string; sort_order: number }[]
    milestones: {
        id: number
        phase_no: number
        title: string
        description: string | null
        percent_release: number
        status: string
        duration?: number
        acceptance_criteria?: string | null
    }[]
    stories: { id: number; title: string; body: string; sort_order: number }[]
    faqs: { id: number; question: string; answer: string }[]
}

export interface AdminMilestoneDetail {
    id: number
    phase_no: number
    title: string
    description: string
    start_date: string
    end_date: string | null
    funding_goal: number
    acceptance_criteria: string
    status: string
    progress_pct: number
    admin_note?: string
    submitted_at?: string
    project_id: number
    project_title: string
    owner?: { first_name: string; last_name: string; email: string }
    evidence_files?: { id: number; url: string; file_name: string }[]
    evidence_links?: { name: string; url: string }[]
    checked_criteria?: boolean[]
}

export interface UniversityDomain {
    id: number
    university_id: number
    domain: string
    is_active: boolean
}

export interface University {
    id: number
    name_th: string | null
    name_en: string | null
    province: string | null
    domains: UniversityDomain[]
}

export interface CreateUniversityRequest {
    name_th: string
    name_en: string
    province: string
}

export interface UniversityDomainRequest {
    domain?: string
    is_active?: boolean
}

interface AdminStore {
    // Lists
    pendingProjects: PendingProject[]
    pendingMilestones: PendingMilestone[]
    isLoading: boolean
    isMilestoneLoading: boolean
    fetchPendingProjects: () => Promise<void>
    fetchPendingMilestones: () => Promise<void>

    // Project detail
    projectDetail: AdminProjectDetail | null
    projectUpdates: { id: number; title: string; body: string; posted_by: number; created_at: string }[]
    projectThreads: { id: number; title: string; body: string; user_name: string; created_at: string }[]
    isProjectDetailLoading: boolean
    fetchAdminProjectDetail: (id: string) => Promise<void>
    approveProject: (id: number) => Promise<void>
    rejectProject: (id: number) => Promise<void>

    // Milestone detail
    milestoneDetail: AdminMilestoneDetail | null
    isMilestoneDetailLoading: boolean
    fetchAdminMilestoneDetail: (milestoneId: string) => Promise<void>
    approveAdminMilestone: (milestoneId: string) => Promise<void>
    rejectAdminMilestone: (milestoneId: string, reason: string) => Promise<void>

    // Universities
    universities: University[]
    universityDetail: University | null
    isUniversitiesLoading: boolean
    fetchUniversities: () => Promise<void>
    fetchUniversity: (id: string) => Promise<void>
    createUniversity: (data: CreateUniversityRequest) => Promise<void>
    updateUniversity: (id: string, data: CreateUniversityRequest) => Promise<void>
    deleteUniversity: (id: string) => Promise<void>
    createUniversityDomain: (id: string, data: UniversityDomainRequest) => Promise<void>
    updateUniversityDomain: (domainId: string, data: UniversityDomainRequest) => Promise<void>
    deleteUniversityDomain: (domainId: string) => Promise<void>
}

export const useAdminStore = create<AdminStore>((set) => ({
    // Lists
    pendingProjects: [],
    pendingMilestones: [],
    isLoading: false,
    isMilestoneLoading: false,

    fetchPendingProjects: async () => {
        set({ isLoading: true })
        try {
            const res = await api.get('/admin/projects/pending-review')
            set({ pendingProjects: res.data.data ?? [] })
        } finally {
            set({ isLoading: false })
        }
    },

    fetchPendingMilestones: async () => {
        set({ isMilestoneLoading: true })
        try {
            const res = await api.get('/admin/projects/milestones/submitted')
            set({ pendingMilestones: res.data.data ?? [] })
        } finally {
            set({ isMilestoneLoading: false })
        }
    },

    // Project detail
    projectDetail: null,
    projectUpdates: [],
    projectThreads: [],
    isProjectDetailLoading: false,

    fetchAdminProjectDetail: async (id) => {
        set({ isProjectDetailLoading: true, projectDetail: null })
        try {
            const [projRes, updatesRes, threadsRes] = await Promise.all([
                api.get(`/admin/projects/${id}/detail`),
                api.get(`/projects/${id}/updates`).catch(() => ({ data: { data: [] } })),
                api.get(`/projects/${id}/threads`).catch(() => ({ data: { data: [] } })),
            ])
            set({
                projectDetail: projRes.data?.data ?? null,
                projectUpdates: updatesRes.data?.data ?? [],
                projectThreads: threadsRes.data?.data ?? [],
            })
        } finally {
            set({ isProjectDetailLoading: false })
        }
    },

    approveProject: async (id) => {
        await api.patch(`/admin/projects/${id}/approve`)
    },

    rejectProject: async (id) => {
        await api.patch(`/admin/projects/${id}/reject`)
    },

    // Milestone detail
    milestoneDetail: null,
    isMilestoneDetailLoading: false,

    fetchAdminMilestoneDetail: async (milestoneId) => {
        set({ isMilestoneDetailLoading: true, milestoneDetail: null })
        try {
            const res = await api.get(`/admin/projects/milestones/${milestoneId}`)
            set({ milestoneDetail: res.data?.data ?? null })
        } finally {
            set({ isMilestoneDetailLoading: false })
        }
    },

    approveAdminMilestone: async (milestoneId) => {
        await api.patch(`/admin/projects/milestones/${milestoneId}/approve`)
    },

    rejectAdminMilestone: async (milestoneId, reason) => {
        await api.patch(`/admin/projects/milestones/${milestoneId}/reject`, { reason })
    },

    // Universities
    universities: [],
    universityDetail: null,
    isUniversitiesLoading: false,

    fetchUniversities: async () => {
        set({ isUniversitiesLoading: true })
        try {
            const res = await api.get('/admin/universities')
            set({ universities: res.data.data ?? [] })
        } finally {
            set({ isUniversitiesLoading: false })
        }
    },

    fetchUniversity: async (id) => {
        set({ isUniversitiesLoading: true, universityDetail: null })
        try {
            const res = await api.get(`/admin/university/${id}`)
            set({ universityDetail: res.data?.data ?? null })
        } finally {
            set({ isUniversitiesLoading: false })
        }
    },

    createUniversity: async (data: CreateUniversityRequest) => {
        await api.post('/admin/create-university', data)
    },

    updateUniversity: async (id: string, data: CreateUniversityRequest) => {
        await api.put(`/admin/update-university/${id}`, data)
    },

    deleteUniversity: async (id: string) => {
        await api.delete(`/admin/delete-university/${id}`)
    },

    createUniversityDomain: async (id: string, data: UniversityDomainRequest) => {
        await api.post(`/admin/create-university-domain/${id}`, data)
    },

    updateUniversityDomain: async (domainId: string, data: UniversityDomainRequest) => {
        await api.put(`/admin/update-university-domain/${domainId}`, data)
    },

    deleteUniversityDomain: async (domainId: string) => {
        await api.delete(`/admin/delete-university-domain/${domainId}`)
    },
}))
