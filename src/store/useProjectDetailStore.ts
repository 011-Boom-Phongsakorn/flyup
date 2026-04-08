import { create } from 'zustand';
import api from '../services/api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProjectUpdate {
  id: number;
  title: string;
  content: string;
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
  isLoading: boolean;
  fetchUpdates: (id: number) => Promise<void>;
  fetchThreads: (id: number) => Promise<void>;
  fetchFAQs: (id: number) => Promise<void>;
  fetchAll: (id: number) => Promise<void>;
}

// ─── Store Implementation ────────────────────────────────────────────────────

export const useProjectDetailStore = create<ProjectDetailState>((set) => ({
  updates: [],
  threads: [],
  faqs: [],
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

  fetchAll: async (id: number) => {
    set({ isLoading: true });
    try {
      const [updatesRes, threadsRes, faqsRes] = await Promise.allSettled([
        api.get(`/projects/${id}/updates`),
        api.get(`/projects/${id}/threads`),
        api.get(`/projects/${id}/faqs`),
      ]);
      set({
        updates: updatesRes.status === 'fulfilled' ? updatesRes.value.data?.data ?? [] : [],
        threads: threadsRes.status === 'fulfilled' ? threadsRes.value.data?.data ?? [] : [],
        faqs: faqsRes.status === 'fulfilled' ? faqsRes.value.data?.data ?? [] : [],
      });
    } catch (error) {
      console.warn('fetchAll:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
