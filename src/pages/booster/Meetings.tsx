import { useState, useEffect, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { useBoosterStore, type BoosterMeeting } from '../../store/useBoosterStore';
import MeetingCard, { getMeetingDatetime, MEETING_WINDOW_MS } from '../../components/booster/MeetingCard';

// ─── Page ─────────────────────────────────────────────────────────────────────

const Meetings = () => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'past'>('upcoming');
  const { boosterMeetings, fetchBoosterMeetings } = useBoosterStore();

  useEffect(() => { fetchBoosterMeetings(); }, [fetchBoosterMeetings]);

  const filtered = useMemo(() =>
    boosterMeetings.filter((m: BoosterMeeting) => {
      if (filter === 'all') return true;
      const isCancelled = m.status === 'cancelled' || m.status === 'canceled';
      const isClosed    = m.status === 'closed';
      const isOpen      = m.status === 'open';
      const dt = getMeetingDatetime(m.date, m.time);
      const now = new Date();
      const ongoing  = isOpen && !!dt && dt <= now && now < new Date(dt.getTime() + MEETING_WINDOW_MS);
      const upcoming = isOpen && (!dt || dt > now);
      if (filter === 'ongoing')  return ongoing;
      if (filter === 'upcoming') return upcoming && !isCancelled;
      if (filter === 'past')     return isClosed || isCancelled || (!upcoming && !ongoing && isOpen);
      return true;
    }),
    [boosterMeetings, filter]
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
          <select value={filter} onChange={e => setFilter(e.target.value as typeof filter)}
            className="text-sm bg-background border border-border rounded-lg px-2 py-1 outline-none focus:border-primary cursor-pointer">
            <option value="upcoming">กำลังจะถึง</option>
            <option value="ongoing">กำลังประชุม</option>
            <option value="past">ที่ผ่านมา</option>
            <option value="all">ทั้งหมด</option>
          </select>
        </div>

        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((m: BoosterMeeting) => <MeetingCard key={m.id} meeting={m} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-2xl text-muted-foreground">
            <Calendar size={28} className="mb-2" />
            <p className="text-sm">ไม่มีนัดหมายที่ตรงกับเงื่อนไข</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meetings;
