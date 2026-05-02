import { create } from 'zustand';
import api from '../services/api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProjectUpdate {
  id: number;
  title: string;
  body: string;
  posted_by: number;
  created_at: string;
}

export interface ProjectThread {
  id: number;
  title: string;
  body: string;
  user_name: string;
  created_at: string;
}

export interface ProjectFAQ {
  id: number;
  question: string;
  answer: string;
}

// ─── Store Interface ─────────────────────────────────────────────────────────

interface ProjectDetailState {
  updates: ProjectUpdate[];
  threads: ProjectThread[];
  faqs: ProjectFAQ[];
  investorCount: number;
  isLoading: boolean;
  fetchUpdates: (id: number) => Promise<void>;
  fetchThreads: (id: number) => Promise<void>;
  fetchFAQs: (id: number) => Promise<void>;
  fetchInvestorCount: (id: number) => Promise<void>;
  fetchAll: (id: number) => Promise<void>;
  createThread: (projectId: number, body: string, isOwner?: boolean) => Promise<void>;
}

// ─── Store Implementation ────────────────────────────────────────────────────

export const useProjectDetailStore = create<ProjectDetailState>((set) => ({
  updates: [],
  threads: [],
  faqs: [],
  investorCount: 0,
  isLoading: false,

  fetchUpdates: async (id: number) => {
    try {
      const res = await api.get(`/projects/${id}/updates`);
      set({ updates: res.data?.data ?? [] });
    } catch (error) {
      console.warn('fetchUpdates:', error);
    }
  },

  fetchThreads: async (id: number) => {
    try {
      const res = await api.get(`/projects/${id}/threads`);
      set({ threads: res.data?.data ?? [] });
    } catch (error) {
      console.warn('fetchThreads:', error);
    }
  },

  fetchFAQs: async (id: number) => {
    try {
      const res = await api.get(`/projects/${id}/faqs`);
      set({ faqs: res.data?.data ?? [] });
    } catch (error) {
      console.warn('fetchFAQs:', error);
    }
  },

  fetchInvestorCount: async (id: number) => {
    try {
      const res = await api.get(`/investments/projects/${id}/investors`);
      set({ investorCount: res.data?.data?.total ?? 0 });
    } catch (error) {
      console.warn('fetchInvestorCount:', error);
      set({ investorCount: 0 });
    }
  },

  createThread: async (projectId: number, body: string, isOwner = false) => {
    const endpoint = isOwner
      ? `/pioneer/projects/${projectId}/threads`
      : `/booster/projects/${projectId}/threads`;
    await api.post(endpoint, { body });
    const res = await api.get(`/projects/${projectId}/threads`);
    set({ threads: res.data?.data ?? [] });
  },

  fetchAll: async (id: number) => {
    set({ isLoading: true });
    try {
      const [updatesRes, threadsRes, faqsRes, invCountRes] = await Promise.allSettled([
        api.get(`/projects/${id}/updates`),
        api.get(`/projects/${id}/threads`),
        api.get(`/projects/${id}/faqs`),
        api.get(`/investments/projects/${id}/investors`),
      ]);
      set({
        updates: updatesRes.status === 'fulfilled' ? updatesRes.value.data?.data ?? [] : [],
        threads: threadsRes.status === 'fulfilled' ? threadsRes.value.data?.data ?? [] : [],
        faqs: faqsRes.status === 'fulfilled' ? faqsRes.value.data?.data ?? [] : [],
        investorCount: invCountRes.status === 'fulfilled' ? invCountRes.value.data?.data?.total ?? 0 : 0,
      });
    } catch (error) {
      console.warn('fetchAll:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
