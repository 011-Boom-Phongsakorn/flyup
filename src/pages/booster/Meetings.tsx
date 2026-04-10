import { useState } from 'react';
import { Video, Clock, ChevronDown, ExternalLink, Calendar } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface MeetingAgenda {
  title: string;
}

interface Meeting {
  id: number;
  projectTitle: string;
  phaseLabel: string | null;
  date: string;
  time: string;
  type: string; // ออนไลน์ | ออนไซต์
  meetingUrl?: string;
  status: 'upcoming' | 'past';
  agendas?: MeetingAgenda[];
}

// ─── Mock Data (TODO: replace with API) ──────────────────────────────────────

const mockMeetings: Meeting[] = [
  {
    id: 1,
    projectTitle: 'UniTrack',
    phaseLabel: 'Phase 2',
    date: '18 ก.พ. 2026',
    time: '14:00',
    type: 'ออนไลน์',
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    status: 'upcoming',
    agendas: [
      { title: 'รายงานความก้าวหน้า Sprint 3' },
      { title: 'Demo หน้า Dashboard' },
      { title: 'Q&A กับ Booster' },
    ],
  },
  {
    id: 2,
    projectTitle: 'UniTrack',
    phaseLabel: null,
    date: '25 ก.พ. 2026',
    time: '10:00',
    type: 'ออนไลน์',
    meetingUrl: undefined,
    status: 'upcoming',
    agendas: [],
  },
  {
    id: 3,
    projectTitle: 'UniTrack',
    phaseLabel: null,
    date: '5 ม.ค. 2026',
    time: '15:00',
    type: '',
    status: 'past',
    agendas: [],
  },
];

// ─── Meeting Card ────────────────────────────────────────────────────────────

function MeetingCard({ meeting }: { meeting: Meeting }) {
  const [expanded, setExpanded] = useState(false);
  const isUpcoming = meeting.status === 'upcoming';
  const hasAgendas = meeting.agendas && meeting.agendas.length > 0;

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
          <h3 className="font-bold text-foreground text-sm">
            {meeting.projectTitle}
            {meeting.phaseLabel && <span className="text-muted-foreground font-normal"> — {meeting.phaseLabel}</span>}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {meeting.date} เวลา {meeting.time}
            {meeting.type && <> · {meeting.type}</>}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isUpcoming ? (
            <>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full hidden sm:inline-block">
                กำลังจะถึง
              </span>
              {meeting.meetingUrl && (
                <a
                  href={meeting.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <Video size={14} /> เข้าร่วม
                </a>
              )}
              {(hasAgendas || meeting.meetingUrl) && (
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
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">วาระการประชุม</h4>
                <ol className="space-y-2">
                  {meeting.agendas!.map((a, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground">
                      <span className="text-primary font-bold">{i + 1}</span>
                      {a.title}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Meeting link */}
            {meeting.meetingUrl && (
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">ลิงก์ประชุม</h4>
                <a
                  href={meeting.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink size={14} /> {meeting.meetingUrl}
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
  const upcoming = mockMeetings.filter(m => m.status === 'upcoming');
  const past = mockMeetings.filter(m => m.status === 'past');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">การประชุม</h1>
        <p className="text-sm text-muted-foreground mt-1">นัดหมายประชุม Milestone กับทีมโปรเจกต์</p>
      </div>

      {/* Upcoming */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-muted-foreground" />
          <h2 className="text-base font-bold text-foreground">กำลังจะถึง</h2>
        </div>
        {upcoming.length > 0 ? (
          <div className="space-y-3">
            {upcoming.map(m => <MeetingCard key={m.id} meeting={m} />)}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">ไม่มีนัดหมายที่กำลังจะถึง</p>
        )}
      </div>

      {/* Past */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-4">ประชุมที่ผ่านมา</h2>
        {past.length > 0 ? (
          <div className="space-y-3">
            {past.map(m => <MeetingCard key={m.id} meeting={m} />)}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">ยังไม่มีประชุมที่ผ่านมา</p>
        )}
      </div>
    </div>
  );
};

export default Meetings;
