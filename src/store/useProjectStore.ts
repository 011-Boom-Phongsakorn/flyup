import { create } from 'zustand';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

export interface ProjectMedia {
    id?: number;    // backend media ID (มีเมื่อถูก save แล้ว)
    name: string;
    url: string;    // Blob URL สำหรับ Preview หรือ URL จริงจาก Server
    file?: File;    // ไฟล์จริงสำหรับส่งไป API
}

// ✅ สำหรับข้อมูลแต่ละ Milestone (Phase)
export interface Milestone {
    id?: number;          // backend ID (มีเมื่อถูก save แล้ว)
    title: string;
    description: string;
    amount: number;
    duration: number;     // ระยะเวลา (วัน)
    criteria: string[];
    files: ProjectMedia[];
    videos: ProjectMedia[];
}

export interface Project {
    title: string;
    description: string;
    category: string;
    categoryId: number;
    storyId?: number;     // backend ID ของ story section
    state?: string;       // e.g. 'draft' | 'pending_review' | 'funding' | 'executing' | 'closed'
    fundingGoal: number;
    projectDuration: number;
    softCap: number;
    campaignDuration: number;
    revenueShare: number;
    minInvestAmount: number;
    maxInvestAmount: number;
    files: ProjectMedia[]; // รองรับสูงสุด 5 รูป
    video: ProjectMedia | null;
    story: string;
    risks: string;
    milestones: Milestone[];
}

export interface ProjectSummary {
    id: number;
    title: string;
    state: 'draft' | 'pending_review' | 'funding' | 'executing' | 'closed' | 'cancelled';
    status: 'active' | 'funded' | 'failed' | 'rejected' | 'completed' | 'cancelled';
    category: { id: number; name: string } | null;
    description: string | null;
    current_funding: number;
    funding_goal: number;
    thumbnail_url?: string;
}

interface ProjectState {
    projects: ProjectSummary[];
    currentProject: Project;
    isLoading: boolean;
    isCreating: boolean;
    isSaving: boolean;
    saveStatus: 'idle' | 'saving' | 'saved';
    setSaveStatus: (status: 'idle' | 'saving' | 'saved') => void;

    // Actions
    createProject: () => Promise<number | null>;
    loadCurrentProject: (id: number) => Promise<void>;
    fetchMyProjects: () => Promise<void>;
    updateProject: (id: number, data: Partial<Project>) => Promise<void>;
    deleteProject: (id: number) => Promise<boolean>;
    saveStory: (projectId: number, html?: string) => Promise<void>;
    saveMilestonePhase: (projectId: number, phaseIndex: number) => Promise<void>;
    updateProjectInfo: (data: Partial<Project>) => void;
    updateMilestone: (index: number, data: Partial<Milestone>) => void;
    updateProjectStatus: (projectId: number) => Promise<void>;
}

const initialProject: Project = {
    title: '',
    description: '',
    category: '',
    categoryId: 0,
    fundingGoal: 0,
    projectDuration: 0,
    softCap: 0,
    campaignDuration: 0,
    revenueShare: 0,
    minInvestAmount: 0,
    maxInvestAmount: 0,
    files: [],
    video: null,
    story: '',
    risks: '',
    milestones: Array.from({ length: 4 }, () => ({
        title: '',
        description: '',
        amount: 0,
        duration: 0,
        criteria: [''],
        files: [],
        videos: [],
    })),
};

let _savingStory = false;

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: [],
    currentProject: initialProject,
    isLoading: false,
    isCreating: false,
    isSaving: false,
    saveStatus: 'idle',
    setSaveStatus: (status) => set({ saveStatus: status }),

    // ✅ Action สำหรับอัปเดตข้อมูลทั่วไป (Step 1: Basics, Step 2: Story/Risks)
    updateProjectInfo: (data) => {
        set((state) => ({
            currentProject: {
                ...state.currentProject,
                ...data,
            },
        }));
    },

    // ✅ Action สำหรับอัปเดต Milestone (Step 3)
    updateMilestone: (index, data) => {
        try {
            set((state) => {
                const newMilestones = [...state.currentProject.milestones];

                if (index < 0 || index >= newMilestones.length) {
                    throw new Error('Index out of bounds');
                }

                newMilestones[index] = {
                    ...newMilestones[index],
                    ...data,
                };

                return {
                    currentProject: {
                        ...state.currentProject,
                        milestones: newMilestones,
                    },
                };
            });
        } catch (error) {
            console.error(`Failed to update milestone: ${error}`);
            toast.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล Milestone');
        }
    },

    loadCurrentProject: async (id) => {
        set({ isLoading: true });
        try {
            const res = await api.get(`/pioneer/projects/${id}`);
            const d = res.data?.data;
            if (!d) return;

            // Map media
            const media: { id: number; type: string | string[]; url: string; sort_order: number }[] = d.media ?? [];
            const getMediaType = (t: string | string[]) => (Array.isArray(t) ? t[0] ?? '' : t);
            const images = media
                .filter((m) => getMediaType(m.type) === 'image')
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((m) => ({ id: m.id, name: m.url.split('/').pop() ?? 'image', url: m.url }));
            const videoMedia = media.find((m) => getMediaType(m.type) === 'video');
            const video = videoMedia
                ? { id: videoMedia.id, name: videoMedia.url.split('/').pop() ?? 'video', url: videoMedia.url }
                : null;

            // Map stories → join body HTML เข้า story field + เก็บ storyId
            const stories: { id: number; body: string; sort_order: number }[] = d.stories ?? [];
            const sortedStories = stories.sort((a, b) => a.sort_order - b.sort_order);
            const story = sortedStories.map((s) => s.body).join('');
            const storyId = sortedStories[0]?.id;

            // Resolve category id from name
            let categoryId = 0;
            try {
                const catRes = await api.get('/categories');
                const allCats: { id: number; name: string }[] = catRes.data?.data ?? [];
                const matched = allCats.find(c => c.name === d.category);
                categoryId = matched?.id ?? 0;
            } catch { /* ignore */ }

            // Load milestones แยกจาก project เพื่อให้ได้ id ครบ
            let bms: {
                id?: number;
                title?: string;
                description?: string;
                acceptance_criteria?: string;
                duration?: number;
                urls?: string[];
                type?: string;
                phase_no?: number;
            }[] = [];
            try {
                const msRes = await api.get(`/projects/${id}/milestones`);
                const raw: typeof bms = msRes.data?.data ?? [];
                // เรียงตาม phase_no (1-4) แล้ว map ลง index 0-3
                bms = Array.from({ length: 4 }, (_, i) =>
                    raw.find(m => m.phase_no === i + 1) ?? {}
                );
            } catch { /* ignore */ }

            const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov|avi)$/i.test(url);
            const milestones = Array.from({ length: 4 }, (_, i) => {
                const bm = bms[i] ?? {};
                const urls: string[] = bm.urls ?? [];
                const files: ProjectMedia[] = urls
                    .filter(url => !isVideoUrl(url))
                    .map(url => ({ name: url.split('/').pop() ?? 'file', url }));
                const videos: ProjectMedia[] = urls
                    .filter(url => isVideoUrl(url))
                    .map(url => ({ name: url.split('/').pop() ?? 'video', url }));
                return {
                    id: bm.id,
                    title: bm.title ?? '',
                    description: bm.description ?? '',
                    amount: 0,
                    duration: bm.duration ?? 0,
                    criteria: bm.acceptance_criteria
                        ? bm.acceptance_criteria.split('\n').filter(Boolean)
                        : [''],
                    files,
                    videos,
                };
            });

            set({
                currentProject: {
                    title: d.title ?? '',
                    description: d.description ?? '',
                    category: d.category ?? '',
                    categoryId,
                    state: d.state ?? '',
                    fundingGoal: d.funding_goal ?? 0,
                    projectDuration: d.duration_months ?? 0,
                    softCap: d.softcap ?? 0,
                    campaignDuration: d.duration_days ?? 0,
                    revenueShare: d.profit_share_pct ?? 0,
                    minInvestAmount: d.min_invest_amount ?? 0,
                    maxInvestAmount: d.max_invest_amount ?? 0,
                    storyId,
                    files: images,
                    video,
                    story,
                    risks: d.risk ?? '',
                    milestones,
                },
            });
        } catch (error) {
            console.error('loadCurrentProject:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    updateProject: async (id, data) => {
        // map store field names → API field names
        const payload: Record<string, unknown> = {};
        if (data.title !== undefined) payload.title = data.title;
        if (data.description !== undefined) payload.description = data.description;
        if (data.risks !== undefined) payload.risk = data.risks;
        if (data.fundingGoal !== undefined) payload.funding_goal = data.fundingGoal;
        if (data.softCap !== undefined) payload.softcap = data.softCap;
        if (data.projectDuration !== undefined) payload.duration_months = data.projectDuration;
        if (data.campaignDuration !== undefined) payload.duration_days = data.campaignDuration;
        if (data.revenueShare !== undefined) payload.profit_share_pct = data.revenueShare;
        if (data.categoryId !== undefined && data.categoryId > 0) payload.category_id = data.categoryId;
        if (data.minInvestAmount !== undefined) payload.min_invest_amount = data.minInvestAmount;
        if (data.maxInvestAmount !== undefined) payload.max_invest_amount = data.maxInvestAmount;

        if (Object.keys(payload).length === 0) return;

        try {
            const res = await api.patch(`/pioneer/projects/${id}`, payload);
            const d = res.data?.data;
            if (d?.min_invest_amount !== undefined) {
                set((state) => ({
                    currentProject: {
                        ...state.currentProject,
                        minInvestAmount: d.min_invest_amount,
                    },
                }));
            }
        } catch (error) {
            console.error('updateProject:', error);
            toast.error('บันทึกไม่สำเร็จ');
        }
    },

    fetchMyProjects: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/pioneer/projects');
            const projects: ProjectSummary[] = res.data?.data ?? [];

            // Fetch first image thumbnail for each project in parallel
            const withThumbnails = await Promise.all(
                projects.map(async (p) => {
                    try {
                        const mediaRes = await api.get(`/pioneer/projects/${p.id}/media`);
                        const media: { type: string | string[]; url: string; sort_order: number }[] = mediaRes.data?.data ?? [];
                        const firstImage = media
                            .filter(m => (Array.isArray(m.type) ? m.type[0] : m.type) === 'image')
                            .sort((a, b) => a.sort_order - b.sort_order)[0];
                        return { ...p, thumbnail_url: firstImage?.url };
                    } catch {
                        return p;
                    }
                })
            );

            set({ projects: withThumbnails });
        } catch (error) {
            console.error(error);
            toast.error('ไม่สามารถโหลดโปรเจกต์ได้');
        } finally {
            set({ isLoading: false });
        }
    },

    deleteProject: async (id) => {
        try {
            // ลบ milestones ก่อน
            try {
                const msRes = await api.get(`/projects/${id}/milestones`);
                const milestones: { id?: number }[] = msRes.data?.data ?? [];
                await Promise.all(
                    milestones.filter(m => m.id).map(m => api.delete(`/pioneer/projects/milestones/${m.id}`))
                );
            } catch { /* ignore ถ้า milestone ไม่มีหรือลบไม่ได้ */ }

            // ลบ stories และ media ก่อน
            try {
                const projRes = await api.get(`/pioneer/projects/${id}`);
                const projData = projRes.data?.data ?? {};
                const stories: { id?: number }[] = projData.stories ?? [];
                const media: { id?: number }[] = projData.media ?? [];
                await Promise.all([
                    ...stories.filter(s => s.id).map(s => api.delete(`/pioneer/projects/stories/${s.id}`)),
                    ...media.filter(m => m.id).map(m => api.delete(`/pioneer/projects/media/${m.id}`)),
                ]);
            } catch { /* ignore ถ้า story/media ไม่มีหรือลบไม่ได้ */ }

            await api.delete(`/pioneer/projects/${id}`);
            set((state) => ({ projects: state.projects.filter(p => p.id !== id) }));
            return true;
        } catch (error) {
            console.error('deleteProject:', error);
            toast.error('ไม่สามารถลบโปรเจกต์ได้');
            return false;
        }
    },

    saveStory: async (projectId, html?: string) => {
        const { currentProject } = get();
        const content = html ?? currentProject.story;
        if (!content || content === '<p></p>') return;
        try {
            if (currentProject.storyId) {
                await api.patch(`/pioneer/projects/stories/${currentProject.storyId}`, { body: content });
            } else {
                if (_savingStory) return;
                _savingStory = true;
                try {
                    const res = await api.post(`/pioneer/projects/${projectId}/stories`, {
                        title: 'Story',
                        body: content,
                        sort_order: 1,
                    });
                    const newId = res.data?.data?.id;
                    if (newId) {
                        set(state => ({ currentProject: { ...state.currentProject, storyId: newId } }));
                    }
                } finally {
                    _savingStory = false;
                }
            }
        } catch (error) {
            console.error('saveStory:', error);
            toast.error('บันทึก Story ไม่สำเร็จ');
        }
    },

    saveMilestonePhase: async (_projectId, phaseIndex) => {
        const { currentProject } = get();
        const m = currentProject.milestones[phaseIndex];
        const phasePercents = [15, 20, 30, 35];

        const acceptanceCriteria = m.criteria.filter(c => c.trim()).join('\n') || undefined;

        // รวม URL จริง (ไม่ใช่ blob) จาก videos หรือ files
        const videoUrls = (m.videos ?? []).filter(v => v.url && !v.url.startsWith('blob:')).map(v => v.url);
        const fileUrls = (m.files ?? []).filter(f => f.url && !f.url.startsWith('blob:')).map(f => f.url);

        // ไม่ save ถ้ายังไม่มี id (milestone ยังไม่ถูก pre-create) หรือไม่มีข้อมูลอะไรเลย
        if (!m.id) return;
        const hasMedia = videoUrls.length > 0 || fileUrls.length > 0;
        const hasAnyData = !!(m?.title || m?.description || m?.duration || acceptanceCriteria || hasMedia);
        if (!hasAnyData) return;

        const allUrls = [...fileUrls, ...videoUrls];
        const mTypes: string[] = [];
        if (fileUrls.length > 0) {
            if (fileUrls.some(u => /\.(jpg|jpeg|png|gif|webp)$/i.test(u))) mTypes.push('image');
            if (fileUrls.some(u => !/\.(jpg|jpeg|png|gif|webp)$/i.test(u))) mTypes.push('raw');
        }
        if (videoUrls.length > 0) mTypes.push('video');

        try {
            await api.patch(`/pioneer/projects/milestones/${m.id}`, {
                title: m.title,
                description: m.description || undefined,
                phase_no: phaseIndex + 1,
                percent_release: phasePercents[phaseIndex],
                acceptance_criteria: acceptanceCriteria,
                duration: m.duration || undefined,
                urls: allUrls,
                type: mTypes.length > 0 ? mTypes : undefined,
            });
        } catch (error) {
            console.error('saveMilestonePhase:', error);
            toast.error('บันทึก Milestone ไม่สำเร็จ');
        }
    },

    createProject: async () => {
        set({ isCreating: true });
        try {
            const res = await api.post('/pioneer/projects');
            const projectId = res.data?.data?.id ?? res.data?.id;

            // Pre-create milestone ทั้ง 4 phase ทันที เพื่อให้มี id ครบ
            // ต้องสร้างทีละตัว (sequential) เพื่อให้ backend assign phase_no ถูกลำดับ
            const phasePercents = [15, 20, 30, 35];
            const milestoneIds: (number | undefined)[] = [undefined, undefined, undefined, undefined];
            for (let i = 0; i < phasePercents.length; i++) {
                try {
                    const mRes = await api.post(`/pioneer/projects/${projectId}/milestones`, {
                        phase_no: i + 1,
                        percent_release: phasePercents[i],
                    });
                    milestoneIds[i] = mRes.data?.data?.id;
                } catch { /* ignore */ }
            }

            const milestones = initialProject.milestones.map((m, i) => ({
                ...m,
                id: milestoneIds[i],
            }));
            set({ currentProject: { ...initialProject, milestones } });
            return projectId;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            const msg: string = err?.response?.data?.message ?? err?.message ?? '';
            const isNotVerified =
                msg.includes('not verified') ||
                msg.includes('id card not verified') ||
                msg.includes('student card not verified');

            if (isNotVerified) {
                const result = await Swal.fire({
                    icon: 'warning',
                    title: 'ยังไม่ได้ยืนยันตัวตน',
                    text: 'กรุณายืนยันตัวตนก่อนสร้างโปรเจกต์',
                    confirmButtonText: 'ไปยืนยันตัวตน',
                    confirmButtonColor: '#8B5CF6',
                    showCancelButton: true,
                    cancelButtonText: 'ยกเลิก',
                    cancelButtonColor: '#6B7280',
                    reverseButtons: true,
                });
                if (result.isConfirmed) {
                    window.location.href = '/pioneer/profile?tab=verify';
                }
            } else {
                toast.error('ไม่สามารถสร้างโปรเจกต์ได้');
            }
            return null;
        } finally {
            set({ isCreating: false });
        }
    },

    updateProjectStatus: async (projectId) => {
        try {
            await api.patch(`/pioneer/projects/${projectId}/cancel`);
            toast.success('ยกเลิกโปรเจกต์แล้ว');
        } catch (error) {
            console.error(error);
            toast.error('ไม่สามารถยกเลิกโปรเจกต์ได้');
        }
    }
}))