import { useCallback, useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useNotificationStore, type Notification } from '../store/useNotificationStore'
import { useBoosterStore } from '../store/useBoosterStore'
import { useProjectStore } from '../store/useProjectStore'
import { usePublicProjectStore } from '../store/usePublicProjectStore'
import { useAdminStore } from '../store/useAdminStore'
import { useMilestoneStore } from '../store/useMilestoneStore'

const useNotificationSSE = () => {
    const { authUser, checkAuth } = useAuthStore()
    const { addNotification } = useNotificationStore()

    const handleRefresh = useCallback((notif: Notification) => {
        switch (notif.type) {

            case 'verification_approved':
            case 'verification_rejected':
                checkAuth()
                break

            case 'project_status': {
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
                useProjectStore.getState().fetchMyProjects()
                break
            }

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

            case 'milestone_submitted': {
                useAdminStore.getState().fetchPendingMilestones()
                break
            }

            case 'milestone':
            case 'milestone_rejected': {
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
                const milestoneState = useMilestoneStore.getState()
                if (milestoneState.milestones.length > 0) {
                    useMilestoneStore.getState().fetchMilestones(String(pid))
                }
                break
            }

            case 'profit': {
                useBoosterStore.getState().fetchMyInvestments()
                useProjectStore.getState().fetchMyProjects()
                break
            }

            case 'vote': {
                const pid = notif.related_id
                if (!pid) break
                const pubState = usePublicProjectStore.getState()
                if (pubState.currentPublicProject?.id === pid) {
                    pubState.fetchPublicProjectById(pid)
                }
                useBoosterStore.getState().fetchMyInvestments()
                break
            }
        }
    }, [checkAuth])

    useEffect(() => {
        if (!authUser) return

        const token = localStorage.getItem('auth_token')
        if (!token) return

        const url = `${import.meta.env.VITE_BASE_URL}/notifications/stream?token=${encodeURIComponent(token)}`
        const es = new EventSource(url)

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

        return () => es.close()
    }, [authUser, addNotification, handleRefresh])
}

export default useNotificationSSE
