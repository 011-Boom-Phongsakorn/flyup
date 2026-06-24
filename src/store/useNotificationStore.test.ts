import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, makeToast, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
vi.mock('react-hot-toast', () => { const t = makeToast(); return { default: t, toast: t } })
import api from '../services/api'
import { useNotificationStore, type Notification } from './useNotificationStore'

const apiMock = api as unknown as ApiMock

const notif = (id: number, is_read = false): Notification => ({
  id, user_id: 1, type: 'milestone', title: 't', body: 'b', is_read,
  CreatedAt: '', UpdatedAt: '',
})

describe('useNotificationStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useNotificationStore.setState({ notifications: [], unread: 0, total: 0, isLoading: false })
  })

  it('fetchNotifications populates list/unread/total', async () => {
    apiMock.get.mockResolvedValueOnce(res({ notifications: [notif(1)], unread: 1, total: 1 }))
    await useNotificationStore.getState().fetchNotifications()
    expect(apiMock.get).toHaveBeenCalledWith('/notifications', { params: { limit: 20, page: 1 } })
    expect(useNotificationStore.getState().notifications).toHaveLength(1)
    expect(useNotificationStore.getState().unread).toBe(1)
  })

  it('addNotification prepends and dedups by id', () => {
    useNotificationStore.getState().addNotification(notif(1))
    useNotificationStore.getState().addNotification(notif(1)) // duplicate ignored
    useNotificationStore.getState().addNotification(notif(2))
    expect(useNotificationStore.getState().notifications.map(n => n.id)).toEqual([2, 1])
    expect(useNotificationStore.getState().unread).toBe(2)
  })

  it('markAsRead flags one item and decrements unread', async () => {
    useNotificationStore.setState({ notifications: [notif(1), notif(2)], unread: 2 })
    apiMock.patch.mockResolvedValueOnce(res({}))
    await useNotificationStore.getState().markAsRead(1)
    expect(apiMock.patch).toHaveBeenCalledWith('/notifications/1/read')
    expect(useNotificationStore.getState().notifications.find(n => n.id === 1)?.is_read).toBe(true)
    expect(useNotificationStore.getState().unread).toBe(1)
  })

  it('markAllAsRead flags everything and zeroes unread', async () => {
    useNotificationStore.setState({ notifications: [notif(1), notif(2)], unread: 2 })
    apiMock.patch.mockResolvedValueOnce(res({}))
    await useNotificationStore.getState().markAllAsRead()
    expect(useNotificationStore.getState().unread).toBe(0)
    expect(useNotificationStore.getState().notifications.every(n => n.is_read)).toBe(true)
  })
})
