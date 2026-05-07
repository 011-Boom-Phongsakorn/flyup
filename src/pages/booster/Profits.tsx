import { TrendingUp, LayoutGrid } from 'lucide-react';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const profitHistory = [
  {
    id: 1,
    projectTitle: 'GreenRoute',
    description: 'กำไรระยะที่ 1',
    date: '10 ก.พ. 2026',
    amount: 300
  },
  {
    id: 2,
    projectTitle: 'GreenRoute',
    description: 'กำไรเสริมพิเศษ',
    date: '25 ม.ค. 2026',
    amount: 150
  }
];

// ─── Component ──────────────────────────────────────────────────────────────

const Profits = () => {
  const totalProfit = profitHistory.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">ประวัติกำไร</h1>
        <p className="text-sm text-muted-foreground mt-1">ส่วนแบ่งกำไรที่ได้รับจากโปรเจกต์ที่คุณลงทุน</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp size={24} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold mb-1">กำไรรวมทั้งหมด</p>
            <p className="text-2xl font-bold text-foreground">฿{totalProfit.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
            <LayoutGrid size={24} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold mb-1">รายการทั้งหมด</p>
            <p className="text-2xl font-bold text-foreground">{profitHistory.length} รายการ</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-border rounded-2xl p-6">
        <h2 className="text-sm font-bold text-foreground mb-4">รายการกำไร</h2>
        <div className="space-y-3">
          {profitHistory.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-xl">
              <div>
                <h3 className="font-bold text-foreground text-sm">{item.projectTitle}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description} · {item.date}</p>
              </div>
              <div className="text-primary font-bold text-sm">
                +฿{item.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profits;
