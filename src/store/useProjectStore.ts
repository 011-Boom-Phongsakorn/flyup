import { create } from 'zustand';
// import api from '../services/api';
import { toast } from 'react-hot-toast';

export interface ProjectMedia {
    name: string;
    url: string;    // Blob URL สำหรับ Preview หรือ URL จริงจาก Server
    file?: File;    // ไฟล์จริงสำหรับส่งไป API
}

// ✅ สำหรับข้อมูลแต่ละ Milestone (Phase)
export interface Milestone {
    title: string;
    description: string;
    amount: number;
    startDate: string;
    endDate: string;
    criteria: string[]; // รายการเกณฑ์การยอมรับ (Array of string)
    files: ProjectMedia[]; // ไฟล์ประกอบ (ไม่บังคับ)
    video: ProjectMedia | null; // วิดีโอ (ไม่บังคับ)
}

export interface Project {
    title: string;
    description: string;
    category: string;
    fundingGoal: number;
    projectDuration: number;
    softCap: number;
    campaignDuration: number;
    revenueShare: number;
    files: ProjectMedia[]; // รองรับสูงสุด 5 รูป
    video: ProjectMedia | null;
    story: string;
    risks: string;
    milestones: Milestone[];
}

interface ProjectState {
    projects: any[];
    currentProject: Project;
    isLoading: boolean;
    isCreating: boolean;
    isSaving: boolean;
    
    // Actions
    createProject: () => Promise<number | null>;
    updateProjectInfo: (data: Partial<Project>) => void; // ✅ เพิ่มสำหรับ Step 1 & 2
    updateMilestone: (index: number, data: Partial<Milestone>) => void; // ✅ เพิ่มสำหรับ Step 3
}

const initialProject: Project = {
    title: '',
    description: '',
    category: '',
    fundingGoal: 0,
    projectDuration: 0,
    softCap: 0,
    campaignDuration: 0,
    revenueShare: 0,
    files: [],
    video: null,
    story: '',
    risks: '',
    milestones: Array.from({ length: 4 }, () => ({
        title: '',
        description: '',
        amount: 0,
        startDate: '',
        endDate: '',
        criteria: [''],
        files: [],
        video: null,
    })),
};

export const useProjectStore = create<ProjectState>((set) => ({
    projects: [],
    currentProject: initialProject,
    isLoading: false,
    isCreating: false,
    isSaving: false,

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

    createProject: async () => {
        set({ isCreating: true });
        try {
            // จำลองการเรียก API
            // const res = await api.post('/pioneer/projects')
            set({ currentProject: { ...initialProject, title: 'โปรเจกต์ใหม่' } });
            return 1;
        } catch (error) {
            console.error(error);
            toast.error('ไม่สามารถสร้างโปรเจกต์ได้');
            return null;
        } finally {
            set({ isCreating: false });
        }
    },
}))