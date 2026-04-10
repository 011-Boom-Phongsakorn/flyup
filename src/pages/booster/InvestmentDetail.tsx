import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Download, Eye, Loader2 } from 'lucide-react';
import { useBoosterStore } from '../../store/useBoosterStore';

// ─── Status Badge ────────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'รอชำระเงิน', color: 'bg-yellow-100 text-yellow-700' },
  verified: { label: 'กำลังดำเนินการ', color: 'bg-purple-100 text-purple-700' },
  funding: { label: 'กำลังดำเนินการ', color: 'bg-purple-100 text-purple-700' },
  completed: { label: 'เสร็จสิ้น', color: 'bg-green-100 text-green-700' },
  refunded: { label: 'คืนเงิน', color: 'bg-orange-100 text-orange-700' },
  cancelled: { label: 'ยกเลิก', color: 'bg-red-100 text-red-700' },
};

// ─── Milestone Phase Colors ──────────────────────────────────────────────────

const phaseColors = ['bg-primary', 'bg-red-500', 'bg-gray-300', 'bg-gray-300'];

// ─── Page ────────────────────────────────────────────────────────────────────

const InvestmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentInvestment, isDetailLoading, fetchInvestmentById } = useBoosterStore();

  useEffect(() => {
    if (id) fetchInvestmentById(Number(id));
  }, [id, fetchInvestmentById]);

  if (isDetailLoading || !currentInvestment) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  const inv = currentInvestment;
  const project = inv.project;
  const title = project?.title || `โปรเจกต์ #${inv.project_id}`;
  const milestones = project?.milestones?.sort((a, b) => a.phase_no - b.phase_no) || [];
  const statusCfg = statusConfig[inv.status] || { label: inv.status, color: 'bg-gray-100 text-gray-600' };
  const dateStr = new Date(inv.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  const totalProfit = 0;

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate('/booster/investments')}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft size={16} /> กลับ
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-6">รายละเอียดการลงทุน</h1>

      <div className="max-w-2xl mx-auto space-y-6">

        {/* Investment Info */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground text-lg mb-5">ข้อมูลการลงทุน</h3>

          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">เลขอ้างอิง</span>
              <span className="font-semibold text-foreground">INV-{inv.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">โปรเจกต์</span>
              <span className="font-semibold text-foreground">{title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">วันที่ลงทุน</span>
              <span className="font-semibold text-foreground">{dateStr}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">ยอดลงทุน</span>
              <span className="font-semibold text-foreground">฿{inv.amount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">ค่าแพลตฟอร์ม</span>
              <span className="font-semibold text-foreground">฿{inv.platform_fee?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">VAT</span>
              <span className="font-semibold text-foreground">฿{inv.vat?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="border-t border-border pt-3.5 mt-2 space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">ยอดชำระรวม</span>
                <span className="font-bold text-foreground">฿{(inv.net_amount || inv.amount)?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">ส่วนแบ่งกำไร</span>
                <span className="font-bold text-foreground">{inv.profit_share_pct || project?.profit_share_pct || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">สถานะ</span>
                <span className={`text-xs font-semibold px-4 py-1.5 rounded-full ${statusCfg.color}`}>
                  {statusCfg.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Progress */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground text-lg mb-5">ความคืบหน้า Milestone</h3>
          {milestones.length > 0 ? (
            <div className="space-y-4">
              {milestones.map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${m.status === 'completed' ? phaseColors[0] : (m.status === 'in_progress' ? phaseColors[1] : phaseColors[2])}`} />
                  <span className="text-sm text-foreground flex-1">Phase {m.phase_no}: {m.title}</span>
                  <span className="text-sm font-semibold text-foreground">฿{((inv.amount || 0) * m.percent_release / 100).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">ยังไม่มี Milestone</p>
          )}
        </div>

        {/* Profit */}
        <div className="bg-card border border-border rounded-2xl p-6 text-center">
          <h3 className="font-bold text-foreground text-lg mb-4 text-left">กำไรที่ได้รับ</h3>
          <p className="text-4xl font-black text-primary mb-2">฿{totalProfit}</p>
          <p className="text-sm text-muted-foreground">ยังไม่มีกำไรราย — รอโปรเจกต์สร้างรายได้</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors">
            <Download size={16} /> ดาวน์โหลดสัญญา
          </button>
          <Link
            to={`/projects/${inv.project_id}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <Eye size={16} /> ดูโปรเจกต์
          </Link>
        </div>

      </div>
    </div>
  );
};

export default InvestmentDetail;
