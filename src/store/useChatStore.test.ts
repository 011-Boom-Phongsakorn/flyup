import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, makeToast, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
vi.mock('react-hot-toast', () => { const t = makeToast(); return { default: t, toast: t } })
import api from '../services/api'
import toast from 'react-hot-toast'
import { useChatStore } from './useChatStore'

const apiMock = api as unknown as ApiMock

describe('useChatStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useChatStore.setState({ isOpen: false, sessionId: null, messages: [], pendingAction: null, isSending: false })
  })

  it('toggle/close flip the panel state', () => {
    useChatStore.getState().toggle()
    expect(useChatStore.getState().isOpen).toBe(true)
    useChatStore.getState().close()
    expect(useChatStore.getState().isOpen).toBe(false)
  })

  it('sendMessage appends the reply and keeps the session id', async () => {
    apiMock.post.mockResolvedValueOnce(res({
      session: { id: 42 },
      reply: { id: 2, role: 'assistant', content: 'hi there' },
    }))
    await useChatStore.getState().sendMessage('hello')
    expect(apiMock.post).toHaveBeenCalledWith('/chat/messages', { session_id: undefined, message: 'hello' })
    const s = useChatStore.getState()
    expect(s.sessionId).toBe(42)
    expect(s.messages.map(m => m.content)).toEqual(['hello', 'hi there'])
    expect(s.isSending).toBe(false)
  })

  it('sendMessage rolls back the optimistic message on failure', async () => {
    apiMock.post.mockRejectedValueOnce(new Error('500'))
    await useChatStore.getState().sendMessage('hello')
    expect(useChatStore.getState().messages).toHaveLength(0)
    expect(toast.error).toHaveBeenCalledWith('ไม่สามารถส่งข้อความได้')
  })

  it('confirmAction clears the pending action', async () => {
    useChatStore.setState({ pendingAction: { id: 1, session_id: 1, type: 'invest', status: 'pending' } })
    apiMock.post.mockResolvedValueOnce(res({ action: { id: 1 }, reply: { id: 3, role: 'assistant', content: 'done' } }))
    await useChatStore.getState().confirmAction(1, true)
    expect(apiMock.post).toHaveBeenCalledWith('/chat/actions/confirm', { action_id: 1, confirm: true })
    expect(useChatStore.getState().pendingAction).toBeNull()
  })
})
