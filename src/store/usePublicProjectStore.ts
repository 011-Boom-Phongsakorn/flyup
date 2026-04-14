import { create } from 'zustand';
import api from '../services/api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OwnerProfile {
  first_name: string;
  last_name: string;
  university: string;
  faculty: string | null;
  major: string | null;
  bio: string | null;
  verify_status: string;
  project_count: number;
}

export interface PublicProject {
  id: number;
  owner_user_id: number;
  category: string | null;
  title: string;
  description: string | null;
  state: string;
  status: string;
  visibility: string;
  risk: string | null;
  funding_goal: number;
  softcap: number;
  current_funding: number;
  duration_days: number;
  duration_months: number;
  end_date: string | null;
  funding_at: string | null;
  created_at: string;
  updated_at: string;
  profit_share_pct: number;
  min_invest_amount: number;
  max_invest_amount: number;
  platform_fee: number;
  owner_profile: OwnerProfile | null;
  // These may come from detailed GET /projects/{id}
  media?: { id: number; type: string; url: string; sort_order: number }[];
  milestones?: { id: number; phase_no: number; title: string; description: string; percent_release: number; status: string }[];
  stories?: { id: number; title: string; body: string; sort_order: number }[];
  thumbnail_url?: string;
}

export interface Category {
  id: number;
  name: string;
}

// ─── Store Interface ─────────────────────────────────────────────────────────

interface PublicProjectState {
  publicProjects: PublicProject[];
  currentPublicProject: PublicProject | null;
  categories: Category[];
  isLoading: boolean;
  isDetailLoading: boolean;

  fetchPublicProjects: () => Promise<void>;
  fetchPublicProjectById: (id: number) => Promise<void>;
  fetchProjectsByCategory: (categoryId: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
}

// ─── Store Implementation ────────────────────────────────────────────────────

export const usePublicProjectStore = create<PublicProjectState>((set) => ({
  publicProjects: [],
  currentPublicProject: null,
  categories: [],
  isLoading: false,
  isDetailLoading: false,

  fetchPublicProjects: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/projects');
      const projectsRaw: PublicProject[] = res.data?.data ?? [];
      const projects = await Promise.all(
          projectsRaw.map(async (p) => {
              try {
                  const detailRes = await api.get(`/projects/${p.id}`);
                  const media: { type: string | string[]; url: string; sort_order: number }[] = detailRes.data?.data?.media ?? [];
                  const firstImage = media
                      .filter(m => (Array.isArray(m.type) ? m.type[0] : m.type) === 'image')
                      .sort((a, b) => a.sort_order - b.sort_order)[0];
                  return { ...p, thumbnail_url: firstImage?.url };
              } catch {
                  return p;
              }
          })
      );
      set({ publicProjects: projects });
    } catch (error) {
      console.error('fetchPublicProjects:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPublicProjectById: async (id: number) => {
    set({ isDetailLoading: true, currentPublicProject: null });
    try {
      const res = await api.get(`/projects/${id}`);
      const project: PublicProject = res.data?.data ?? null;
      set({ currentPublicProject: project });
    } catch (error) {
      console.error('fetchPublicProjectById:', error);
    } finally {
      set({ isDetailLoading: false });
    }
  },

  fetchProjectsByCategory: async (categoryId: number) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/projects/category/${categoryId}`);
      const projectsRaw: PublicProject[] = res.data?.data ?? [];
      const projects = await Promise.all(
          projectsRaw.map(async (p) => {
              try {
                  const detailRes = await api.get(`/projects/${p.id}`);
                  const media: { type: string | string[]; url: string; sort_order: number }[] = detailRes.data?.data?.media ?? [];
                  const firstImage = media
                      .filter(m => (Array.isArray(m.type) ? m.type[0] : m.type) === 'image')
                      .sort((a, b) => a.sort_order - b.sort_order)[0];
                  return { ...p, thumbnail_url: firstImage?.url };
              } catch {
                  return p;
              }
          })
      );
      set({ publicProjects: projects });
    } catch (error) {
      console.error('fetchProjectsByCategory:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const res = await api.get('/categories');
      const categories: Category[] = res.data?.data ?? [];
      set({ categories });
    } catch (error) {
      console.error('fetchCategories:', error);
    }
  },
}));
