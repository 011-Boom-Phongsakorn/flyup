import { CheckCircle2, Clock, Lock } from 'lucide-react'
import type { PioneerProfitItem } from '../../../store/usePioneerProfitStore'

interface Props {
  q: number
  pool?: PioneerProfitItem
  prevSubmitted: boolean
}

export default function QuarterSlot({ q, pool, prevSubmitted }: Props) {
  if (pool) {
    const isDone = pool.status === 'completed'
    return (
      <div className={`flex flex-col items-center justify-center p-3 rounded-xl border gap-1 ${isDone ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
        <span className={`text-[11px] font-bold ${isDone ? 'text-green-700' : 'text-amber-700'}`}>Q{q}</span>
        <span className={`text-[13px] font-bold ${isDone ? 'text-green-700' : 'text-amber-700'}`}>
          {pool.total_amount.toLocaleString('th-TH', { minimumFractionDigits: 0 })}
        </span>
        {isDone ? <CheckCircle2 size={13} className="text-green-600" /> : <Clock size={13} className="text-amber-600" />}
      </div>
    )
  }

  if (!prevSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 bg-gray-50 gap-1 opacity-50">
        <Lock size={12} className="text-gray-400" />
        <span className="text-[11px] font-bold text-gray-400">Q{q}</span>
        <span className="text-[10px] text-gray-400">ล็อกอยู่</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-border bg-gray-50 gap-1">
      <span className="text-[11px] font-bold text-muted-foreground">Q{q}</span>
      <span className="text-[10px] text-muted-foreground">ยังไม่ได้แจ้ง</span>
    </div>
  )
}
