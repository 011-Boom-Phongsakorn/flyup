import { useEffect, useState } from 'react'
import { TrendingUp, LayoutGrid, Loader2, CheckCircle2, Clock } from 'lucide-react'
import api from '../../services/api'

interface ProfitItem {
    id: number
    project_id: number
    project_title: string
    quarter_no: number
    amount: number
    share_pct: number
    status: 'pending' | 'confirmed'
    transfer_ref: string
    confirmed_at?: string
    created_at: string
}

const fmtBaht = (v: number) =>
    `฿${v.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const fmtDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

const Profits = () => {
    const [items, setItems] = useState<ProfitItem[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        api.get('/me/profit-payouts')
            .then(res => setItems(res.data?.data ?? []))
            .catch(() => {})
            .finally(() => setIsLoading(false))
    }, [])

    const totalProfit = items
        .filter(i => i.status === 'confirmed')
        .reduce((s, i) => s + i.amount, 0)

    const grouped = items.reduce<Record<number, { title: string; items: ProfitItem[] }>>((acc, i) => {
        if (!acc[i.project_id]) acc[i.project_id] = { title: i.project_title, items: [] }
        acc[i.project_id].items.push(i)
        return acc
    }, {})

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
                <h1 className="text-[22px] font-bold text-foreground">ประวัติกำไร</h1>
                <p className="text-[13px] text-muted-foreground mt-0.5">ส่วนแบ่งกำไรที่ได้รับจากโปรเจกต์ที่คุณลงทุน</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        <TrendingUp size={22} className="text-primary" />
                    </div>
                    <div>
                        <p className="text-[11px] text-muted-foreground font-semibold mb-0.5">กำไรที่ได้รับแล้ว</p>
                        <p className="text-[22px] font-bold text-foreground">{fmtBaht(totalProfit)}</p>
                    </div>
                </div>
                <div className="bg-white border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center shrink-0">
                        <LayoutGrid size={22} className="text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-[11px] text-muted-foreground font-semibold mb-0.5">รายการทั้งหมด</p>
                        <p className="text-[22px] font-bold text-foreground">{items.length} รายการ</p>
                    </div>
                </div>
            </div>

            {/* Empty state */}
            {items.length === 0 ? (
                <div className="bg-white border border-border rounded-2xl p-12 flex flex-col items-center gap-3 text-center shadow-sm">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                        <TrendingUp size={24} className="text-muted-foreground" />
                    </div>
                    <p className="font-semibold text-foreground">ยังไม่มีประวัติกำไร</p>
                    <p className="text-[13px] text-muted-foreground max-w-xs">
                        กำไรจะปรากฏที่นี่เมื่อ Pioneer ส่งปันผลและ Admin ยืนยันการโอนแล้ว
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-5">
                    {Object.values(grouped).map(({ title, items: groupItems }) => {
                        const confirmed = groupItems.filter(i => i.status === 'confirmed').reduce((s, i) => s + i.amount, 0)
                        return (
                            <div key={groupItems[0].project_id} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                                    <p className="font-bold text-[15px] text-foreground">{title}</p>
                                    <span className="text-[13px] font-bold text-primary">{fmtBaht(confirmed)}</span>
                                </div>
                                <div className="divide-y divide-border">
                                    {groupItems.map(item => (
                                        <div key={item.id} className="flex items-center justify-between px-5 py-3.5">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    {item.quarter_no > 0 && (
                                                        <span className="text-[11px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Q{item.quarter_no}</span>
                                                    )}
                                                    <span className="text-[13px] font-medium text-foreground">
                                                        สัดส่วน {item.share_pct.toFixed(2)}%
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                                    {item.status === 'confirmed'
                                                        ? `โอนแล้ว ${fmtDate(item.confirmed_at)}`
                                                        : `แจ้งเมื่อ ${fmtDate(item.created_at)} · รอ Admin โอน`
                                                    }
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-[15px] text-primary">+{fmtBaht(item.amount)}</span>
                                                {item.status === 'confirmed'
                                                    ? <CheckCircle2 size={15} className="text-green-600" />
                                                    : <Clock size={15} className="text-amber-500" />
                                                }
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Profits
