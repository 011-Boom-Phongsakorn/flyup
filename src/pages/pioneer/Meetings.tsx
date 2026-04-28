import { useEffect, useMemo, useState } from 'react';
import {
  Video, MapPin, Clock, Calendar, ChevronDown,
  ExternalLink, Send, CheckCircle, Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useProjectStore } from '../../store/useProjectStore';

// ─── Types ───────────────────────────────────────────────────────────────────

type MeetingType = 'online' | 'onsite' | 'hybrid';
type MeetingStatus = 'open' | 'closed';
type FilterMode = 'upcoming' | 'past' | 'all';

interface MilestoneOption {
  id: number;
  phase_no?: number;
  title: string;
}

interface ApiMeeting {
  id: number;
  milestone_id: number;
  date: string;            // ISO datetime
  time: string;            // ISO datetime (only HH:mm part is meaningful)
  meeting_type: MeetingType;
  link?: string | null;
  place?: string | null;
  about: string;
  status: MeetingStatus;
}

const MEETING_TYPE_LABEL: Record<MeetingType, string> = {
  online: 'ออนไลน์',
  onsite: 'ออนไซต์',
  hybrid: 'ไฮบริด',
};

// Projects that can host meetings (must have milestones in motion)
const MEETING_ELIGIBLE_STATES = ['funding', 'executing', 'closed'];

function formatDateThai(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function isUpcoming(m: ApiMeeting): boolean {
  const date = new Date(m.date);
  const time = new Date(m.time);
  if (Number.isNaN(date.getTime()) || Number.isNaN(time.getTime())) return true;
  const combined = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    time.getUTCHours(),
    time.getUTCMinutes(),
  );
  return combined.getTime() >= Date.now();
}

// ─── Meeting Card ─────────────────────────────────────────────────────────────

interface MeetingCardProps {
  meeting: ApiMeeting;
  projectTitle: string;
  phaseLabel: string | null;
}

function MeetingCard({ meeting, projectTitle, phaseLabel }: MeetingCardProps) {
  const [expanded, setExpanded] = useState(false);
  const upcoming = isUpcoming(meeting);
  const typeLabel = MEETING_TYPE_LABEL[meeting.meeting_type] ?? meeting.meeting_type;
  const hasDetail = !!meeting.about || !!meeting.link || !!meeting.place;

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden transition-all ${expanded ? 'border-primary/40 shadow-sm' : 'border-border'}`}>
      <div className="flex items-center gap-4 p-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${upcoming ? 'bg-purple-100 text-primary' : 'bg-muted text-muted-foreground'}`}>
          {upcoming ? <Video size={20} /> : <CheckCircle size={20} />}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-sm">
            {projectTitle}
            {phaseLabel && (
              <span className="text-muted-foreground font-normal"> — {phaseLabel}</span>
            )}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDateThai(meeting.date)} เวลา {formatTime(meeting.time)} · {typeLabel}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {upcoming ? (
            <>
              <span className="text-xs font-medium text-primary bg-purple-50 border border-primary/20 px-3 py-1.5 rounded-full hidden sm:inline-block">
                กำลังจะถึง
              </span>
              {meeting.link && (
                <a
                  href={meeting.link}
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

      {expanded && hasDetail && (
        <div className="border-t border-border px-5 py-4 bg-muted/30 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row gap-6">
            {meeting.about && (
              <div className="flex-1">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">วาระการประชุม</h4>
                <p className="text-sm text-foreground whitespace-pre-line">{meeting.about}</p>
              </div>
            )}

            {meeting.link && (
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">ลิงก์ประชุม</h4>
                <a
                  href={meeting.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1 break-all"
                >
                  <ExternalLink size={13} /> {meeting.link}
                </a>
              </div>
            )}

            {meeting.place && (
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">สถานที่</h4>
                <p className="text-sm text-foreground flex items-center gap-1">
                  <MapPin size={13} className="text-muted-foreground" /> {meeting.place}
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
  const { projects, fetchMyProjects } = useProjectStore();

  const [projectId, setProjectId] = useState<string>('');
  const [milestones, setMilestones] = useState<MilestoneOption[]>([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);

  const [milestoneId, setMilestoneId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [meetingType, setMeetingType] = useState<MeetingType | ''>('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [location, setLocation] = useState('');
  const [agenda, setAgenda] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [filter, setFilter] = useState<FilterMode>('all');
  const [meetings, setMeetings] = useState<ApiMeeting[]>([]);
  const [meetingsLoading, setMeetingsLoading] = useState(false);

  // load pioneer projects
  useEffect(() => {
    fetchMyProjects();
  }, [fetchMyProjects]);

  const eligibleProjects = useMemo(
    () => projects.filter(p => MEETING_ELIGIBLE_STATES.includes(p.state)),
    [projects],
  );

  const selectedProject = useMemo(
    () => eligibleProjects.find(p => String(p.id) === projectId) ?? null,
    [eligibleProjects, projectId],
  );

  // when project changes, reset milestone selection and load this project's milestones
  useEffect(() => {
    setMilestoneId('');
    if (!projectId) {
      setMilestones([]);
      return;
    }
    let cancelled = false;
    setMilestonesLoading(true);
    api.get(`/pioneer/projects/${projectId}/milestones`)
      .then(res => {
        if (cancelled) return;
        const list: MilestoneOption[] = (res.data?.data ?? []).map((m: { id: number; phase_no?: number; title?: string }) => ({
          id: m.id,
          phase_no: m.phase_no,
          title: m.title ?? `Phase ${m.phase_no ?? '?'}`,
        }));
        setMilestones(list);
      })
      .catch(() => {
        if (!cancelled) {
          setMilestones([]);
          toast.error('โหลด Milestone ไม่สำเร็จ');
        }
      })
      .finally(() => {
        if (!cancelled) setMilestonesLoading(false);
      });
    return () => { cancelled = true; };
  }, [projectId]);

  // load meetings when project or filter changes
  const loadMeetings = useMemo(() => {
    return async (pid: string, f: FilterMode) => {
      if (!pid) {
        setMeetings([]);
        return;
      }
      setMeetingsLoading(true);
      try {
        const res = await api.get(`/projects/${pid}/meetings`, { params: { filter: f } });
        const list: ApiMeeting[] = res.data?.data ?? [];
        setMeetings(list);
      } catch {
        setMeetings([]);
      } finally {
        setMeetingsLoading(false);
      }
    };
  }, []);

  useEffect(() => {
    loadMeetings(projectId, filter);
  }, [projectId, filter, loadMeetings]);

  const milestoneLabel = (mid: number): string | null => {
    const m = milestones.find(x => x.id === mid);
    if (!m) return null;
    return m.phase_no ? `Phase ${m.phase_no}` : m.title;
  };

  const handleSubmit = async () => {
    if (!projectId) { toast.error('กรุณาเลือกโปรเจกต์'); return; }
    if (!milestoneId) { toast.error('กรุณาเลือก Milestone'); return; }
    if (!date) { toast.error('กรุณาเลือกวันที่'); return; }
    if (!time) { toast.error('กรุณาเลือกเวลา'); return; }
    if (!meetingType) { toast.error('กรุณาเลือกรูปแบบการประชุม'); return; }
    if ((meetingType === 'online' || meetingType === 'hybrid') && !meetingUrl.trim()) {
      toast.error('กรุณาระบุลิงก์ประชุม');
      return;
    }
    if ((meetingType === 'onsite' || meetingType === 'hybrid') && !location.trim()) {
      toast.error('กรุณาระบุสถานที่');
      return;
    }

    setIsSending(true);
    try {
      const payload = {
        milestone_id: Number(milestoneId),
        date,
        time,
        meeting_type: meetingType,
        link: meetingType === 'online' || meetingType === 'hybrid' ? meetingUrl.trim() : undefined,
        place: meetingType === 'onsite' || meetingType === 'hybrid' ? location.trim() : undefined,
        about: agenda.trim(),
      };

      await api.post(`/pioneer/projects/milestones/${milestoneId}/meeting`, payload);

      toast.success('ส่งนัดหมายเรียบร้อยแล้ว');
      setMilestoneId('');
      setDate('');
      setTime('');
      setMeetingType('');
      setMeetingUrl('');
      setLocation('');
      setAgenda('');

      // refresh list
      loadMeetings(projectId, filter);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'เกิดข้อผิดพลาด กรุณาลองใหม่';
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <div>
        <h1 className="text-2xl font-bold text-foreground">นัดหมายประชุม</h1>
        <p className="text-sm text-muted-foreground mt-1">นัดประชุมกับ Booster เพื่อรายงานความคืบหน้าก่อนลงทุนต่อ</p>
      </div>

      {/* ── Create Form ─────────────────────────────────────────────────────── */}
      <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-5">
        <h2 className="text-base font-bold text-foreground">สร้างนัดหมายใหม่</h2>

        {/* Project */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-foreground">
            โปรเจกต์ <span className="text-error">*</span>
          </label>
          <select
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            className="border border-border rounded-[8px] px-3 py-2.5 text-[14px] outline-none focus:border-primary transition-colors bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236b7280%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center]"
          >
            <option value="">-- เลือกโปรเจกต์ --</option>
            {eligibleProjects.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          {eligibleProjects.length === 0 && (
            <p className="text-[12px] text-muted-foreground">ยังไม่มีโปรเจกต์ที่นัดประชุมได้</p>
          )}
        </div>

        {/* Milestone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-foreground">
            Milestone ที่เกี่ยวข้อง <span className="text-error">*</span>
          </label>
          <select
            value={milestoneId}
            onChange={e => setMilestoneId(e.target.value)}
            disabled={!projectId || milestonesLoading}
            className="border border-border rounded-[8px] px-3 py-2.5 text-[14px] outline-none focus:border-primary transition-colors bg-white cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236b7280%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center]"
          >
            <option value="">
              {milestonesLoading ? 'กำลังโหลด...' : '-- เลือก Milestone --'}
            </option>
            {milestones.map(m => (
              <option key={m.id} value={m.id}>
                {m.phase_no ? `Phase ${m.phase_no}: ${m.title}` : m.title}
              </option>
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
              { value: 'online' as const, icon: <Video size={15} />, label: 'ออนไลน์' },
              { value: 'onsite' as const, icon: <MapPin size={15} />, label: 'ออนไซต์' },
              { value: 'hybrid' as const, icon: <Video size={15} />, label: 'ไฮบริด (ออนไลน์ + ออนไซต์)' },
            ]).map(opt => (
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

        {/* Meeting URL (online/hybrid) */}
        {(meetingType === 'online' || meetingType === 'hybrid') && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">
              ลิงก์ประชุม (Google Meet / Zoom) <span className="text-error">*</span>
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

        {/* Location (onsite/hybrid) */}
        {(meetingType === 'onsite' || meetingType === 'hybrid') && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">
              สถานที่ <span className="text-error">*</span>
            </label>
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
          {isSending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          {isSending ? 'กำลังส่ง...' : 'ส่งนัดหมาย'}
        </button>
      </div>

      {/* ── Meeting List ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-base font-bold text-foreground">การประชุมทั้งหมด</h2>

          {/* Filter Tabs */}
          <div className="inline-flex bg-muted rounded-[10px] p-1 gap-1">
            {([
              { value: 'all' as const, label: 'ทั้งหมด' },
              { value: 'upcoming' as const, label: 'กำลังจะถึง' },
              { value: 'past' as const, label: 'ผ่านมาแล้ว' },
            ]).map(t => (
              <button
                key={t.value}
                onClick={() => setFilter(t.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-colors cursor-pointer ${
                  filter === t.value
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {!projectId ? (
          <p className="text-sm text-muted-foreground text-center py-10">
            เลือกโปรเจกต์ด้านบนเพื่อดูรายการประชุม
          </p>
        ) : meetingsLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : meetings.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">ยังไม่มีการประชุม</p>
        ) : (
          <div className="flex flex-col gap-3">
            {meetings.map(m => (
              <MeetingCard
                key={m.id}
                meeting={m}
                projectTitle={selectedProject?.title ?? ''}
                phaseLabel={milestoneLabel(m.milestone_id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PioneerMeetings;
