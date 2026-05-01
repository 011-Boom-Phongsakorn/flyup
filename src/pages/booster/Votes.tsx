import { useEffect, useState } from 'react';
import { CheckSquare, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { useBoosterStore } from '../../store/useBoosterStore';
import api from '../../services/api';

// ─── Types ──────────────────────────────────────────────────────────────────

interface VoteMilestone {
  id: number;
  project_id: number;
  projectTitle: string;
  phase_no: number;
  title: string;
  voting_open: boolean;
  voting_opened_at: string | null;
  voting_closed_at: string | null;
  status: string;
  percent_release: number;
}

// ─── Component ──────────────────────────────────────────────────────────────

const Votes = () => {
  const { investments, fetchMyInvestments, isLoading: investLoading } = useBoosterStore();
  const [milestones, setMilestones] = useState<VoteMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Load investments
  useEffect(() => {
    fetchMyInvestments();
  }, [fetchMyInvestments]);

  // 2. Once investments are loaded, fetch milestones for each project
  useEffect(() => {
    if (investLoading) return;
    if (investments.length === 0) {
      setMilestones([]);
      setLoading(false);
      return;
    }

    const projectIds = [...new Set(investments.map(inv => inv.project_id).filter(Boolean))];

    const fetchAllMilestones = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          projectIds.map(async (pid) => {
            try {
              const res = await api.get(`/projects/${pid}/milestones`);
              const raw: VoteMilestone[] = (res.data?.data ?? []).map((m: any) => ({
                ...m,
                project_id: pid,
                projectTitle: investments.find(inv => inv.project_id === pid)?.project?.title || `โปรเจกต์ #${pid}`,
              }));
              return raw;
            } catch {
              return [] as VoteMilestone[];
            }
          })
        );
        setMilestones(results.flat());
      } finally {
        setLoading(false);
      }
    };

    fetchAllMilestones();
  }, [investments, investLoading]);

  // Split into open / closed
  const openVotes = milestones.filter(m => m.voting_open === true);
  const closedVotes = milestones.filter(m => m.voting_open === false && m.voting_closed_at);

  const fmtDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

  const isPageLoading = loading || investLoading;

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">การโหวต</h1>
        <p className="text-sm text-muted-foreground mt-1">โหวตอนุมัติหรือปฏิเสธ Milestone ของโปรเจกต์ที่คุณลงทุน</p>
      </div>

      {isPageLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={28} className="animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* 1. Open for Voting */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary/10 p-1 rounded">
                <CheckSquare size={18} className="text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">เปิดโหวต</h2>
            </div>

            {openVotes.length > 0 ? (
              <div className="space-y-4">
                {openVotes.map((vote) => (
                  <div key={vote.id} className="bg-white border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-foreground text-base">{vote.projectTitle}</h3>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-primary/5 text-primary border-primary/20">
                          เปิดโหวต
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-2">Phase {vote.phase_no}: {vote.title}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                        {vote.voting_opened_at && (
                          <span className="flex items-center gap-1.5">
                            เปิดโหวตเมื่อ {fmtDate(vote.voting_opened_at)}
                          </span>
                        )}
                        <span className="text-muted-foreground">
                          ปล่อยเงิน {vote.percent_release}%
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/booster/votes/${vote.id}`}
                      className="flex-shrink-0 px-6 py-2.5 rounded-xl text-sm font-semibold transition-opacity bg-primary text-white hover:opacity-90"
                    >
                      โหวตเลย
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8 bg-white border border-border rounded-xl">
                ไม่มี Milestone ที่เปิดให้โหวตในขณะนี้
              </p>
            )}
          </div>

          {/* 2. Closed Voting */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">โหวตที่ปิดแล้ว</h2>

            {closedVotes.length > 0 ? (
              <div className="space-y-4">
                {closedVotes.map((vote) => (
                  <div key={vote.id} className="bg-white border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-foreground text-base mb-1">
                        {vote.projectTitle} — Phase {vote.phase_no}: {vote.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm font-medium">
                        <span className="text-muted-foreground flex items-center gap-3">
                          ผลโหวต:
                          <span className={`font-bold ${vote.status === 'completed' || vote.status === 'approved' ? 'text-green-600' : 'text-red-500'}`}>
                            {vote.status === 'completed' || vote.status === 'approved' ? 'อนุมัติ' : vote.status === 'rejected' ? 'ไม่อนุมัติ' : vote.status}
                          </span>
                        </span>
                        {vote.voting_closed_at && (
                          <span className="text-muted-foreground text-xs">
                            ปิดเมื่อ {fmtDate(vote.voting_closed_at)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button disabled className="flex-shrink-0 px-6 py-2 rounded-xl text-sm font-semibold bg-transparent text-muted-foreground border border-border opacity-70 cursor-not-allowed">
                      ปิดแล้ว
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8 bg-white border border-border rounded-xl">
                ยังไม่มีโหวตที่ปิดแล้ว
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Votes;
