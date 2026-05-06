import { useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { Copy, TrendingUp, Wallet, Eye, Loader2 } from 'lucide-react';
import { useBoosterStore, type BoosterInvestment } from '../../store/useBoosterStore';

// ─── Status Badge ────────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'รอชำระเงิน', color: 'bg-yellow-100 text-yellow-700' },
  verified: { label: 'กำลังระดมทุน', color: 'bg-purple-100 text-purple-700' },
  funding: { label: 'กำลังระดมทุน', color: 'bg-purple-100 text-purple-700' },
  completed: { label: 'รอดำเนินการ', color: 'bg-blue-100 text-blue-700' },
  refunded: { label: 'คืนเงิน', color: 'bg-orange-100 text-orange-700' },
  cancelled: { label: 'ยกเลิก', color: 'bg-red-100 text-red-700' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

// ─── Investment Row ──────────────────────────────────────────────────────────

function InvestmentRow({ inv }: { inv: BoosterInvestment }) {
  const project = inv.project;
  const title = project?.title || '—';
  const coverImage = project?.cover_image
    ?? project?.media?.sort((a, b) => a.sort_order - b.sort_order)[0]?.url
    ?? null;
  const progress = project && project.funding_goal > 0
    ? Math.min(Math.round((project.current_funding / project.funding_goal) * 100), 100)
    : 0;
  const milestoneCount = project?.milestones?.filter(m => m.status === 'completed').length ?? 0;
  const totalMilestones = project?.milestones?.length ?? 0;
  const dateStr = new Date(inv.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Project Image */}
      <div className="w-full sm:w-[100px] h-[70px] sm:h-[70px] flex-shrink-0 rounded-xl overflow-hidden bg-muted border border-border">
        {coverImage ? (
          <img src={coverImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            ไม่มีรูป
          </div>
        )}
      </div>

      {/* Left info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
          <h3 className="font-bold text-foreground text-base leading-tight">{title}</h3>
          <StatusBadge status={inv.status} />
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          ลงทุน ฿{inv.amount?.toLocaleString()} · {dateStr}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="bg-muted px-2.5 py-1 rounded-full">ส่วนแบ่งกำไร {inv.profit_share_pct || project?.profit_share_pct || 0}%</span>
          {totalMilestones > 0 && (
            <span className="bg-muted px-2.5 py-1 rounded-full">Milestone: {milestoneCount}/{totalMilestones}</span>
          )}
          {progress > 0 && (
            <span className="bg-muted px-2.5 py-1 rounded-full">ความคืบหน้า {progress}%</span>
          )}
        </div>
      </div>

      {/* Right buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {inv.status === 'refunded' && (
          <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer">
            ขอคืนเงิน
          </button>
        )}
        <Link
          to={`/projects/${inv.project_id}`}
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

// ─── Page ────────────────────────────────────────────────────────────────────

const MyInvestments = () => {
  const { investments, isLoading, fetchMyInvestments } = useBoosterStore();

  useEffect(() => {
    fetchMyInvestments();
  }, [fetchMyInvestments]);

  const stats = useMemo(() => {
    const valid = investments.filter(i => i.status !== 'cancelled');
    return {
      totalAmount: valid.reduce((s, i) => s + (i.amount || 0), 0),
      projectCount: new Set(valid.map(i => i.project_id)).size,
      totalProfit: 0,
    };
  }, [investments]);

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">ลงทุนรวม</span>
            <Copy size={16} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground">฿{stats.totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">โปรเจคที่ลงทุน</span>
            <TrendingUp size={16} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.projectCount}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">กำไรที่ได้รับ</span>
            <Wallet size={16} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-primary">฿{stats.totalProfit.toLocaleString()}</p>
        </div>
      </div>

      {/* Investment List */}
      <div className="space-y-4">
        {investments.length > 0 ? (
          investments.map(inv => <InvestmentRow key={inv.id} inv={inv} />)
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">ยังไม่มีการลงทุน</p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              สำรวจโปรเจกต์เพื่อลงทุน
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInvestments;
