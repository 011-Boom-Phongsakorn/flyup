import { useState } from 'react'
import { Video, ChevronDown, ExternalLink, MapPin, Ban, CheckCircle } from 'lucide-react'
import type { BoosterMeeting } from '../../store/useBoosterStore'

export const MEETING_WINDOW_MS = 2 * 60 * 60 * 1000

const TYPE_LABEL: Record<string, string> = { online: 'ออนไลน์', onsite: 'ออนไซต์', hybrid: 'ไฮบริด' }

export function formatDateThai(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatTime(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso.substring(0, 5)
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}

export function getMeetingDatetime(date: string, time: string): Date | null {
  try {
    const dateD = new Date(date)
    const timeD = new Date(time)
    if (isNaN(dateD.getTime()) || isNaN(timeD.getTime())) return null
    return new Date(Date.UTC(dateD.getUTCFullYear(), dateD.getUTCMonth(), dateD.getUTCDate(), timeD.getUTCHours(), timeD.getUTCMinutes()))
  } catch { return null }
}

export default function MeetingCard({ meeting }: { meeting: BoosterMeeting }) {
  const [expanded, setExpanded] = useState(false)

  const isCancelled = meeting.status === 'cancelled' || meeting.status === 'canceled'
  const isClosed    = meeting.status === 'closed'
  const isOpen      = meeting.status === 'open'

  const meetingDatetime = getMeetingDatetime(meeting.date, meeting.time)
  const now = new Date()
  const isOngoing  = isOpen && !!meetingDatetime && meetingDatetime <= now && now < new Date(meetingDatetime.getTime() + MEETING_WINDOW_MS)
  const isUpcoming = isOpen && (!meetingDatetime || meetingDatetime > now)

  const projectTitle = meeting.project?.title || 'โปรเจกต์'
  const phaseLabel   = meeting.milestone ? `Phase ${meeting.milestone.phase_no || ''}: ${meeting.milestone.title || ''}` : ''
  const typeStr = TYPE_LABEL[meeting.meeting_type ?? ''] ?? meeting.meeting_type ?? ''
  const hasDetail = !!meeting.about || !!meeting.link || !!meeting.place

  return (
    <div className={`bg-card border rounded-2xl overflow-hidden transition-all ${expanded ? 'border-primary/30' : 'border-border'} ${isCancelled ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-4 p-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCancelled || isClosed ? 'bg-muted text-muted-foreground' : 'bg-purple-100 text-primary'}`}>
          {isCancelled ? <Ban size={20} /> : isClosed ? <CheckCircle size={20} /> : <Video size={20} />}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-sm truncate">
            {projectTitle}
            {phaseLabel && <span className="text-muted-foreground font-normal"> — {phaseLabel}</span>}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDateThai(meeting.date)} เวลา {formatTime(meeting.time)}
            {typeStr && <> · {typeStr}</>}
            {meeting.place && <> · <MapPin size={10} className="inline" /> {meeting.place}</>}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isCancelled ? (
            <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">ยกเลิก</span>
          ) : isClosed ? (
            <span className="text-xs font-medium text-muted-foreground border border-border px-3 py-1.5 rounded-full">ปิดแล้ว</span>
          ) : isOngoing ? (
            <>
              <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full animate-pulse hidden sm:inline-block">กำลังประชุม</span>
              {meeting.link && (
                <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity">
                  <Video size={14} /> เข้าร่วม
                </a>
              )}
            </>
          ) : isUpcoming ? (
            <>
              <span className="text-xs font-medium text-primary bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-full hidden sm:inline-block">กำลังจะถึง</span>
              {meeting.link && (
                <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity">
                  <Video size={14} /> เข้าร่วม
                </a>
              )}
            </>
          ) : (
            <span className="text-xs font-medium text-muted-foreground border border-border px-3 py-1.5 rounded-full">เสร็จสิ้น</span>
          )}

          {hasDetail && (
            <button onClick={() => setExpanded(!expanded)} className={`p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer ${expanded ? 'text-primary' : 'text-muted-foreground'}`}>
              <ChevronDown size={16} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border px-5 py-4 bg-muted/30 flex flex-col sm:flex-row gap-6">
          {meeting.about && (
            <div className="flex-1">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">วาระการประชุม</h4>
              <ul className="space-y-2 list-disc pl-4">
                {meeting.about.split('\n').filter(l => l.trim()).map((a, i) => (
                  <li key={i} className="text-sm text-foreground">{a}</li>
                ))}
              </ul>
            </div>
          )}
          {meeting.link && (
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">ลิงก์ประชุม</h4>
              <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline font-medium break-all">
                {meeting.link} <ExternalLink size={14} />
              </a>
            </div>
          )}
          {meeting.place && (
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">สถานที่</h4>
              <p className="flex items-center gap-1.5 text-sm text-foreground">
                <MapPin size={14} className="text-muted-foreground shrink-0" /> {meeting.place}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
