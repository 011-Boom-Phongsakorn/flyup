import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { BellIcon } from 'lucide-react'
import { useNotificationStore, type Notification } from '../store/useNotificationStore'
import { useAuthStore } from '../store/useAuthStore'
import useNotificationSSE from '../hooks/useNotificationSSE'
import NotificationItem from './notification/NotificationItem'

export function getNotifPath(notif: Notification, role: string): string {
    const { type, related_id, related_type } = notif

    if (role === 'pioneer') {
        switch (type) {
            case 'milestone':
            case 'milestone_submitted':
            case 'milestone_rejected':
                if (related_type === 'project' && related_id)
                    return `/pioneer/dashboard/projects/${related_id}/milestones`
                return '/pioneer/dashboard/milestones'
            case 'profit':   return '/pioneer/dashboard/profit'
            case 'meeting':  return '/pioneer/dashboard/meetings'
            case 'project_status': return '/pioneer/dashboard/projects'
            default:         return '/pioneer/dashboard'
        }
    }

    if (role === 'booster') {
        switch (type) {
            case 'new_investment':
                return related_type === 'investment' && related_id
                    ? `/booster/investments/${related_id}`
                    : '/booster/investments'
            case 'vote':
            case 'milestone':
            case 'milestone_submitted':
                return related_type === 'vote' && related_id
                    ? `/booster/votes/${related_id}`
                    : '/booster/votes'
            case 'milestone_rejected': return '/booster/investments'
            case 'project_status':     return '/booster/investments'
            case 'profit':             return '/booster/profits'
            case 'meeting':            return '/booster/meetings'
            default:                   return '/booster/dashboard'
        }
    }

    if (role === 'admin') {
        switch (type) {
            case 'milestone_submitted':
                return related_type === 'milestone' && related_id
                    ? `/admin/milestones/${related_id}`
                    : '/admin/milestones'
            case 'project_status': return '/admin/projects-approval'
            default:               return '/admin/dashboard'
        }
    }

    return '/'
}

// -------------------- main --------------------

interface NotificationBellProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

const NotificationBell = ({ open: openProp, onOpenChange }: NotificationBellProps = {}) => {
    const { notifications, unread, isLoading, fetchNotifications, markAsRead, markAllAsRead, clearUnreadCount } =
        useNotificationStore()
    const { authUser } = useAuthStore()
    const navigate = useNavigate()

    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = openProp !== undefined
    const open = isControlled ? openProp : internalOpen
    const setOpen = (next: boolean) => {
        if (isControlled) onOpenChange?.(next)
        else setInternalOpen(next)
    }
    const panelRef = useRef<HTMLDivElement>(null)

    useNotificationSSE()

    useEffect(() => {
        fetchNotifications()
    }, [fetchNotifications])

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isControlled, onOpenChange])

    const handleBellClick = () => {
        const next = !open
        setOpen(next)
        if (next && unread > 0) clearUnreadCount()
    }

    const role = authUser?.role ?? ''

    const handleNavigate = (path: string) => {
        setOpen(false)
        navigate(path)
    }

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell button */}
            <button
                onClick={handleBellClick}
                className="p-2 text-foreground hover:bg-background rounded-full transition-colors relative cursor-pointer"
                aria-label="การแจ้งเตือน"
            >
                <BellIcon size={20} />
                {unread > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-[16px] bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                        {unread > 99 ? '99+' : unread}
                    </span>
                )}
            </button>

            {/* Dropdown panel */}
            {open && (
                <div className="absolute right-0 top-full mt-2 w-[360px] bg-white rounded-xl shadow-xl border border-border z-50 overflow-hidden font-kanit">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-[15px] text-foreground">
                                การแจ้งเตือน
                            </span>
                            {unread > 0 && (
                                <span className="bg-primary text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
                                    {unread} ใหม่
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {unread > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-[11px] text-primary hover:underline cursor-pointer"
                                >
                                    อ่านทั้งหมด
                                </button>
                            )}
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-[420px] overflow-y-auto divide-y divide-border">
                        {isLoading ? (
                            <div className="py-10 text-center text-[13px] text-muted-foreground">
                                กำลังโหลด...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-10 text-center text-[13px] text-muted-foreground">
                                ไม่มีการแจ้งเตือน
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <NotificationItem
                                    key={notif.id}
                                    notif={notif}
                                    path={getNotifPath(notif, role)}
                                    onRead={markAsRead}
                                    onNavigate={handleNavigate}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotificationBell
