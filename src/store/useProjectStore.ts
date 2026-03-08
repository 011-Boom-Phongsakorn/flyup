import { create } from 'zustand';
import api from '../services/api';
import { toast } from 'react-hot-toast';

interface ProjectState {
    projects: any[];
    isLoading: boolean;
    isCreating: boolean;
    isSaving: boolean;
    currentProject: any | null;
    getProjects: () => Promise<void>;
    getProjectById: (id: string) => Promise<void>;
    createProject: () => Promise<number | null>;
    updateProject: (id: string, data: any) => Promise<void>
}

export const useProjectStore = create<ProjectState>((set) => ({
    projects: [],
    isLoading: false,
    isCreating: false,
    isSaving: false,
    currentProject: null,
    getProjects: async () => {
        set({ isLoading: true })
        try{
            const res = await api.get('/projects')
            const sortedDate = res.data.reverse();
            set({ projects: sortedDate })
        }catch(error: any) {
            console.error('Failed to fetch projects:', error)
        }finally {
            set({ isLoading: false })
        }
    },
    getProjectById: async (id: string) => {
        try{
            const res = await api.get(`/projects/${id}`)
            set({ currentProject: res.data })
        }catch(error: any) {
            console.error('Failed to fetch project:', error);
        }
    },
    createProject: async () => {
        set({ isCreating: true })
        try{
            const res = await api.post('/projects', {
                status: 'draft',
                title: '',
                description: ''
            })
            const { id } = res.data;
            return id;
        }catch(error: any) {
            toast.error('ไม่สามารถเริ่มสร้างโปรเจกต์ได้')
            return null
        }finally {
            set({ isCreating: false })
        }
    },
    updateProject: async (id: string, data: any) => {
        set({ isSaving: true })
        try{
            const res = await api.patch(`/projects/${id}`, data)
            set({ currentProject: res.data })
        }catch(error){
            console.error('Auto save failed:', error)
        }finally{
            set({ isSaving: false })
        }
    }
}))