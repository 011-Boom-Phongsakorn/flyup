import { create } from 'zustand';
import api from '../services/api';

// ─── Types ───────────────────────────────────────────────────────────────────

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
  isLoading: boolean;
  isDetailLoading: boolean;

  fetchMyInvestments: () => Promise<void>;
  fetchInvestmentById: (id: number) => Promise<void>;
}

// ─── Store Implementation ────────────────────────────────────────────────────

export const useBoosterStore = create<BoosterStoreState>((set) => ({
  investments: [],
  currentInvestment: null,
  isLoading: false,
  isDetailLoading: false,

  fetchMyInvestments: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/investments');
      const data = res.data?.data ?? res.data?.investments ?? [];
      set({ investments: Array.isArray(data) ? data : [] });
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
      const data = res.data?.data ?? res.data?.investment ?? res.data;
      set({ currentInvestment: data });
    } catch (error) {
      console.error('fetchInvestmentById:', error);
    } finally {
      set({ isDetailLoading: false });
    }
  },
}));
