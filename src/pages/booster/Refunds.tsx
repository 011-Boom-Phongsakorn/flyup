import { CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const refundsHistory = [
  {
    id: 1,
    projectTitle: 'StudyBuddy',
    description: '18 ก.พ. 2026 เวลา 14:00 — ออนไลน์',
    amount: 500,
    status: 'completed', // คืนแล้ว
  },
  {
    id: 2,
    projectTitle: 'LabConnect',
    description: 'โปรเจกต์ถูกยกเลิก\n12 ก.พ. 2026',
    amount: 1000,
    status: 'processing', // กำลังดำเนินการ
  }
];

// ─── Component ──────────────────────────────────────────────────────────────

const Refunds = () => {
  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">การคืนเงิน</h1>
        <p className="text-sm text-muted-foreground mt-1">รายการคืนเงินจากโปรเจกต์ที่ Milestone ไม่ผ่านหรือถูกยกเลิก</p>
      </div>

      {/* List */}
      <div className="space-y-4">
        {refundsHistory.map((item) => (
          <div key={item.id} className="bg-white border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${item.status === 'completed' ? 'bg-primary/10 text-primary' : 'bg-red-50 text-red-500'}`}>
                {item.status === 'completed' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm">{item.projectTitle}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 whitespace-pre-line leading-relaxed">{item.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm font-bold text-primary mb-1">
                  ฿{item.amount.toLocaleString()}
                </div>
                <div className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-flex ${item.status === 'completed' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                  {item.status === 'completed' ? 'คืนแล้ว' : 'กำลังดำเนินการ'}
                </div>
              </div>
              <button className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group">
                รายละเอียด <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Refunds;
