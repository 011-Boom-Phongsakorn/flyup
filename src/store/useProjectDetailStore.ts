import { create } from 'zustand';
import api from '../services/api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Update {
  date: string;
  title: string;
  description: string;
}

export interface Comment {
  id: number;
  user: string;
  badge: string;
  time: string;
  text: string;
}

export interface Question {
  id: number;
  question: string;
  answer: string;
}

// ─── Store Interface ─────────────────────────────────────────────────────────

interface ProjectDetailState {
  updates: Update[];
  comments: Comment[];
  questions: Question[];
  isLoading: boolean;
  fetchProjectDetail: (id: number) => Promise<void>;
}

// ─── Store Implementation ────────────────────────────────────────────────────

export const useProjectDetailStore = create<ProjectDetailState>((set) => ({
  updates: [],
  comments: [],
  questions: [],
  isLoading: false,

  fetchProjectDetail: async (id) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/pioneer/projects/${id}`);
      const data = res.data?.data ?? {};
      set({
        updates: data.updates ?? [],
        comments: data.comments ?? [],
        questions: data.questions ?? [],
      });
    } catch (error) {
      // 401/404 expected for draft projects — silently ignore
      console.warn('fetchProjectDetail:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
