import { useEffect, useState, useMemo } from 'react';
import { CheckSquare, Loader2 } from 'lucide-react';
import { useBoosterStore } from '../../store/useBoosterStore';
import VoteRow, { type VoteMilestone } from '../../components/booster/VoteRow';
import Pagination from '../../components/shared/Pagination';

type TabKey = 'all' | 'open' | 'closed';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all',    label: 'ทั้งหมด' },
  { key: 'open',   label: 'เปิดโหวต' },
  { key: 'closed', label: 'ปิดแล้ว' },
];

const PAGE_SIZE = 5;

// ─── Page ────────────────────────────────────────────────────────────────────

const Votes = () => {
  const { investments, fetchMyInvestments, isLoading: investLoading, fetchVoteMilestones } = useBoosterStore();
  const [milestones, setMilestones] = useState<VoteMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [page, setPage] = useState(1);

  useEffect(() => { fetchMyInvestments(); }, [fetchMyInvestments]);

  useEffect(() => {
    if (investLoading) return;
    if (investments.length === 0) { setMilestones([]); setLoading(false); return; }

    const projectIds = [...new Set(investments.map(inv => inv.project_id).filter(Boolean))];

    const getTitleById = (pid: number) =>
      investments.find(inv => inv.project_id === pid)?.project?.title ?? `โปรเจกต์ #${pid}`;

    setLoading(true);
    fetchVoteMilestones(projectIds, getTitleById)
      .then(setMilestones)
      .finally(() => setLoading(false));
  }, [investments, investLoading, fetchVoteMilestones]);

  const openVotes   = useMemo(() => milestones.filter(m => m.voting_open === true), [milestones]);
  const closedVotes = useMemo(() => milestones.filter(m => m.voting_open === false && m.voting_closed_at), [milestones]);

  const filtered = useMemo(() => {
    if (activeTab === 'open')   return openVotes;
    if (activeTab === 'closed') return closedVotes;
    return milestones;
  }, [activeTab, milestones, openVotes, closedVotes]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleTabChange = (key: TabKey) => { setActiveTab(key); setPage(1); };

  const isPageLoading = loading || investLoading;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">การโหวต</h1>
        <p className="text-sm text-muted-foreground mt-1">โหวตอนุมัติหรือปฏิเสธ Milestone ของโปรเจกต์ที่คุณลงทุน</p>
      </div>

      {isPageLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={28} className="animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex items-center gap-2 flex-wrap mb-5">
            {TABS.map(t => {
              const count = t.key === 'all' ? milestones.length : t.key === 'open' ? openVotes.length : closedVotes.length;
              return (
                <button
                  key={t.key}
                  onClick={() => handleTabChange(t.key)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border cursor-pointer ${
                    activeTab === t.key
                      ? 'bg-primary text-white border-primary'
                      : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-foreground'
                  }`}
                >
                  {t.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === t.key ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* List */}
          {paginated.length > 0 ? (
            <div className="space-y-4">
              {paginated.map(vote => (
                <VoteRow key={vote.id} vote={vote} isOpen={vote.voting_open === true} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-xl">
              <CheckSquare size={32} className="mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {activeTab === 'open' ? 'ไม่มี Milestone ที่เปิดให้โหวตในขณะนี้' :
                 activeTab === 'closed' ? 'ยังไม่มีโหวตที่ปิดแล้ว' : 'ยังไม่มีการโหวต'}
              </p>
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
};

export default Votes;
