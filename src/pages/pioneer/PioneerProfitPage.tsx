import { useEffect, useState, useMemo } from 'react'
import { Loader2, TrendingUp, CheckCircle2, Clock, Plus } from 'lucide-react'
import { usePioneerProfitStore, type PioneerProfitItem } from '../../store/usePioneerProfitStore'
import api from '../../services/api'
import BankAccountCard from '../../components/pioneer/profit/BankAccountCard'
import SubmitProfitModal from '../../components/pioneer/profit/SubmitProfitModal'
import ProfitProjectDetail from '../../components/pioneer/profit/ProfitProjectDetail'
import { fmtBaht, fmtDate, type MyProject } from '../../components/pioneer/profit/profitUtils'

const PioneerProfitPage = () => {
    const { pools, isLoading, fetchPools } = usePioneerProfitStore()
    const [showModal, setShowModal]   = useState(false)
    const [myProjects, setMyProjects] = useState<MyProject[]>([])
    const [selectedId, setSelectedId] = useState<number | null>(null)

    useEffect(() => {
        fetchPools()
        api.get('/pioneer/projects')
            .then(async res => {
                const data: { id: number; title: string; state: string }[] = res.data?.data ?? []
                const active = data.filter(p => p.state === 'executing' || p.state === 'closed')
                const withMilestones = await Promise.all(
                    active.map(async p => {
                        try {
                            const msRes = await api.get(`/projects/${p.id}/milestones`)
                            const ms: { status: string }[] = msRes.data?.data ?? []
                            return { ...p, allMilestonesPaid: ms.length >= 4 && ms.every(m => m.status === 'paid') }
                        } catch { return { ...p, allMilestonesPaid: false } }
                    })
                )
                setMyProjects(withMilestones)
            })
            .catch(() => {})
    }, [fetchPools])

    const grouped = useMemo(() => {
        const map = new Map<number, { title: string; items: PioneerProfitItem[] }>()
        for (const p of pools) {
            if (!map.has(p.project_id)) map.set(p.project_id, { title: p.project_title, items: [] })
            map.get(p.project_id)!.items.push(p)
        }
        return [...map.entries()].map(([id, v]) => ({ id, ...v }))
    }, [pools])

    const submittedMap = pools.reduce<Record<number, number[]>>((acc, p) => {
        if (!acc[p.project_id]) acc[p.project_id] = []
        acc[p.project_id].push(p.quarter_no)
        return acc
    }, {})

    const totalSent = pools.reduce((s, p) => s + p.total_amount, 0)
    const selected  = grouped.find(g => g.id === selectedId)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        )
    }

    if (selected) {
        return (
            <ProfitProjectDetail
                title={selected.title}
                pools={selected.items}
                onBack={() => setSelectedId(null)}
            />
        )
    }

    return (
        <div className="flex flex-col gap-6 pb-10">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-[22px] font-bold text-foreground">จ่ายปันผลนักลงทุน</h1>
                    <p className="text-[13px] text-muted-foreground mt-0.5">
                        แจ้งโอนกำไรให้นักลงทุนตามสัดส่วน — ต้องจ่าย Q1 ก่อน จึงจะปลด Q2 และต่อไปได้
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-[13px] font-medium hover:bg-primary/90 shrink-0 cursor-pointer"
                >
                    <Plus size={15} /> แจ้งโอนใหม่
                </button>
            </div>

            <BankAccountCard />

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        <TrendingUp size={22} className="text-primary" />
                    </div>
                    <div>
                        <p className="text-[11px] text-muted-foreground font-semibold mb-0.5">ยอดที่แจ้งโอนทั้งหมด</p>
                        <p className="text-[20px] font-bold text-foreground">{fmtBaht(totalSent)}</p>
                    </div>
                </div>
                <div className="bg-white border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                        <CheckCircle2 size={22} className="text-green-600" />
                    </div>
                    <div>
                        <p className="text-[11px] text-muted-foreground font-semibold mb-0.5">ไตรมาสที่แจ้งแล้ว</p>
                        <p className="text-[20px] font-bold text-foreground">{pools.length} ครั้ง</p>
                    </div>
                </div>
            </div>

            {pools.length === 0 ? (
                <div className="bg-white border border-border rounded-2xl p-12 flex flex-col items-center gap-3 text-center shadow-sm">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                        <TrendingUp size={24} className="text-muted-foreground" />
                    </div>
                    <p className="font-semibold text-foreground">ยังไม่มีรายการปันผล</p>
                    <p className="text-[13px] text-muted-foreground max-w-xs">
                        กดปุ่ม "แจ้งโอนใหม่" เพื่อแจ้งการโอนกำไรไตรมาสแรกให้นักลงทุน
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-[13px]">
                            <thead>
                                <tr className="border-b border-border bg-gray-50/70">
                                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">โปรเจกต์</th>
                                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">ไตรมาส</th>
                                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">ยอดโอนรวม</th>
                                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">แจ้งล่าสุด</th>
                                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">สถานะ</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody>
                                {grouped.map((g, idx) => {
                                    const totalAmt  = g.items.reduce((s, p) => s + p.total_amount, 0)
                                    const doneCount = g.items.filter(p => p.status === 'completed').length
                                    const allDone   = doneCount === g.items.length && g.items.length > 0
                                    const latest    = [...g.items].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
                                    return (
                                        <tr key={g.id} className={`border-b border-border last:border-0 hover:bg-gray-50/50 transition-colors ${idx % 2 !== 0 ? 'bg-gray-50/30' : ''}`}>
                                            <td className="px-4 py-3.5 font-semibold text-foreground">{g.title}</td>
                                            <td className="px-4 py-3.5">
                                                <span className="font-bold text-foreground">{g.items.length}/4</span>
                                            </td>
                                            <td className="px-4 py-3.5 font-semibold text-foreground whitespace-nowrap">{fmtBaht(totalAmt)}</td>
                                            <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">{latest ? fmtDate(latest.created_at) : '—'}</td>
                                            <td className="px-4 py-3.5">
                                                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${
                                                    allDone ? 'bg-green-50 text-green-700 border-green-200'
                                                    : g.items.length === 4 ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                    {allDone ? <><CheckCircle2 size={11} /> ครบทุกไตรมาส</>
                                                    : g.items.length === 4 ? <><Clock size={11} /> รอยืนยัน</>
                                                    : <><Clock size={11} /> ส่งแล้ว {g.items.length}/4 ไตรมาส</>}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <button
                                                    onClick={() => setSelectedId(g.id)}
                                                    className="text-[12px] text-primary hover:text-primary/70 font-medium whitespace-nowrap cursor-pointer transition-colors"
                                                >
                                                    ดูรายละเอียด →
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && (
                <SubmitProfitModal
                    projects={myProjects}
                    submittedMap={submittedMap}
                    onClose={() => setShowModal(false)}
                    onSubmitted={fetchPools}
                />
            )}
        </div>
    )
}

export default PioneerProfitPage
