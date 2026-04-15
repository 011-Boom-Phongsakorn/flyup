import { useState } from 'react';
import {
  Video, MapPin, Clock, Calendar, ChevronDown,
  ExternalLink, Send, CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

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
  type: 'ออนไลน์' | 'ออนไซต์' | '';
  meetingUrl?: string;
  location?: string;
  status: 'upcoming' | 'past';
  agendas?: MeetingAgenda[];
}

// ─── Mock Data (TODO: replace with API) ──────────────────────────────────────

const mockMilestones = [
  { value: '1', label: 'Phase 1: วางแผนและออกแบบ' },
  { value: '2', label: 'Phase 2: พัฒนา MVP' },
  { value: '3', label: 'Phase 3: ทดสอบระบบ' },
  { value: '4', label: 'Phase 4: เปิดตัว' },
];

const mockMeetings: Meeting[] = [
  {
    id: 1,
    projectTitle: 'UniTrack',
    phaseLabel: 'Phase 2',
    date: '2026-04-20',
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
    phaseLabel: 'Phase 1',
    date: '2026-01-20',
    time: '10:00',
    type: 'ออนไลน์',
    meetingUrl: 'https://meet.google.com/xyz-abcd-efg',
    status: 'past',
    agendas: [{ title: 'วางแผนการดำเนินโปรเจกต์' }],
  },
];

function formatDateThai(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Meeting Card ─────────────────────────────────────────────────────────────

function MeetingCard({ meeting }: { meeting: Meeting }) {
  const [expanded, setExpanded] = useState(false);
  const isUpcoming = meeting.status === 'upcoming';
  const hasAgendas = (meeting.agendas?.length ?? 0) > 0;
  const hasDetail = hasAgendas || !!meeting.meetingUrl || !!meeting.location;

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden transition-all ${expanded ? 'border-primary/40 shadow-sm' : 'border-border'}`}>
      {/* Header */}
      <div className="flex items-center gap-4 p-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isUpcoming ? 'bg-purple-100 text-primary' : 'bg-muted text-muted-foreground'}`}>
          {isUpcoming ? <Video size={20} /> : <CheckCircle size={20} />}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-sm">
            {meeting.projectTitle}
            {meeting.phaseLabel && (
              <span className="text-muted-foreground font-normal"> — {meeting.phaseLabel}</span>
            )}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDateThai(meeting.date)} เวลา {meeting.time}
            {meeting.type && <> · {meeting.type}</>}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isUpcoming ? (
            <>
              <span className="text-xs font-medium text-primary bg-purple-50 border border-primary/20 px-3 py-1.5 rounded-full hidden sm:inline-block">
                กำลังจะถึง
              </span>
              {meeting.meetingUrl && (
                <a
                  href={meeting.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <Video size={13} /> เข้าร่วม
                </a>
              )}
              {hasDetail && (
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

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border px-5 py-4 bg-muted/30 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row gap-6">
            {hasAgendas && (
              <div className="flex-1">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">วาระการประชุม</h4>
                <ol className="space-y-2">
                  {meeting.agendas!.map((a, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground">
                      <span className="text-primary font-bold">{i + 1}.</span>
                      {a.title}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {meeting.meetingUrl && (
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">ลิงก์ประชุม</h4>
                <a
                  href={meeting.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink size={13} /> {meeting.meetingUrl}
                </a>
              </div>
            )}

            {meeting.location && (
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">สถานที่</h4>
                <p className="text-sm text-foreground flex items-center gap-1">
                  <MapPin size={13} className="text-muted-foreground" /> {meeting.location}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PioneerMeetings = () => {
  const [milestoneId, setMilestoneId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [meetingType, setMeetingType] = useState<'ออนไลน์' | 'ออนไซต์' | ''>('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [location, setLocation] = useState('');
  const [agenda, setAgenda] = useState('');
  const [isSending, setIsSending] = useState(false);

  const upcoming = mockMeetings.filter(m => m.status === 'upcoming');
  const past = mockMeetings.filter(m => m.status === 'past');

  const handleSubmit = async () => {
    if (!milestoneId) { toast.error('กรุณาเลือก Milestone'); return; }
    if (!date) { toast.error('กรุณาเลือกวันที่'); return; }
    if (!time) { toast.error('กรุณาเลือกเวลา'); return; }
    if (!meetingType) { toast.error('กรุณาเลือกรูปแบบการประชุม'); return; }

    setIsSending(true);
    try {
      // TODO: replace with real API call
      await new Promise(res => setTimeout(res, 800));
      toast.success('ส่งนัดหมายเรียบร้อยแล้ว');
      setMilestoneId('');
      setDate('');
      setTime('');
      setMeetingType('');
      setMeetingUrl('');
      setLocation('');
      setAgenda('');
    } catch {
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <div>
        <h1 className="text-2xl font-bold text-foreground">นัดหมายประชุม</h1>
        <p className="text-sm text-muted-foreground mt-1">นัดประชุมกับ Booster เพื่อรายงานความคืบหน้าก่อนลงทุมดี</p>
      </div>

      {/* ── Create Form ─────────────────────────────────────────────────────── */}
      <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-5">
        <h2 className="text-base font-bold text-foreground">สร้างนัดหมายใหม่</h2>

        {/* Milestone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-foreground">
            Milestone ที่เกี่ยวข้อง <span className="text-error">*</span>
          </label>
          <select
            value={milestoneId}
            onChange={e => setMilestoneId(e.target.value)}
            className="border border-border rounded-[8px] px-3 py-2.5 text-[14px] outline-none focus:border-primary transition-colors bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236b7280%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center]"
          >
            <option value="">-- เลือก Milestone --</option>
            {mockMilestones.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Date + Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
              <Calendar size={14} className="text-muted-foreground" /> วันที่ <span className="text-error">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="border border-border rounded-[8px] px-3 py-2.5 text-[14px] outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
              <Clock size={14} className="text-muted-foreground" /> เวลา <span className="text-error">*</span>
            </label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="border border-border rounded-[8px] px-3 py-2.5 text-[14px] outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Meeting Type */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-medium text-foreground">
            รูปแบบการประชุม <span className="text-error">*</span>
          </label>
          <div className="flex flex-col gap-2">
            {([
              { value: 'ออนไลน์', icon: <Video size={15} />, label: 'ออนไลน์' },
              { value: 'ออนไซต์', icon: <MapPin size={15} />, label: 'ออนไซต์' },
            ] as const).map(opt => (
              <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                <div
                  onClick={() => setMeetingType(opt.value)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${meetingType === opt.value ? 'border-primary' : 'border-border'}`}
                >
                  {meetingType === opt.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
                <span className="flex items-center gap-1.5 text-[14px] text-foreground">
                  {opt.icon} {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Meeting URL (online) */}
        {meetingType === 'ออนไลน์' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">
              ลิงก์ประชุม (Google Meet / Zoom)
            </label>
            <input
              type="url"
              value={meetingUrl}
              onChange={e => setMeetingUrl(e.target.value)}
              placeholder="https://meet.google.com/..."
              className="border border-border rounded-[8px] px-3 py-2.5 text-[14px] outline-none focus:border-primary transition-colors"
            />
          </div>
        )}

        {/* Location (onsite) */}
        {meetingType === 'ออนไซต์' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">สถานที่</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="ระบุสถานที่..."
              className="border border-border rounded-[8px] px-3 py-2.5 text-[14px] outline-none focus:border-primary transition-colors"
            />
          </div>
        )}

        {/* Agenda */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-foreground">วาระการประชุม</label>
          <textarea
            value={agenda}
            onChange={e => setAgenda(e.target.value)}
            placeholder="หัวข้อที่ต้องการพูด"
            rows={3}
            className="border border-border rounded-[8px] px-3 py-2.5 text-[14px] outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSending}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-white py-3 rounded-[10px] text-[14px] font-semibold transition-opacity disabled:opacity-50 cursor-pointer"
        >
          <Send size={15} />
          {isSending ? 'กำลังส่ง...' : 'ส่งนัดหมาย'}
        </button>
      </div>

      {/* ── Meeting List ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-foreground">การประชุมทั้งหมด</h2>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">กำลังจะถึง</span>
            </div>
            {upcoming.map(m => <MeetingCard key={m.id} meeting={m} />)}
          </div>
        )}

        {/* Past */}
        <div className="flex flex-col gap-3">
          {upcoming.length > 0 && (
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">ประชุมที่ผ่านมา</span>
            </div>
          )}
          {past.length > 0 ? (
            past.map(m => <MeetingCard key={m.id} meeting={m} />)
          ) : (
            upcoming.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-10">ยังไม่มีการประชุม</p>
            )
          )}
        </div>

        {upcoming.length === 0 && past.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-10">ยังไม่มีการประชุม</p>
        )}
      </div>
    </div>
  );
};

export default PioneerMeetings;
