import { Loader2 } from 'lucide-react';
import MeetingCard from './MeetingCard';
import type { FilterMode, Meeting, MilestoneOption } from './types';

interface MeetingListProps {
  meetings: Meeting[];
  loading: boolean;
  filter: FilterMode;
  onFilterChange: (f: FilterMode) => void;
  milestones: MilestoneOption[];
  onEdit?: (m: Meeting) => void;
  onCancel?: (m: Meeting) => void;
}

const FILTER_TABS: { value: FilterMode; label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'upcoming', label: 'กำลังจะถึง' },
  { value: 'past', label: 'ผ่านมาแล้ว' },
];

export default function MeetingList({ meetings, loading, filter, onFilterChange, milestones, onEdit, onCancel }: MeetingListProps) {
  const findMilestone = (mid: number) => milestones.find(x => x.id === mid);

  const milestoneLabel = (mid: number): string | null => {
    const m = findMilestone(mid);
    if (!m) return null;
    return m.phase_no ? `Phase ${m.phase_no}` : m.title;
  };

  const projectTitleByMilestone = (mid: number): string => {
    return findMilestone(mid)?.project_title ?? '';
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-base font-bold text-foreground">การประชุมทั้งหมด</h2>

        <div className="inline-flex bg-muted rounded-[10px] p-1 gap-1">
          {FILTER_TABS.map(t => (
            <button
              key={t.value}
              onClick={() => onFilterChange(t.value)}
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

      {loading ? (
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
              projectTitle={projectTitleByMilestone(m.milestone_id)}
              phaseLabel={milestoneLabel(m.milestone_id)}
              onEdit={onEdit}
              onCancel={onCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
