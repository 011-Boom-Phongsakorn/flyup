import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Copy, TrendingUp, Wallet, Eye, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBoosterStore, type BoosterInvestment } from '../../store/useBoosterStore';

// ─── Constants ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 5;

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:        { label: 'รอชำระเงิน',    color: 'bg-yellow-100 text-yellow-700' },
  verified:       { label: 'กำลังระดมทุน',  color: 'bg-purple-100 text-purple-700' },
  funding:        { label: 'กำลังระดมทุน',  color: 'bg-purple-100 text-purple-700' },
  completed:      { label: 'รอดำเนินการ',   color: 'bg-blue-100 text-blue-700' },
  paid:           { label: 'ดำเนินการแล้ว', color: 'bg-green-100 text-green-700' },
  refund_pending: { label: 'รอคืนเงิน',     color: 'bg-orange-100 text-orange-700' },
  refunded:       { label: 'คืนเงินแล้ว',   color: 'bg-orange-100 text-orange-700' },
  cancelled:      { label: 'ยกเลิก',        color: 'bg-red-100 text-red-700' },
};

const TABS: { key: string; label: string }[] = [
  { key: 'all',           label: 'ทั้งหมด' },
  { key: 'pending',       label: 'รอชำระเงิน' },
  { key: 'funding',       label: 'กำลังระดมทุน' },
  { key: 'paid',          label: 'ดำเนินการแล้ว' },
  { key: 'refund_pending',label: 'รอคืนเงิน' },
  { key: 'refunded',      label: 'คืนเงินแล้ว' },
  { key: 'cancelled',     label: 'ยกเลิก' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? { label: status, color: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function InvestmentRow({ inv }: { inv: BoosterInvestment }) {
  const project = inv.project;
  const title = project?.title || '—';
  const coverImage =
    project?.cover_image ??
    project?.media?.sort((a, b) => a.sort_order - b.sort_order)[0]?.url ??
    null;
  const progress =
    project && project.funding_goal > 0
      ? Math.min(Math.round((project.current_funding / project.funding_goal) * 100), 100)
      : 0;
  const milestoneCount = project?.milestones?.filter(m => m.status === 'completed').length ?? 0;
  const totalMilestones = project?.milestones?.length ?? 0;
  const dateStr = new Date(inv.created_at).toLocaleDateString('th-TH', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="w-full sm:w-25 h-17.5 shrink-0 rounded-xl overflow-hidden bg-muted border border-border">
        {coverImage ? (
          <img src={coverImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">ไม่มีรูป</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
          <h3 className="font-bold text-foreground text-base leading-tight">{title}</h3>
          <StatusBadge status={inv.status} />
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          ลงทุน ฿{inv.amount?.toLocaleString()} · {dateStr}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="bg-muted px-2.5 py-1 rounded-full">
            ส่วนแบ่งกำไร {inv.profit_share_pct || project?.profit_share_pct || 0}%
          </span>
          {totalMilestones > 0 && (
            <span className="bg-muted px-2.5 py-1 rounded-full">Milestone: {milestoneCount}/{totalMilestones}</span>
          )}
          {progress > 0 && (
            <span className="bg-muted px-2.5 py-1 rounded-full">ความคืบหน้า {progress}%</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          to={`/projects/${inv.project?.slug || inv.project_id}`}
          className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Eye size={14} /> ดูโปรเจกต์
        </Link>
        <Link
          to={`/booster/investments/${inv.id}`}
          className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          รายละเอียด
        </Link>
      </div>
    </div>
  );
}

function Pagination({
  page, totalPages, onChange,
}: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            p === page
              ? 'bg-primary text-white'
              : 'border border-border hover:bg-muted text-foreground'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

const MyInvestments = () => {
  const { investments, isLoading, fetchMyInvestments } = useBoosterStore();
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => { fetchMyInvestments(); }, [fetchMyInvestments]);

  const stats = useMemo(() => {
    const valid = investments.filter(i => i.status !== 'cancelled');
    return {
      totalAmount: valid.reduce((s, i) => s + (i.amount || 0), 0),
      projectCount: new Set(valid.map(i => i.project_id)).size,
    };
  }, [investments]);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return investments;
    // group verified+funding under the 'funding' tab
    if (activeTab === 'funding') return investments.filter(i => i.status === 'funding' || i.status === 'verified');
    return investments.filter(i => i.status === activeTab);
  }, [investments, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleTabChange = (key: string) => { setActiveTab(key); setPage(1); };

  // hide tabs with 0 items (except 'all')
  const visibleTabs = TABS.filter(t => {
    if (t.key === 'all') return true;
    if (t.key === 'funding') return investments.some(i => i.status === 'funding' || i.status === 'verified');
    return investments.some(i => i.status === t.key);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">การลงทุนของฉัน</h1>
        <p className="text-sm text-muted-foreground mt-1">ติดตามโปรเจกต์ที่คุณสนับสนุน</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">ลงทุนรวม</span>
            <Copy size={16} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground">฿{stats.totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">โปรเจกต์ที่ลงทุน</span>
            <TrendingUp size={16} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.projectCount}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        {visibleTabs.map(t => {
          const count = t.key === 'all'
            ? investments.length
            : t.key === 'funding'
              ? investments.filter(i => i.status === 'funding' || i.status === 'verified').length
              : investments.filter(i => i.status === t.key).length;
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
      <div className="space-y-4">
        {paginated.length > 0 ? (
          paginated.map(inv => <InvestmentRow key={inv.id} inv={inv} />)
        ) : (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <Wallet size={32} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">ไม่มีการลงทุนในสถานะนี้</p>
            {activeTab === 'all' && (
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                สำรวจโปรเจกต์เพื่อลงทุน
              </Link>
            )}
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
};

export default MyInvestments;
