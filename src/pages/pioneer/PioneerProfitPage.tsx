import { useEffect, useState, useMemo } from 'react'
import {
    Loader2, TrendingUp, CheckCircle2, Clock, Lock, X,
    Plus, Building2, SendHorizonal, Landmark, Copy, ChevronRight, ChevronLeft,
} from 'lucide-react'
import { usePioneerProfitStore, type PioneerProfitItem } from '../../store/usePioneerProfitStore'
import toast from 'react-hot-toast'
import api from '../../services/api'

const PLATFORM_BANK_NAME     = import.meta.env.VITE_PLATFORM_BANK_NAME     ?? 'ธนาคารกสิกรไทย (KBANK)'
const PLATFORM_ACCOUNT_NAME  = import.meta.env.VITE_PLATFORM_ACCOUNT_NAME  ?? 'บริษัท ฟลายอัพ จำกัด'
const PLATFORM_ACCOUNT_NUMBER = import.meta.env.VITE_PLATFORM_ACCOUNT_NUMBER ?? 'xxx-x-xxxxx-x'

const fmtBaht = (v: number) =>
    `฿${v.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })

interface MyProject { id: number; title: string; state: string; allMilestonesPaid?: boolean }

// ── Bank account card ─────────────────────────────────────────────────────────

function BankAccountCard({ compact = false }: { compact?: boolean }) {
    const copy = () => { navigator.clipboard.writeText(PLATFORM_ACCOUNT_NUMBER); toast.success('คัดลอกเลขบัญชีแล้ว') }
    if (compact) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3">
                <Landmark size={16} className="text-blue-600 shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-blue-600 font-semibold">โอนกำไรมาที่บัญชี FlyUp</p>
                    <p className="text-[12px] font-bold text-blue-800">{PLATFORM_ACCOUNT_NAME}</p>
                    <p className="text-[11px] text-blue-700">{PLATFORM_BANK_NAME}</p>
                </div>
                <div className="flex items-center gap-1">
                    <span className="font-mono text-[13px] font-bold text-blue-800">{PLATFORM_ACCOUNT_NUMBER}</span>
                    <button onClick={copy} className="p-1 hover:bg-blue-100 rounded cursor-pointer">
                        <Copy size={13} className="text-blue-600" />
                    </button>
                </div>
            </div>
        )
    }
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <Landmark size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
                <p className="text-[12px] text-blue-600 font-semibold mb-0.5">โอนกำไรมาที่บัญชีนี้ แล้วนำเลขอ้างอิงมากรอกด้านล่าง</p>
                <p className="text-[14px] font-bold text-blue-900">{PLATFORM_ACCOUNT_NAME}</p>
                <p className="text-[12px] text-blue-700">{PLATFORM_BANK_NAME}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[15px] font-bold text-blue-800">{PLATFORM_ACCOUNT_NUMBER}</span>
                <button onClick={copy} className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer">
                    <Copy size={15} className="text-blue-600" />
                </button>
            </div>
        </div>
    )
}

// ── Quarter availability ──────────────────────────────────────────────────────

function isQuarterAvailable(q: number, submittedQuarters: number[]): boolean {
    if (submittedQuarters.includes(q)) return false
    if (q === 1) return true
    return submittedQuarters.includes(q - 1)
}

// ── Submit Modal ──────────────────────────────────────────────────────────────

function SubmitProfitModal({
    projects, submittedMap, onClose, onSubmitted,
}: {
    projects: MyProject[]
    submittedMap: Record<number, number[]>
    onClose: () => void
    onSubmitted: () => void
}) {
    const { isSubmitting, submitProfit } = usePioneerProfitStore()
    const eligible = projects.filter(p =>
        (p.state === 'executing' || p.state === 'closed') && p.allMilestonesPaid === true
    )
    const [projectId, setProjectId]   = useState<number | ''>(eligible[0]?.id ?? '')
    const [quarterNo, setQuarterNo]   = useState<number | ''>('')
    const [amount, setAmount]         = useState('')
    const [transferRef, setTransferRef] = useState('')

    const submittedQs  = projectId ? (submittedMap[Number(projectId)] ?? []) : []
    const hasAvailable = [1, 2, 3, 4].some(q => isQuarterAvailable(q, submittedQs))
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

                {eligible.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-6 text-center">
                        <Lock size={28} className="text-muted-foreground opacity-40" />
                        <p className="text-[13px] font-semibold text-foreground">ยังไม่มีโปรเจกต์ที่พร้อมจ่ายปันผล</p>
                        <p className="text-[12px] text-muted-foreground max-w-[280px]">
                            โปรเจกต์ต้องผ่านครบทุก Phase Milestone (สถานะ paid) ก่อนจึงจะจ่ายปันผลได้
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-[13px] font-medium">โปรเจกต์ <span className="text-red-500">*</span></label>
                            <select
                                value={projectId}
                                onChange={e => { setProjectId(Number(e.target.value)); setQuarterNo('') }}
                                className="border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary cursor-pointer"
                            >
                                {eligible.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[13px] font-medium">ไตรมาส <span className="text-red-500">*</span></label>
                            {!hasAvailable ? (
                                <p className="text-[13px] text-green-600 font-medium">ส่งครบ 4 ไตรมาสแล้ว</p>
                            ) : (
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4].map(q => {
                                        const isSubmitted = submittedQs.includes(q)
                                        const isAvail = isQuarterAvailable(q, submittedQs)
                                        const isSelected = quarterNo === q
                                        return (
                                            <button key={q} onClick={() => isAvail && setQuarterNo(q)} disabled={!isAvail}
                                                className={`flex-1 py-2 rounded-lg border text-[13px] font-semibold transition-colors flex flex-col items-center gap-0.5
                                                    ${isSubmitted ? 'bg-green-50 border-green-200 text-green-600 cursor-not-allowed'
                                                    : isAvail ? isSelected
                                                        ? 'bg-primary text-white border-primary cursor-pointer'
                                                        : 'border-border text-foreground hover:border-primary hover:text-primary cursor-pointer'
                                                    : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'}`}
                                            >
                                                {isSubmitted ? <CheckCircle2 size={12} /> : !isAvail ? <Lock size={12} /> : null}
                                                Q{q}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        <BankAccountCard compact />

                        <div className="flex flex-col gap-1">
                            <label className="text-[13px] font-medium">ยอดโอน (บาท) <span className="text-red-500">*</span></label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                                placeholder="0.00" className="border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[13px] font-medium">เลขอ้างอิงการโอน <span className="text-red-500">*</span></label>
                            <input value={transferRef} onChange={e => setTransferRef(e.target.value)}
                                placeholder="เช่น TXN-20260630-001"
                                className="border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary" />
                        </div>
                    </div>
                )}

                <div className="flex gap-2 mt-5 justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-[13px] rounded-lg border border-border hover:bg-gray-50 cursor-pointer">ยกเลิก</button>
                    {hasAvailable && (
                        <button onClick={handleSubmit} disabled={!valid || isSubmitting}
                            className="px-4 py-2 text-[13px] rounded-lg bg-primary hover:bg-primary/90 text-white disabled:opacity-50 flex items-center gap-2 cursor-pointer">
                            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <SendHorizonal size={14} />}
                            แจ้งโอน
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── Quarter slot ──────────────────────────────────────────────────────────────

function QuarterSlot({ q, pool, prevSubmitted }: { q: number; pool?: PioneerProfitItem; prevSubmitted: boolean }) {
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

// ── Project summary card (list view) ─────────────────────────────────────────

function ProjectCard({
    title, pools, onClick,
}: { title: string; pools: PioneerProfitItem[]; onClick: () => void }) {
    const totalSent = pools.reduce((s, p) => s + p.total_amount, 0)
    const doneCount = pools.filter(p => p.status === 'completed').length

    return (
        <button
            onClick={onClick}
            className="w-full text-left bg-white border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
        >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-[15px] text-foreground leading-tight truncate">{title}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">{pools.length}/4 ไตรมาส</span>
                    {totalSent > 0 && <span className="text-xs font-medium text-primary">โอนแล้ว {fmtBaht(totalSent)}</span>}
                    {doneCount > 0 && <span className="text-xs text-emerald-600">✓ {doneCount} ไตรมาสเสร็จแล้ว</span>}
                </div>
            </div>
            <ChevronRight size={16} className="text-muted-foreground shrink-0" />
        </button>
    )
}

// ── Detail view ───────────────────────────────────────────────────────────────

function ProjectDetail({
    title, pools, onBack,
}: { title: string; pools: PioneerProfitItem[]; onBack: () => void }) {
    const totalSent    = pools.reduce((s, p) => s + p.total_amount, 0)
    const doneCount    = pools.filter(p => p.status === 'completed').length
    const poolByQ: Record<number, PioneerProfitItem> = {}
    pools.forEach(p => { poolByQ[p.quarter_no] = p })
    const submittedQs  = pools.map(p => p.quarter_no)

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

            {/* Quarter grid */}
            <div className="bg-white border border-border rounded-2xl p-5">
                <p className="text-[13px] font-semibold text-foreground mb-3">สถานะแต่ละไตรมาส</p>
                <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map(q => (
                        <QuarterSlot key={q} q={q} pool={poolByQ[q]} prevSubmitted={q === 1 || submittedQs.includes(q - 1)} />
                    ))}
                </div>
            </div>

            {/* History rows */}
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

// ── Main ──────────────────────────────────────────────────────────────────────

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

    // ── Detail view ──
    if (selected) {
        return (
            <ProjectDetail
                title={selected.title}
                pools={selected.items}
                onBack={() => setSelectedId(null)}
            />
        )
    }

    // ── List view ──
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

            {grouped.length === 0 ? (
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
                <div className="flex flex-col gap-3">
                    {grouped.map(g => (
                        <ProjectCard key={g.id} title={g.title} pools={g.items} onClick={() => setSelectedId(g.id)} />
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
