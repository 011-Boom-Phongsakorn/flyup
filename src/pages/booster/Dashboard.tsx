import { useEffect } from 'react';
import { Link } from 'react-router';
import { Copy, TrendingUp, Wallet, ChevronRight, Loader2 } from 'lucide-react';
import { useBoosterStore } from '../../store/useBoosterStore';

const BoosterDashboard = () => {
  const { investments, isLoading, fetchMyInvestments } = useBoosterStore();

  useEffect(() => {
    fetchMyInvestments();
  }, [fetchMyInvestments]);

  const totalInvested = investments
    .filter(inv => inv.status !== 'cancelled')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  const projectCount = new Set(
    investments.filter(inv => inv.status !== 'cancelled').map(inv => inv.project_id)
  ).size;

  const totalProfit = 0; // TODO: from API when profit endpoint available

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">แดชบอร์ด</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link to="/booster/investments" className="bg-card border border-border rounded-2xl p-5 block hover:border-primary/50 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">ยอดลงทุนรวม</span>
            <Copy size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-2xl font-bold text-foreground">฿{totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </Link>

        <Link to="/booster/investments" className="bg-card border border-border rounded-2xl p-5 block hover:border-primary/50 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">โปรเจกต์ที่ลงทุน</span>
            <TrendingUp size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-2xl font-bold text-foreground">{projectCount}</p>
        </Link>

        <Link to="/booster/profits" className="bg-card border border-border rounded-2xl p-5 block hover:border-primary/50 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">กำไรที่ได้รับ</span>
            <Wallet size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-2xl font-bold text-foreground">฿{totalProfit}</p>
        </Link>
      </div>

      {/* Explore Button */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 px-6 py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
      >
        สำรวจโปรเจกต์ <ChevronRight size={16} />
      </Link>
    </div>
  );
};

export default BoosterDashboard;
