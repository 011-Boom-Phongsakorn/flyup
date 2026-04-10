import { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useNotificationStore, type Notification } from '../store/useNotificationStore'

const useNotificationSSE = () => {
    const { authUser } = useAuthStore()
    const { addNotification } = useNotificationStore()

    useEffect(() => {
        if (!authUser) return

        const url = `${import.meta.env.VITE_BASE_URL}/notifications/stream`
        const es = new EventSource(url, { withCredentials: true })

        es.onmessage = (e: MessageEvent) => {
            try {
                const notif = JSON.parse(e.data) as Notification
                if (notif?.id) {
                    addNotification(notif)
                }
            } catch {
                // ignore comment/ping events that aren't valid JSON
            }
        }

        es.onerror = () => {
            // EventSource will auto-reconnect on error
        }

        return () => {
            es.close()
        }
    }, [authUser?.email])
}

export default useNotificationSSE
