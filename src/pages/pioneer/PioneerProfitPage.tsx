import { useEffect, useState } from 'react'
import { Loader2, TrendingUp, CheckCircle2, Clock, X, Plus, Building2, SendHorizonal } from 'lucide-react'
import { usePioneerProfitStore, type PioneerProfitItem } from '../../store/usePioneerProfitStore'
import { usePublicProjectStore } from '../../store/usePublicProjectStore'
import api from '../../services/api'

const fmtBaht = (v: number) =>
    `฿${v.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })

interface MyProject { id: number; title: string; state: string }

// ── Submit Modal ──────────────────────────────────────────────────────────────

function SubmitProfitModal({
    projects,
    submittedMap,
    onClose,
    onSubmitted,
}: {
    projects: MyProject[]
    submittedMap: Record<number, number[]>
    onClose: () => void
    onSubmitted: () => void
}) {
    const { isSubmitting, submitProfit } = usePioneerProfitStore()
    const [projectId, setProjectId] = useState<number | ''>(projects[0]?.id ?? '')
    const [quarterNo, setQuarterNo] = useState<number | ''>('' )
    const [amount, setAmount] = useState('')
    const [transferRef, setTransferRef] = useState('')

    const eligibleProjects = projects.filter(p => p.state === 'executing' || p.state === 'closed')
    const submittedQuarters = projectId ? (submittedMap[Number(projectId)] ?? []) : []
    const availableQuarters = [1, 2, 3, 4].filter(q => !submittedQuarters.includes(q))

    const valid = projectId && quarterNo && Number(amount) > 0 && transferRef.trim()

    const handleSubmit = async () => {
        if (!projectId || !quarterNo) return
        const ok = await submitProfit(Number(projectId), Number(quarterNo), Number(amount), transferRef.trim())
        if (ok) { onSubmitted(); onClose() }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-[460px] p-6 shadow-xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-5">
                    <div>
                        <h2 className="text-[16px] font-bold text-foreground">แจ้งโอนกำไรนักลงทุน</h2>
                        <p className="text-[12px] text-muted-foreground mt-0.5">ระบบจะแบ่งตามสัดส่วนทุนอัตโนมัติ</p>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={18} /></button>
                </div>

                {eligibleProjects.length === 0 ? (
                    <p className="text-[13px] text-muted-foreground text-center py-6">ยังไม่มีโปรเจกต์ที่พร้อมจ่ายปันผล</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-[13px] font-medium">โปรเจกต์ <span className="text-red-500">*</span></label>
                            <select
                                value={projectId}
                                onChange={e => { setProjectId(Number(e.target.value)); setQuarterNo('') }}
                                className="border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary cursor-pointer"
                            >
                                {eligibleProjects.map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[13px] font-medium">ไตรมาส <span className="text-red-500">*</span></label>
                            {availableQuarters.length === 0 ? (
                                <p className="text-[13px] text-green-600 font-medium">ส่งครบ 4 ไตรมาสแล้ว</p>
                            ) : (
                                <div className="flex gap-2">
                                    {availableQuarters.map(q => (
                                        <button
                                            key={q}
                                            onClick={() => setQuarterNo(q)}
                                            className={`flex-1 py-2 rounded-lg border text-[13px] font-semibold transition-colors cursor-pointer ${
                                                quarterNo === q
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'border-border text-foreground hover:border-primary hover:text-primary'
                                            }`}
                                        >
                                            Q{q}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[13px] font-medium">ยอดโอน (บาท) <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[13px] font-medium">เลขอ้างอิงการโอน <span className="text-red-500">*</span></label>
                            <input
                                value={transferRef}
                                onChange={e => setTransferRef(e.target.value)}
                                placeholder="เช่น TXN-20260630-001"
                                className="border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                )}

                <div className="flex gap-2 mt-5 justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-[13px] rounded-lg border border-border hover:bg-gray-50 cursor-pointer">ยกเลิก</button>
                    {availableQuarters.length > 0 && (
                        <button
                            onClick={handleSubmit}
                            disabled={!valid || isSubmitting}
                            className="px-4 py-2 text-[13px] rounded-lg bg-primary hover:bg-primary/90 text-white disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                        >
                            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <SendHorizonal size={14} />}
                            แจ้งโอน
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── Quarter Slot ──────────────────────────────────────────────────────────────

function QuarterSlot({ q, pool }: { q: number; pool?: PioneerProfitItem }) {
    if (!pool) {
        return (
            <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-border bg-gray-50 gap-1">
                <span className="text-[11px] font-bold text-muted-foreground">Q{q}</span>
                <span className="text-[10px] text-muted-foreground">ยังไม่ได้แจ้ง</span>
            </div>
        )
    }
    const isDone = pool.status === 'completed'
    return (
        <div className={`flex flex-col items-center justify-center p-3 rounded-xl border gap-1 ${
            isDone ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'
        }`}>
            <span className={`text-[11px] font-bold ${isDone ? 'text-green-700' : 'text-amber-700'}`}>Q{q}</span>
            <span className={`text-[12px] font-semibold ${isDone ? 'text-green-700' : 'text-amber-700'}`}>
                {pool.total_amount.toLocaleString('th-TH', { minimumFractionDigits: 0 })}
            </span>
            {isDone
                ? <CheckCircle2 size={12} className="text-green-600" />
                : <Clock size={12} className="text-amber-600" />
            }
        </div>
    )
}

// ── Project Card ──────────────────────────────────────────────────────────────

function ProjectProfitCard({ title, pools }: { title: string; pools: PioneerProfitItem[] }) {
    const totalSent = pools.reduce((s, p) => s + p.total_amount, 0)
    const doneCount = pools.filter(p => p.status === 'completed').length
    const poolByQ: Record<number, PioneerProfitItem> = {}
    pools.forEach(p => { poolByQ[p.quarter_no] = p })

    return (
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 size={16} className="text-primary" />
                    </div>
                    <div>
                        <p className="font-bold text-[15px] text-foreground">{title}</p>
                        <p className="text-[12px] text-muted-foreground">{pools.length}/4 ไตรมาส</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[13px] font-bold text-primary">{fmtBaht(totalSent)}</p>
                    <p className="text-[11px] text-muted-foreground">โอนแล้ว {doneCount} ครั้ง</p>
                </div>
            </div>

            <div className="px-5 py-4 grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map(q => <QuarterSlot key={q} q={q} pool={poolByQ[q]} />)}
            </div>

            {pools.length > 0 && (
                <div className="px-5 pb-4 flex flex-col gap-2">
                    {pools.map(p => (
                        <div key={p.id} className="flex items-center justify-between text-[12px] py-1.5 px-3 rounded-lg bg-gray-50">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-muted-foreground">Q{p.quarter_no}</span>
                                <span className="font-mono text-muted-foreground">{p.transfer_ref}</span>
                                <span className="text-muted-foreground">{fmtDate(p.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-2">
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
            )}
        </div>
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const PioneerProfitPage = () => {
    const { pools, isLoading, fetchPools } = usePioneerProfitStore()
    const [showModal, setShowModal] = useState(false)
    const [myProjects, setMyProjects] = useState<MyProject[]>([])

    useEffect(() => {
        fetchPools()
        api.get('/pioneer/projects')
            .then(res => {
                const data = res.data?.data ?? []
                setMyProjects(data.map((p: { id: number; title: string; state: string }) => ({
                    id: p.id, title: p.title, state: p.state,
                })))
            })
            .catch(() => {})
    }, [fetchPools])

    const grouped = pools.reduce<Record<number, { title: string; items: PioneerProfitItem[] }>>((acc, p) => {
        if (!acc[p.project_id]) acc[p.project_id] = { title: p.project_title, items: [] }
        acc[p.project_id].items.push(p)
        return acc
    }, {})

    const submittedMap = pools.reduce<Record<number, number[]>>((acc, p) => {
        if (!acc[p.project_id]) acc[p.project_id] = []
        acc[p.project_id].push(p.quarter_no)
        return acc
    }, {})

    const totalSent = pools.reduce((s, p) => s + p.total_amount, 0)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 pb-10 max-w-3xl">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-[22px] font-bold text-foreground">จ่ายปันผลนักลงทุน</h1>
                    <p className="text-[13px] text-muted-foreground mt-0.5">
                        แจ้งโอนกำไรให้นักลงทุนตามสัดส่วน — สูงสุด 4 ไตรมาส ต่อโปรเจกต์
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-[13px] font-medium hover:bg-primary/90 shrink-0 cursor-pointer"
                >
                    <Plus size={15} /> แจ้งโอนใหม่
                </button>
            </div>

            {/* summary */}
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

            {Object.keys(grouped).length === 0 ? (
                <div className="bg-white border border-border rounded-2xl p-12 flex flex-col items-center gap-3 text-center shadow-sm">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                        <TrendingUp size={24} className="text-muted-foreground" />
                    </div>
                    <p className="font-semibold text-foreground">ยังไม่มีรายการปันผล</p>
                    <p className="text-[13px] text-muted-foreground max-w-xs">
                        กดปุ่ม "แจ้งโอนใหม่" เพื่อแจ้งการโอนกำไรไตรมาสให้นักลงทุน
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-5">
                    {Object.values(grouped).map(({ title, items }) => (
                        <ProjectProfitCard key={items[0].project_id} title={title} pools={items} />
                    ))}
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
