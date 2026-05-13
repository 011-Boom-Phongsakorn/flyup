import { create } from 'zustand'
import api from '../services/api'
import { useAuthStore } from './useAuthStore'

interface ProfileStore {
  isUploading: boolean
  isSaving: boolean
  uploadFile: (file: File) => Promise<string | null>
  patchProfile: (data: Record<string, unknown>) => Promise<boolean>
  submitStudentVerify: (data: {
    student_card_url: string
    declare_truth: boolean
    accept_pioneer_terms: boolean
  }) => Promise<boolean>
  submitIdVerify: (data: {
    id_card_url: string
    selfie_url: string
    declare_truth: boolean
  }) => Promise<{ ok: boolean; status?: string }>
  saveBankAccount: (data: {
    bank_name?: string
    account_name?: string
    account_number?: string
    existingId?: number
  }) => Promise<boolean>
}

export const useProfileStore = create<ProfileStore>((set) => ({
  isUploading: false,
  isSaving: false,

  uploadFile: async (file) => {
    set({ isUploading: true })
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      return res.data?.data?.url ?? null
    } catch {
      return null
    } finally {
      set({ isUploading: false })
    }
  },

  patchProfile: async (data) => {
    try {
      await api.patch('/user/profile', data)
      return true
    } catch {
      return false
    }
  },

  submitStudentVerify: async (data) => {
    set({ isSaving: true })
    try {
      await api.post('/user/student-verify', data)
      await useAuthStore.getState().checkAuth()
      return true
    } catch {
      return false
    } finally {
      set({ isSaving: false })
    }
  },

  submitIdVerify: async (data) => {
    set({ isSaving: true })
    try {
      const res = await api.post('/user/id-verify', data)
      await useAuthStore.getState().checkAuth()
      return { ok: true, status: res.data?.data?.status as string | undefined }
    } catch {
      return { ok: false }
    } finally {
      set({ isSaving: false })
    }
  },

  saveBankAccount: async ({ bank_name, account_name, account_number, existingId }) => {
    set({ isSaving: true })
    try {
      const payload = { bank_name: bank_name || undefined, account_name: account_name || undefined, account_number: account_number || undefined }
      if (existingId) {
        await api.patch(`/user/update-bank/${existingId}`, payload)
      } else {
        await api.post('/user/add-bank', payload)
      }
      await useAuthStore.getState().checkAuth()
      return true
    } catch {
      return false
    } finally {
      set({ isSaving: false })
    }
  },
}))
