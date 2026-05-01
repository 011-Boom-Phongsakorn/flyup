import { create } from 'zustand';
import api from '../services/api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BoosterMeeting {
  id: number;
  date: string;
  time?: string;
  status: string;
  about?: string;
  meeting_type?: string;
  place?: string;
  link?: string;
  project?: {
    title: string;
  };
  milestone?: {
    phase_no?: number | string;
    title?: string;
  };
}

export interface BoosterInvestment {
  id: number;
  project_id: number;
  user_id: number;
  amount: number;
  platform_fee: number;
  vat: number;
  net_amount: number;
  profit_share_pct: number;
  status: string; // pending, verified, funding, completed, refunded, cancelled
  reference_number: string;
  created_at: string;
  updated_at: string;
  // Joined project data
  project?: {
    id: number;
    title: string;
    state: string;
    current_funding: number;
    funding_goal: number;
    end_date: string | null;
    profit_share_pct: number;
    milestones?: {
      id: number;
      phase_no: number;
      title: string;
      description: string;
      percent_release: number;
      status: string;
    }[];
  };
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
      
      // Map and ensure amount field is populated (fallback to total_amount)
      let investmentsArray = Array.isArray(data) ? data.map(inv => ({
        ...inv,
        amount: inv.amount ?? inv.total_amount ?? 0,
      })) : [];

      // Fetch project details for each investment if not provided by backend
      investmentsArray = await Promise.all(
        investmentsArray.map(async (inv) => {
          if (!inv.project && inv.project_id) {
            try {
              const projRes = await api.get(`/projects/${inv.project_id}`);
              inv.project = projRes.data?.data ?? null;
            } catch {
              console.error(`Failed to fetch project for investment ${inv.id}`);
            }
          }
          return inv;
        })
      );

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
