import { create } from 'zustand';
// import api from '../services/api';
import { toast } from 'react-hot-toast';

interface ProjectState {
    projects: any[];
    isLoading: boolean;
    isCreating: boolean;
    isSaving: boolean;
    currentProject: any | null;
    // getProjects: () => Promise<void>;
    // getProjectById: (id: string) => Promise<void>;
    createProject: () => Promise<number | null>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: [],
    isLoading: false,
    isCreating: false,
    isSaving: false,
    currentProject: null,
    // getProjects: async () => {
    //     set({ isLoading: true })
    //     try{
    //         const res = await api.get('/projects')
    //         const sortedDate = res.data.reverse();
    //         set({ projects: sortedDate })
    //     }catch(error: any) {
    //         console.error('Failed to fetch projects:', error)
    //     }finally {
    //         set({ isLoading: false })
    //     }
    // },
    // getProjectById: async (id: string) => {
    //     try{
    //         const res = await api.get(`/projects/${id}`)
    //         set({ currentProject: res.data })
    //     }catch(error: any) {
    //         console.error('Failed to fetch project:', error);
    //     }
    // },
    createProject: async () => {
        set({ isCreating: true })
        try{
            // const res = await api.post('/pioneer/projects')
            // console.log(res)
            // const { id } = res.data;
            set({ currentProject: { projectId: 1, title: 'New' } })
            return 1;
        }catch(error: any) {
            console.log(error)
            toast.error('ไม่สามารถสร้างโปรเจกต์ได้')
            return null
        }finally {
            set({ isCreating: false })
        }
    }
}))