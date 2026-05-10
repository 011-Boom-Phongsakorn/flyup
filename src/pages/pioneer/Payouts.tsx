import { useEffect, useMemo } from 'react'
import { Banknote, Clock, CheckCircle2, Lock, Loader2, Building2 } from 'lucide-react'
import { usePioneerPayoutStore, type PioneerPayoutItem } from '../../store/usePioneerPayoutStore'

// ── helpers ──────────────────────────────────────────────────────────────────

function fmtBaht(v: number) {
  return `฿${v.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function fmtDate(dateStr: string) {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
}

// ── phase payout row ─────────────────────────────────────────────────────────

function PayoutRow({ item }: { item: PioneerPayoutItem }) {
  const isConfirmed = item.status === 'confirmed'
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-gray-50 transition-colors">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm
        ${isConfirmed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
        {item.phase_no}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">Phase {item.phase_no}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs text-muted-foreground">{item.percent_release}% ของทุนระดม</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{fmtDate(item.created_at)}</span>
          {item.transfer_ref && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground font-mono">{item.transfer_ref}</span>
            </>
          )}
        </div>
        {item.admin_note && (
          <p className="text-xs text-muted-foreground mt-1 italic">{item.admin_note}</p>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-sm font-bold text-foreground">{fmtBaht(item.amount)}</span>
        {isConfirmed ? (
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
            <CheckCircle2 size={11} />
            โอนแล้ว {item.confirmed_at ? fmtDate(item.confirmed_at) : ''}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600">
            <Clock size={11} />
            รอดำเนินการ
          </span>
        )}
      </div>
    </div>
  )
}

// ── project group card ────────────────────────────────────────────────────────

function ProjectPayoutCard({ title, items }: { title: string; items: PioneerPayoutItem[] }) {
  const allComplete = items[0]?.all_phases_complete ?? false
  const totalConfirmed = items
    .filter(i => i.status === 'confirmed')
    .reduce((s, i) => s + i.amount, 0)
  const totalPending = items
    .filter(i => i.status === 'pending')
    .reduce((s, i) => s + i.amount, 0)

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* project header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 size={16} className="text-primary" />
          </div>
          <div>
            <p className="font-bold text-[15px] text-foreground leading-tight">{title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{items.length} Milestone</p>
          </div>
        </div>
        {allComplete ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <CheckCircle2 size={12} />
            ครบ 4 Phase
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            <Clock size={12} />
            กำลังดำเนินการ
          </span>
        )}
      </div>

      {/* payout rows */}
      <div className="px-5 py-4 flex flex-col gap-3">
        {items.map(item => (
          <PayoutRow key={item.id} item={item} />
        ))}
      </div>

      {/* project total */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-border text-sm">
        <span className="text-muted-foreground">ยอดโอนแล้ว</span>
        <span className="font-bold text-emerald-600">{fmtBaht(totalConfirmed)}</span>
      </div>
      {totalPending > 0 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-border text-sm">
          <span className="text-muted-foreground">รอดำเนินการ</span>
          <span className="font-bold text-amber-600">{fmtBaht(totalPending)}</span>
        </div>
      )}
    </div>
  )
}

// ── main page ─────────────────────────────────────────────────────────────────

const Payouts = () => {
  const { payouts, isLoading, fetchPayouts } = usePioneerPayoutStore()

  useEffect(() => {
    fetchPayouts()
  }, [fetchPayouts])

  const grouped = useMemo(() => {
    const map = new Map<number, { title: string; items: PioneerPayoutItem[] }>()
    for (const p of payouts) {
      if (!map.has(p.project_id)) {
        map.set(p.project_id, { title: p.project_title, items: [] })
      }
      map.get(p.project_id)!.items.push(p)
    }
    return [...map.values()]
  }, [payouts])

  const totalConfirmed = payouts
    .filter(p => p.status === 'confirmed')
    .reduce((s, p) => s + p.amount, 0)
  const totalPending = payouts
    .filter(p => p.status === 'pending')
    .reduce((s, p) => s + p.amount, 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h1 className="text-[22px] font-bold text-foreground">การจ่ายเงิน</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          ยอดเงินที่ได้รับจากแต่ละ Milestone — ครบ 4 Phase ถึงจะได้รับเงินทั้งหมด
        </p>
      </div>

      {/* summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
            <Banknote size={22} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold mb-0.5">โอนแล้วทั้งหมด</p>
            <p className="text-2xl font-bold text-foreground">{fmtBaht(totalConfirmed)}</p>
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <Clock size={22} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold mb-0.5">รอดำเนินการ</p>
            <p className="text-2xl font-bold text-foreground">{fmtBaht(totalPending)}</p>
          </div>
        </div>
      </div>

      {/* lock notice if no completed project yet */}
      {payouts.length > 0 && !payouts.some(p => p.all_phases_complete) && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-700">
          <Lock size={16} className="shrink-0 mt-0.5" />
          <span>เมื่อโปรเจกต์ผ่านครบ 4 Phase ทีม Admin จะดำเนินการโอนยอดที่เหลือทั้งหมดให้</span>
        </div>
      )}

      {/* project groups */}
      {grouped.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 flex flex-col items-center gap-3 text-center shadow-sm">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
            <Banknote size={24} className="text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground">ยังไม่มีรายการ</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            รายการจ่ายเงินจะปรากฏเมื่อ Milestone ผ่านการโหวตจากนักลงทุน
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {grouped.map(({ title, items }) => (
            <ProjectPayoutCard key={items[0].project_id} title={title} items={items} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Payouts
