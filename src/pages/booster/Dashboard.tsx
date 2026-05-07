import { useEffect, useMemo } from 'react'
import { Link } from 'react-router'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp, Wallet, FolderOpen, ChevronRight, Loader2, ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useBoosterStore } from '../../store/useBoosterStore'

const MONTHS_TH = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']

const STATUS_LABEL: Record<string, string> = {
  verified: 'ยืนยันแล้ว',
  pending_payment: 'รอชำระ',
  refund_pending: 'รอคืนเงิน',
  refunded: 'คืนเงินแล้ว',
  rejected: 'ปฏิเสธ',
}

const PIE_COLORS = ['#7c3aed','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6']

function fmtBaht(v: number) {
  return `฿${v.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const BoosterDashboard = () => {
  const { investments, isLoading, fetchMyInvestments } = useBoosterStore()

  useEffect(() => { fetchMyInvestments() }, [fetchMyInvestments])

  const active = investments.filter(inv => inv.status === 'verified')

  const totalInvested = active.reduce((s, inv) => s + (inv.amount ?? 0), 0)
  const projectCount  = new Set(active.map(inv => inv.project_id)).size

  // monthly investment data (last 6 months)
  const monthlyData = useMemo(() => {
    const now = new Date()
    const map: Record<string, number> = {}
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      map[`${d.getFullYear()}-${d.getMonth()}`] = 0
    }
    active.forEach(inv => {
      if (!inv.created_at) return
      const d = new Date(inv.created_at)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      if (key in map) map[key] += inv.amount ?? 0
    })
    return Object.entries(map).map(([key, amount]) => {
      const [, m] = key.split('-').map(Number)
      return { month: MONTHS_TH[m], amount }
    })
  }, [active])

  // portfolio by project
  const portfolioData = useMemo(() => {
    const map: Record<string, number> = {}
    active.forEach(inv => {
      const title = inv.project?.title ?? `Project ${inv.project_id}`
      map[title] = (map[title] ?? 0) + (inv.amount ?? 0)
    })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }))
  }, [active])

  // recent 5 investments
  const recent = useMemo(() =>
    [...investments]
      .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
      .slice(0, 5)
  , [investments])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h1 className="text-[26px] font-bold text-foreground">แดชบอร์ด</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">ภาพรวมการลงทุนของคุณ</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/booster/investments">
          <Card className="py-5 gap-2 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardDescription className="text-[13px]">ยอดลงทุนรวม</CardDescription>
                <FolderOpen size={16} className="text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[26px] font-bold text-foreground">{fmtBaht(totalInvested)}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">เฉพาะที่ยืนยันแล้ว</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/booster/investments">
          <Card className="py-5 gap-2 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardDescription className="text-[13px]">โปรเจกต์ที่ลงทุน</CardDescription>
                <TrendingUp size={16} className="text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[26px] font-bold text-foreground">{projectCount}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">โปรเจกต์ที่ active</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/booster/profits">
          <Card className="py-5 gap-2 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardDescription className="text-[13px]">กำไรที่ได้รับ</CardDescription>
                <Wallet size={16} className="text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[26px] font-bold text-foreground">฿0.00</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">ดูรายละเอียด →</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        {/* Area Chart */}
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle className="text-[15px]">ยอดลงทุนรายเดือน</CardTitle>
            <CardDescription className="text-[12px]">6 เดือนที่ผ่านมา</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyData.every(d => d.amount === 0) ? (
              <div className="flex items-center justify-center h-[200px] text-[13px] text-muted-foreground">
                ยังไม่มีข้อมูลการลงทุน
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="boosterGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `฿${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(v) => [fmtBaht(Number(v ?? 0)), 'ลงทุน']}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#7c3aed" strokeWidth={2} fill="url(#boosterGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-[15px]">สัดส่วนพอร์ต</CardTitle>
            <CardDescription className="text-[12px]">แบ่งตามโปรเจกต์</CardDescription>
          </CardHeader>
          <CardContent>
            {portfolioData.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-[13px] text-muted-foreground">
                ยังไม่มีการลงทุน
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={portfolioData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                      {portfolioData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [fmtBaht(Number(v ?? 0))]}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1.5 mt-1">
                  {portfolioData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-foreground truncate max-w-[120px]">{d.name}</span>
                      </div>
                      <span className="text-muted-foreground">{fmtBaht(d.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Investments + Quick links */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Recent */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[15px]">การลงทุนล่าสุด</CardTitle>
              <CardDescription className="text-[12px] mt-0.5">5 รายการล่าสุด</CardDescription>
            </div>
            <Link to="/booster/investments" className="text-[12px] text-primary hover:underline flex items-center gap-0.5">
              ดูทั้งหมด <ArrowRight size={13} />
            </Link>
          </CardHeader>
          <CardContent className="px-0">
            {recent.length === 0 ? (
              <p className="text-[13px] text-muted-foreground text-center py-6">ยังไม่มีการลงทุน</p>
            ) : (
              <div className="divide-y divide-border">
                {recent.map(inv => (
                  <div key={inv.id} className="flex items-center justify-between px-6 py-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-foreground truncate max-w-[220px]">
                        {inv.project?.title ?? `Project ${inv.project_id}`}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {inv.created_at ? new Date(inv.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-[13px] font-semibold text-primary">{fmtBaht(inv.amount ?? 0)}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        inv.status === 'verified' ? 'bg-green-100 text-green-700' :
                        inv.status === 'refunded' ? 'bg-gray-100 text-gray-600' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {STATUS_LABEL[inv.status] ?? inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[15px]">เมนูด่วน</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {[
              { to: '/projects', label: 'สำรวจโปรเจกต์', desc: 'หาโปรเจกต์ที่น่าลงทุน' },
              { to: '/booster/investments', label: 'การลงทุนของฉัน', desc: 'ดูรายการลงทุนทั้งหมด' },
              { to: '/booster/votes', label: 'โหวต Milestone', desc: 'ออกเสียงอนุมัติ Phase' },
              { to: '/booster/profits', label: 'กำไรของฉัน', desc: 'ติดตามผลตอบแทน' },
              { to: '/booster/meetings', label: 'การประชุม', desc: 'นัดประชุมกับ Pioneer' },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-between p-3 rounded-[10px] hover:bg-muted/40 transition-colors group"
              >
                <div>
                  <p className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                </div>
                <ChevronRight size={15} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BoosterDashboard
