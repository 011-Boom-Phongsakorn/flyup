import { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useNotificationStore, type Notification } from '../store/useNotificationStore'
import { useBoosterStore } from '../store/useBoosterStore'
import { useProjectStore } from '../store/useProjectStore'
import { usePublicProjectStore } from '../store/usePublicProjectStore'

const useNotificationSSE = () => {
    const { authUser, checkAuth } = useAuthStore()
    const { addNotification } = useNotificationStore()

    useEffect(() => {
        if (!authUser) return

        const url = `${import.meta.env.VITE_BASE_URL}/notifications/stream`
        const es = new EventSource(url, { withCredentials: true })

        es.onmessage = (e: MessageEvent) => {
            try {
                const notif = JSON.parse(e.data) as Notification
                if (!notif?.id) return

                addNotification(notif)
                handleRefresh(notif)
            } catch {
                // ignore ping / non-JSON events
            }
        }

        es.onerror = () => {
            // EventSource auto-reconnects
        }

        return () => {
            es.close()
        }
    }, [authUser, addNotification, checkAuth])

    function handleRefresh(notif: Notification) {
        switch (notif.type) {

            // KYC / ยืนยันตัวตน — refresh authUser ทันที
            case 'verification_approved':
            case 'verification_rejected':
                checkAuth()
                break

            // project status เปลี่ยน — refresh public + pioneer project
            case 'project_status': {
                const pid = notif.related_id
                if (!pid) break
                // refresh public view ถ้ากำลังดูโปรเจกต์นั้นอยู่
                const pubState = usePublicProjectStore.getState()
                if (pubState.currentPublicProject?.id === pid) {
                    pubState.fetchPublicProjectById(pid)
                }
                // refresh pioneer project ถ้าเปิดอยู่
                const pioneerState = useProjectStore.getState()
                if ((pioneerState.currentProject.id ?? 0) === pid) {
                    pioneerState.loadCurrentProject(pid)
                }
                // refresh list
                useProjectStore.getState().fetchMyProjects()
                break
            }

            // มีการลงทุนใหม่ — pioneer refresh project, booster refresh investments
            case 'new_investment': {
                const pid = notif.related_id
                if (pid) {
                    const pubState = usePublicProjectStore.getState()
                    if (pubState.currentPublicProject?.id === pid) {
                        pubState.fetchPublicProjectById(pid)
                    }
                }
                useBoosterStore.getState().fetchMyInvestments()
                break
            }

            // milestone อัปเดต — refresh project
            case 'milestone': {
                const pid = notif.related_id
                if (!pid) break
                const pubState = usePublicProjectStore.getState()
                if (pubState.currentPublicProject?.id === pid) {
                    pubState.fetchPublicProjectById(pid)
                }
                const pioneerState = useProjectStore.getState()
                if ((pioneerState.currentProject.id ?? 0) === pid) {
                    pioneerState.loadCurrentProject(pid)
                }
                break
            }

            // vote — refresh milestone voting data
            case 'vote': {
                const pid = notif.related_id
                if (!pid) break
                const pubState = usePublicProjectStore.getState()
                if (pubState.currentPublicProject?.id === pid) {
                    pubState.fetchPublicProjectById(pid)
                }
                break
            }
        }
    }
}

export default useNotificationSSE
