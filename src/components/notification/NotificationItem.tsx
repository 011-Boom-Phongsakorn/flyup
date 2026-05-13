import { BellIcon, CheckSquare, TrendingUp, FileText, ThumbsUp, Banknote, CalendarDays, Clock } from 'lucide-react'
import type { Notification } from '../../store/useNotificationStore'

const NOTIF_CONFIG: Record<string, { icon: React.ReactNode; bg: string }> = {
  new_investment:      { icon: <TrendingUp size={16} />, bg: 'bg-emerald-500' },
  milestone:           { icon: <CheckSquare size={16} />, bg: 'bg-violet-500' },
  milestone_submitted: { icon: <CheckSquare size={16} />, bg: 'bg-violet-600' },
  milestone_rejected:  { icon: <CheckSquare size={16} />, bg: 'bg-red-500' },
  vote:                { icon: <ThumbsUp size={16} />, bg: 'bg-blue-500' },
  project_status:      { icon: <FileText size={16} />, bg: 'bg-orange-500' },
  profit:              { icon: <Banknote size={16} />, bg: 'bg-teal-500' },
  meeting:             { icon: <CalendarDays size={16} />, bg: 'bg-sky-500' },
}

export function NotifIcon({ type }: { type: string }) {
  const config = NOTIF_CONFIG[type]
  return (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 ${config?.bg ?? 'bg-primary'}`}>
      {config?.icon ?? <BellIcon size={16} />}
    </div>
  )
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr ?? '')
  if (!dateStr || isNaN(date.getTime())) return ''
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  if (diffSec < 60) return 'เมื่อกี้'
  if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`
  if (diffHour < 24) return `${diffHour} ชั่วโมงที่แล้ว`
  if (diffDay < 30) return `${diffDay} วันที่แล้ว`
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
}

interface Props {
  notif: Notification
  path: string
  onRead: (id: number) => void
  onNavigate: (path: string) => void
}

export default function NotificationItem({ notif, path, onRead, onNavigate }: Props) {
  const handleClick = () => {
    if (!notif.is_read) onRead(notif.id)
    onNavigate(path)
  }

  return (
    <div onClick={handleClick} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
      <NotifIcon type={notif.type} />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-foreground leading-snug">{notif.title}</p>
        <p className="text-[12px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">{notif.body}</p>
        <div className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground">
          <Clock size={11} />
          <span>{timeAgo(notif.CreatedAt)}</span>
        </div>
      </div>
      {!notif.is_read && <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1" />}
    </div>
  )
}
