import { CheckCircle2, XCircle, CheckSquare } from 'lucide-react';
import { Link } from 'react-router';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const openVotes = [
  {
    id: 1,
    projectTitle: 'UniTrack',
    phaseLabel: 'Phase 2: เปิดตัว Beta',
    deadline: '22 ก.พ. 2026',
    status: 'pending', // ยังไม่โหวต
    stats: { approve: 28, reject: 5, total: 48 },
  },
  {
    id: 2,
    projectTitle: 'GreenRoute',
    phaseLabel: 'Phase 2: เปิดตัว Beta',
    deadline: '1 มี.ค. 2026',
    status: 'voted', // โหวตแล้ว
    stats: { approve: 100, reject: 10, total: 156 },
  },
];

const closedVotes = [
  {
    id: 3,
    projectTitle: 'UniTrack',
    phaseLabel: 'Phase 1: ต้นแบบ',
    result: 'approved', // อนุมัติ
    stats: { approve: 40, reject: 3 },
  },
];

// ─── Components ─────────────────────────────────────────────────────────────

const Votes = () => {
  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">การโหวต</h1>
        <p className="text-sm text-muted-foreground mt-1">โหวตอนุมัติหรือปฏิเสธ Milestone ของโปรเจกต์ที่คุณลงทุน</p>
      </div>

      {/* 1. Open for Voting */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-primary/10 p-1 rounded">
            <CheckSquare size={18} className="text-primary" />
          </div>
          <h2 className="text-lg font-bold text-foreground">เปิดโหวต</h2>
        </div>

        <div className="space-y-4">
          {openVotes.map((vote) => (
            <div key={vote.id} className="bg-white border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-foreground text-base">{vote.projectTitle}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${vote.status === 'pending' ? 'bg-primary/5 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'}`}>
                    {vote.status === 'pending' ? 'ยังไม่โหวต' : 'โหวตแล้ว'}
                  </span>
                </div>
                <p className="text-sm text-foreground mb-2">{vote.phaseLabel}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5">
                    ภายใน {vote.deadline}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-green-600"><CheckCircle2 size={14} className="fill-green-100" /> {vote.stats.approve}</span>
                    <span className="flex items-center gap-1 text-red-500"><XCircle size={14} className="fill-red-100" /> {vote.stats.reject}</span>
                    <span className="text-muted-foreground">จาก {vote.stats.total} คน</span>
                  </span>
                </div>
              </div>
              <Link
                to={`/booster/votes/${vote.id}`}
                className={`flex-shrink-0 px-6 py-2.5 rounded-xl text-sm font-semibold transition-opacity ${vote.status === 'pending' ? 'bg-primary text-white hover:opacity-90' : 'bg-muted text-foreground border border-border hover:bg-muted/80'}`}
              >
                {vote.status === 'pending' ? 'โหวตเลย' : 'ดูผล'}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Closed Voting */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">โหวตที่ปิดแล้ว</h2>

        <div className="space-y-4">
          {closedVotes.map((vote) => (
            <div key={vote.id} className="bg-white border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-foreground text-base mb-1">{vote.projectTitle} — {vote.phaseLabel}</h3>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <span className="text-muted-foreground flex items-center gap-3">
                    ผลโหวต:
                    <span className="flex items-center gap-1 text-green-600"><CheckCircle2 size={14} className="fill-green-100" /> {vote.stats.approve}</span>
                    <span className="flex items-center gap-1 text-red-500"><XCircle size={14} className="fill-red-100" /> {vote.stats.reject}</span>
                  </span>
                  <span className="text-muted-foreground">—</span>
                  <span className="text-primary font-bold">อนุมัติ</span>
                </div>
              </div>
              <button disabled className="flex-shrink-0 px-6 py-2 rounded-xl text-sm font-semibold bg-transparent text-muted-foreground border border-border opacity-70 cursor-not-allowed">
                ปิดแล้ว
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Votes;
