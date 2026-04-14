import { useEffect, useState } from 'react'
import { Loader2, Search, RotateCcw, CheckCircle, Clock } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RefundRequest {
    id: number
    amount: number
    status: string
    requested_at: string
    approved_at?: string
    project?: {
        id: number
        title: string
    }
    booster?: {
        first_name: string
        last_name: string
        email: string
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    pending:  { label: 'รอดำเนินการ', className: 'bg-amber-50 text-amber-600 border border-amber-200', icon: <Clock size={12} /> },
    approved: { label: 'อนุมัติแล้ว', className: 'bg-green-50 text-green-600 border border-green-200', icon: <CheckCircle size={12} /> },
}

const fmtDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

// ─── Component ────────────────────────────────────────────────────────────────

const AdminRefunds = () => {
    const [refunds, setRefunds] = useState<RefundRequest[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [approvingId, setApprovingId] = useState<number | null>(null)

    const fetchRefunds = async () => {
        setIsLoading(true)
        try {
            const res = await api.get('/admin/investments/refund-requests')
            setRefunds(res.data.data ?? [])
        } catch {
            toast.error('โหลดข้อมูลไม่สำเร็จ')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRefunds()
    }, [])

    const handleApprove = async (id: number) => {
        setApprovingId(id)
        try {
            await api.patch(`/admin/investments/${id}/approve-refund`)
            toast.success('อนุมัติการคืนเงินสำเร็จ')
            setRefunds((prev) =>
                prev.map((r) => r.id === id ? { ...r, status: 'approved', approved_at: new Date().toISOString() } : r)
            )
        } catch (error) {
            const msg = error instanceof AxiosError ? error.response?.data?.message : null
            toast.error(msg || 'เกิดข้อผิดพลาด')
        } finally {
            setApprovingId(null)
        }
    }

    const filtered = refunds.filter((r) => {
        const q = search.toLowerCase()
        const fullname = r.booster ? `${r.booster.first_name} ${r.booster.last_name}` : ''
        return (
            (r.project?.title ?? '').toLowerCase().includes(q) ||
            fullname.toLowerCase().includes(q) ||
            (r.booster?.email ?? '').toLowerCase().includes(q)
        )
    })

    const pendingCount = refunds.filter((r) => r.status === 'pending').length

    return (
        <div className="flex flex-col gap-[16px]">
            <div className="p-2.5">
                <div className="flex items-center gap-[10px]">
                    <h1 className="font-semibold text-[24px]">การคืนเงิน</h1>
                    {pendingCount > 0 && (
                        <span className="px-[8px] py-[2px] rounded-full bg-amber-100 text-amber-700 text-[12px] font-semibold">
                            {pendingCount} รายการรอดำเนินการ
                        </span>
                    )}
                </div>
                <p className="text-[12px] text-muted-foreground">รายการขอคืนเงินจาก Booster ที่รอการอนุมัติ</p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-[10px]">
                <div className="relative flex-1 max-w-[320px]">
                    <Search size={14} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="ค้นหาโปรเจกต์หรือ Booster..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-[34px] pr-[12px] py-[8px] text-[13px] border border-border rounded-[8px] bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                {search && (
                    <span className="text-[12px] text-muted-foreground">พบ {filtered.length} รายการ</span>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-border overflow-hidden text-[14px]">
                {/* Header */}
                <div className="grid grid-cols-7 bg-[#f8f9fc] px-4 py-3 font-medium text-gray-500 border-b border-border">
                    <div className="text-center">ลำดับ</div>
                    <div className="col-span-2">โปรเจกต์</div>
                    <div className="text-center">Booster</div>
                    <div className="text-center">จำนวนเงิน</div>
                    <div className="text-center">สถานะ</div>
                    <div className="text-center">จัดการ</div>
                </div>

                {/* Body */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <Loader2 className="animate-spin text-muted-foreground" size={28} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-[10px] text-muted-foreground">
                        <RotateCcw size={28} className="opacity-40" />
                        <p className="text-sm">
                            {search ? 'ไม่พบรายการที่ค้นหา' : 'ไม่มีรายการขอคืนเงิน'}
                        </p>
                    </div>
                ) : (
                    filtered.map((r, idx) => {
                        const fullname = r.booster
                            ? `${r.booster.first_name} ${r.booster.last_name}`.trim()
                            : '-'
                        const status = STATUS_CONFIG[r.status] ?? STATUS_CONFIG['pending']
                        const isPending = r.status === 'pending'
                        const isApproving = approvingId === r.id

                        return (
                            <div
                                key={r.id}
                                className="grid grid-cols-7 border-b border-border last:border-0 hover:bg-gray-50 transition-colors"
                            >
                                <div className="h-14 flex justify-center items-center text-muted-foreground text-[13px]">
                                    {idx + 1}
                                </div>
                                <div className="col-span-2 h-14 flex flex-col justify-center px-2">
                                    <span className="font-medium text-[13px] truncate">{r.project?.title ?? '-'}</span>
                                    <span className="text-[11px] text-muted-foreground">
                                        ขอคืน {fmtDate(r.requested_at)}
                                    </span>
                                </div>
                                <div className="h-14 flex flex-col justify-center items-center gap-[2px]">
                                    <span className="text-[13px]">{fullname}</span>
                                    <span className="text-[11px] text-muted-foreground truncate max-w-[110px]">{r.booster?.email ?? ''}</span>
                                </div>
                                <div className="h-14 flex justify-center items-center font-semibold text-primary text-[14px]">
                                    ฿{r.amount.toLocaleString('th-TH')}
                                </div>
                                <div className="h-14 flex justify-center items-center">
                                    <span className={`flex items-center gap-[4px] rounded-full px-2.5 py-0.5 text-[12px] font-medium ${status.className}`}>
                                        {status.icon} {status.label}
                                    </span>
                                </div>
                                <div className="h-14 flex justify-center items-center">
                                    {isPending ? (
                                        <button
                                            onClick={() => handleApprove(r.id)}
                                            disabled={isApproving}
                                            className="flex items-center gap-[5px] px-[12px] py-[6px] rounded-[8px] bg-green-600 hover:bg-green-700 text-white text-[12px] font-medium transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                                        >
                                            {isApproving ? (
                                                <Loader2 size={12} className="animate-spin" />
                                            ) : (
                                                <CheckCircle size={13} />
                                            )}
                                            อนุมัติ
                                        </button>
                                    ) : (
                                        <span className="text-[12px] text-muted-foreground">
                                            {r.approved_at ? fmtDate(r.approved_at) : '-'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default AdminRefunds
