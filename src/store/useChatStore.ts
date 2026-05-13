import { create } from 'zustand'
import api from '../services/api'
import toast from 'react-hot-toast'

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  intent?: string
}

export interface ChatAction {
  id: number
  session_id: number
  type: string
  status: string
  investment_id?: number
}

interface ChatStore {
  isOpen: boolean
  sessionId: number | null
  messages: ChatMessage[]
  pendingAction: ChatAction | null
  isSending: boolean

  toggle: () => void
  close: () => void
  sendMessage: (message: string) => Promise<void>
  confirmAction: (actionId: number, confirm: boolean) => Promise<void>
}

export const useChatStore = create<ChatStore>((set, get) => ({
  isOpen: false,
  sessionId: null,
  messages: [],
  pendingAction: null,
  isSending: false,

  toggle: () => set(s => ({ isOpen: !s.isOpen })),
  close: () => set({ isOpen: false }),

  sendMessage: async (message: string) => {
    const { sessionId } = get()
    const tempId = Date.now()
    set(s => ({
      messages: [...s.messages, { id: tempId, role: 'user', content: message }],
      isSending: true,
    }))

    try {
      const res = await api.post('/chat/messages', {
        session_id: sessionId || undefined,
        message,
      })
      const data = res.data.data as {
        session: { id: number }
        reply: ChatMessage
        action?: ChatAction
      }
      set(s => ({
        sessionId: data.session.id,
        messages: [
          ...s.messages,
          { id: data.reply.id, role: data.reply.role, content: data.reply.content, intent: data.reply.intent },
        ],
        pendingAction: data.action?.status === 'pending' ? data.action : null,
        isSending: false,
      }))
    } catch {
      set(s => ({
        messages: s.messages.filter(m => m.id !== tempId),
        isSending: false,
      }))
      toast.error('ไม่สามารถส่งข้อความได้')
    }
  },

  confirmAction: async (actionId: number, confirm: boolean) => {
    set({ isSending: true })
    try {
      const res = await api.post('/chat/actions/confirm', {
        action_id: actionId,
        confirm,
      })
      const data = res.data.data as {
        action: ChatAction
        reply: ChatMessage
      }
      set(s => ({
        messages: [
          ...s.messages,
          { id: data.reply.id, role: data.reply.role, content: data.reply.content },
        ],
        pendingAction: null,
        isSending: false,
      }))
    } catch {
      set({ isSending: false })
      toast.error('ไม่สามารถดำเนินการได้')
    }
  },
}))
