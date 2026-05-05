import { create } from 'zustand';
import api from '../services/api';
import type { PublicProject } from './usePublicProjectStore';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface BoosterMeeting {
  id: number;
  project_id: number;
  milestone_id: number | null;
  topic: string;
  about?: string;
  meeting_type?: string;
  place?: string;
  date: string;
  time: string;
  link: string | null;
  status: string;
  created_at: string;
  project?: PublicProject;
  milestone?: {
    id: number;
    title: string;
    phase_no: number;
  };
}

export interface BoosterInvestment {
  id: number;
  project_id: number;
  booster_user_id: number;
  amount: number;
  total_amount?: number;
  fee_amount?: number;
  platform_fee?: number;
  vat?: number;
  net_amount?: number;
  status: string;
  profit_share_pct?: number;
  slip_image: string | null;
  payment_status: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  project?: PublicProject | null;
  milestones?: {
    id: number;
    title: string;
    description: string;
    percent_release: number;
    status: string;
  }[];
}

// ─── Store Interface ─────────────────────────────────────────────────────────

interface BoosterStoreState {
  investments: BoosterInvestment[];
  currentInvestment: BoosterInvestment | null;
  boosterMeetings: BoosterMeeting[];
  isLoading: boolean;
  isDetailLoading: boolean;

  fetchMyInvestments: () => Promise<void>;
  fetchBoosterMeetings: () => Promise<void>;
  fetchInvestmentById: (id: number) => Promise<void>;
  requestRefund: (investmentId: number, reason: string) => Promise<boolean>;
  voteOnMilestone: (milestoneId: number, payload: { vote: 'approve' | 'reject', comment?: string }) => Promise<boolean>;
}

// ─── Store Implementation ────────────────────────────────────────────────────

export const useBoosterStore = create<BoosterStoreState>((set) => ({
  investments: [],
  currentInvestment: null,
  boosterMeetings: [],
  isLoading: false,
  isDetailLoading: false,

  fetchBoosterMeetings: async () => {
    try {
      const res = await api.get('/me/meetings');
      set({ boosterMeetings: res.data?.data ?? [] });
    } catch (error) {
      console.error('fetchBoosterMeetings:', error);
      set({ boosterMeetings: [] });
    }
  },

  fetchMyInvestments: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/investments');
      const data = res.data?.data ?? res.data?.investments ?? [];
      
      let investmentsArray = Array.isArray(data) ? data.map(inv => ({
        ...inv,
        amount: inv.amount ?? inv.total_amount ?? 0,
      })) : [];

      try {
        const myProjectsRes = await api.get('/investments/my-projects');
        const myProjects = myProjectsRes.data?.data ?? [];
        const projectMap = new Map<number, PublicProject>();
        myProjects.forEach((p: PublicProject) => projectMap.set(p.id, p));

        investmentsArray = investmentsArray.map(inv => {
          if (!inv.project && inv.project_id) {
            inv.project = projectMap.get(inv.project_id) ?? null;
          }
          return inv;
        });
      } catch (err) {
        console.error('Failed to fetch my projects for investments mapping', err);
      }

      set({ investments: investmentsArray });
    } catch (error) {
      console.error('fetchMyInvestments:', error);
      set({ investments: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchInvestmentById: async (id: number) => {
    set({ isDetailLoading: true, currentInvestment: null });
    try {
      const res = await api.get(`/investments/${id}`);
      let data = res.data?.data ?? res.data?.investment ?? res.data;
      if (data) {
        data = {
          ...data,
          amount: data.amount ?? data.total_amount ?? 0,
        };
      }
      set({ currentInvestment: data });
    } catch (error) {
      console.error('fetchInvestmentById:', error);
      set({ currentInvestment: null });
    } finally {
      set({ isDetailLoading: false });
    }
  },

  requestRefund: async (investmentId: number, reason: string) => {
    try {
      await api.post(`/investments/${investmentId}/refund`, { reason });
      return true;
    } catch (error) {
      console.error('requestRefund:', error);
      return false;
    }
  },

  voteOnMilestone: async (milestoneId: number, payload: { vote: 'approve' | 'reject', comment?: string }) => {
    try {
      await api.post(`/investments/milestones/${milestoneId}/vote`, payload);
      return true;
    } catch (error) {
      console.error('voteOnMilestone:', error);
      return false;
    }
  },
}));
