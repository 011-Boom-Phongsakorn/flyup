import { useState, useEffect, useMemo } from 'react';
import { Video, Clock, ChevronDown, ExternalLink, Calendar } from 'lucide-react';
import { useBoosterStore, type BoosterMeeting } from '../../store/useBoosterStore';

// ─── Meeting Card ────────────────────────────────────────────────────────────

function MeetingCard({ meeting }: { meeting: BoosterMeeting }) {
  const [expanded, setExpanded] = useState(false);

  // Format dates
  const meetingDateStr = meeting.date ? new Date(meeting.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : 'ไม่ระบุวันที่';

  // Check if upcoming
  const [now] = useState<number>(Date.now);
  const meetingDateTime = new Date(`${meeting.date}T${meeting.time || '00:00'}`);
  const isUpcoming = meetingDateTime.getTime() > now && meeting.status !== 'canceled';

  // Parse agendas from `about`
  const agendas = meeting.about ? meeting.about.split('\n').filter((l: string) => l.trim().length > 0) : [];
  const hasAgendas = agendas.length > 0;

  // Type Mapping
  const typeMap: Record<string, string> = { online: 'ออนไลน์', onsite: 'ออนไซต์', hybrid: 'ไฮบริด' };
  const meetingTypeStr = (meeting.meeting_type ? typeMap[meeting.meeting_type] : undefined) ?? meeting.meeting_type ?? '';

  const projectTitle = meeting.project?.title || 'โปรเจกต์';
  const phaseLabel = meeting.milestone ? `Phase ${meeting.milestone.phase_no || ''}: ${meeting.milestone.title || ''}` : '';

  return (
    <div className={`bg-card border rounded-2xl overflow-hidden transition-all ${expanded ? 'border-primary/30' : 'border-border'}`}>
      {/* Header */}
      <div className="flex items-center gap-4 p-5">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isUpcoming ? 'bg-purple-100 text-primary' : 'bg-muted text-muted-foreground'}`}>
          {isUpcoming ? <Video size={20} /> : <Calendar size={20} />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-sm truncate">
            {projectTitle}
            {phaseLabel && <span className="text-muted-foreground font-normal"> — {phaseLabel}</span>}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {meetingDateStr} เวลา {meeting.time?.substring(0, 5) || '00:00'}
            {meetingTypeStr && <> · {meetingTypeStr}</>}
            {meeting.place && <> · {meeting.place}</>}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {meeting.status === 'canceled' ? (
            <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
              ยกเลิก
            </span>
          ) : isUpcoming ? (
            <>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full hidden sm:inline-block">
                กำลังจะถึง
              </span>
              {meeting.link && (
                <a
                  href={meeting.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <Video size={14} /> เข้าร่วม
                </a>
              )}
              {(hasAgendas || meeting.link) && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className={`p-2 rounded-lg hover:bg-muted transition-colors ${expanded ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  <ChevronDown size={16} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                </button>
              )}
            </>
          ) : (
            <span className="text-xs font-medium text-muted-foreground border border-border px-3 py-1.5 rounded-full">
              เสร็จสิ้น
            </span>
          )}
        </div>
      </div>

      {/* Expanded Agenda */}
      {expanded && isUpcoming && (
        <div className="border-t border-border px-5 py-4 bg-muted/30 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Agenda list */}
            {hasAgendas && (
              <div className="flex-1">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">วาระการประชุม / รายละเอียด</h4>
                <ul className="space-y-2 list-disc pl-4">
                  {agendas.map((a: string, i: number) => (
                    <li key={i} className="text-sm text-foreground">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Meeting link */}
            {meeting.link && (
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">ลิงก์ประชุม</h4>
                <a
                  href={meeting.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline font-medium break-all"
                >
                  {meeting.link}
                  <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

const Meetings = () => {
  const [filter, setFilter] = useState<'all' | 'upcoming'>('upcoming');
  const { boosterMeetings, fetchBoosterMeetings } = useBoosterStore();

  useEffect(() => {
    fetchBoosterMeetings();
  }, [fetchBoosterMeetings]);

  const [now] = useState<number>(Date.now);
  const filtered = useMemo(() =>
    boosterMeetings.filter((m: BoosterMeeting) => {
      const meetingDateTime = new Date(`${m.date}T${m.time || '00:00'}`);
      const isUpcoming = meetingDateTime.getTime() > now && m.status !== 'canceled';
      if (filter === 'upcoming') return isUpcoming;
      return true;
    }),
    [boosterMeetings, filter, now]
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">การประชุม</h1>
        <p className="text-sm text-muted-foreground mt-1">นัดหมายประชุม Milestone กับทีมโปรเจกต์</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            <h2 className="text-base font-bold text-foreground">รายการนัดหมาย</h2>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'upcoming')}
            className="text-sm bg-background border border-border rounded-lg px-2 py-1 outline-none focus:border-primary"
          >
            <option value="upcoming">กำลังจะถึง</option>
            <option value="all">ทั้งหมด</option>
          </select>
        </div>

        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((m: BoosterMeeting) => <MeetingCard key={m.id} meeting={m} />)}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">ไม่มีนัดหมายที่ตรงกับเงื่อนไข</p>
        )}
      </div>
    </div>
  );
};

export default Meetings;
