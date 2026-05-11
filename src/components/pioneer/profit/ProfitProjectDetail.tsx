import { ChevronLeft, Building2 } from 'lucide-react'
import type { PioneerProfitItem } from '../../../store/usePioneerProfitStore'
import QuarterSlot from './QuarterSlot'
import { fmtBaht, fmtDate } from './profitUtils'

interface Props {
  title: string
  pools: PioneerProfitItem[]
  onBack: () => void
}

export default function ProfitProjectDetail({ title, pools, onBack }: Props) {
  const totalSent  = pools.reduce((s, p) => s + p.total_amount, 0)
  const doneCount  = pools.filter(p => p.status === 'completed').length
  const poolByQ    = pools.reduce<Record<number, PioneerProfitItem>>((acc, p) => { acc[p.quarter_no] = p; return acc }, {})
  const submittedQs = pools.map(p => p.quarter_no)

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer w-fit"
      >
        <ChevronLeft size={16} /> กลับ
      </button>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 size={16} className="text-primary" />
          </div>
          <div>
            <p className="font-bold text-[17px] text-foreground leading-tight">{title}</p>
            <p className="text-xs text-muted-foreground">{pools.length}/4 ไตรมาส · {doneCount} เสร็จแล้ว</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[15px] font-bold text-primary">{fmtBaht(totalSent)}</p>
          <p className="text-[11px] text-muted-foreground">ยอดโอนทั้งหมด</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-5">
        <p className="text-[13px] font-semibold text-foreground mb-3">สถานะแต่ละไตรมาส</p>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(q => (
            <QuarterSlot key={q} q={q} pool={poolByQ[q]} prevSubmitted={q === 1 || submittedQs.includes(q - 1)} />
          ))}
        </div>
      </div>

      {pools.length > 0 && (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-[13px] font-semibold text-foreground">ประวัติการแจ้งโอน</p>
          </div>
          <div className="divide-y divide-border">
            {[...pools].sort((a, b) => a.quarter_no - b.quarter_no).map(p => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3 text-[13px]">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-muted-foreground w-6">Q{p.quarter_no}</span>
                  <span className="font-mono text-muted-foreground text-xs truncate max-w-[120px]">{p.transfer_ref}</span>
                  <span className="text-muted-foreground text-xs">{fmtDate(p.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-medium">{fmtBaht(p.total_amount)}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    p.status === 'completed'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {p.confirmed_count}/{p.investor_count} คน
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
