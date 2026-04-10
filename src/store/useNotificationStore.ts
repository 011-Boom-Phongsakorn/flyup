import { create } from 'zustand'
import api from '../services/api'

export interface Notification {
    id: number
    user_id: number
    type: string
    title: string
    body: string
    is_read: boolean
    related_id?: number
    related_type?: string
    created_at: string
    updated_at: string
}

interface NotificationStore {
    notifications: Notification[]
    unread: number
    total: number
    isLoading: boolean
    fetchNotifications: () => Promise<void>
    markAsRead: (id: number) => Promise<void>
    markAllAsRead: () => Promise<void>
    addNotification: (notif: Notification) => void
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
    notifications: [],
    unread: 0,
    total: 0,
    isLoading: false,

    fetchNotifications: async () => {
        set({ isLoading: true })
        try {
            const res = await api.get('/notifications', { params: { limit: 20, page: 1 } })
            const data = res.data?.data
            set({
                notifications: data?.notifications ?? [],
                unread: data?.unread ?? 0,
                total: data?.total ?? 0,
            })
        } catch {
            // ignore
        } finally {
            set({ isLoading: false })
        }
    },

    markAsRead: async (id: number) => {
        try {
            await api.patch(`/notifications/${id}/read`)
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n.id === id ? { ...n, is_read: true } : n
                ),
                unread: Math.max(0, state.unread - 1),
            }))
        } catch {
            // ignore
        }
    },

    markAllAsRead: async () => {
        try {
            await api.patch('/notifications/read-all')
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
                unread: 0,
            }))
        } catch {
            // ignore
        }
    },

    addNotification: (notif: Notification) => {
        set((state) => {
            const exists = state.notifications.some((n) => n.id === notif.id)
            if (exists) return state
            return {
                notifications: [notif, ...state.notifications],
                unread: state.unread + 1,
                total: state.total + 1,
            }
        })
    },
}))
