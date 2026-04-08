import { create } from 'zustand';
import api from '../services/api';
import { toast } from 'react-hot-toast';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CreateInvestmentData {
  project_id: number;
  amount: number;
}

export interface InvestmentData {
  investment_id: number;
  reference_number: string;
  qr_code_image_url: string;
  expires_at: string;
  total_amount: number;
  title: string;
}

export interface InvestmentStatusResponse {
  data?: {
    investment?: { status: string };
    status?: string;
  };
}

// ─── Store Interface ─────────────────────────────────────────────────────────

interface InvestmentStoreState {
  isSubmitting: boolean;
  investmentData: InvestmentData | null;

  createInvestment: (data: CreateInvestmentData) => Promise<boolean>;
  getInvestmentById: (id: number) => Promise<InvestmentStatusResponse>;
  clearInvestmentData: () => void;
}

// ─── Store Implementation ────────────────────────────────────────────────────

export const useInvestmentStore = create<InvestmentStoreState>((set) => ({
  isSubmitting: false,
  investmentData: null,

  createInvestment: async (data: CreateInvestmentData) => {
    set({ isSubmitting: true });
    try {
      const response = await api.post('/investments', data);
      const resData = response.data?.data;
      set({ isSubmitting: false, investmentData: resData });
      return true;
    } catch (error: unknown) {
      set({ isSubmitting: false });
      console.error('Error creating investment:', error);
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'เกิดข้อผิดพลาดในการสร้างรายการลงทุน');
      return false;
    }
  },

  getInvestmentById: async (id: number): Promise<InvestmentStatusResponse> => {
    try {
      const response = await api.get(`/investments/${id}`);
      return response.data as InvestmentStatusResponse;
    } catch (error) {
      console.error(`Error fetching investment ${id}:`, error);
      throw error;
    }
  },

  clearInvestmentData: () => {
    set({ investmentData: null });
  },
}));
