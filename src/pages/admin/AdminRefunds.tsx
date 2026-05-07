import { useEffect, useState } from 'react'
import { Loader2, RotateCcw, CheckCircle, Clock } from 'lucide-react'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useRefundStore } from '../../store/useRefundStore'
import SearchBar from '../../components/admin/SearchBar'
import StatusBadge from '../../components/admin/StatusBadge'
import PageHeader from '../../components/admin/PageHeader'

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    refund_pending: { label: 'รอดำเนินการ', className: 'bg-amber-50 text-amber-600 border border-amber-200', icon: <Clock size={12} /> },
    refunded:       { label: 'อนุมัติแล้ว', className: 'bg-green-50 text-green-600 border border-green-200', icon: <CheckCircle size={12} /> },
}

const fmtDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

const AdminRefunds = () => {
    const { refunds, isLoading, fetchRefunds, approveRefund } = useRefundStore()
    const [search, setSearch] = useState('')
    const [approvingId, setApprovingId] = useState<number | null>(null)

    useEffect(() => {
        fetchRefunds()
    }, [fetchRefunds])

    const handleApprove = async (id: number) => {
        setApprovingId(id)
        try {
            await approveRefund(id)
        } catch (error) {
            const msg = error instanceof AxiosError ? error.response?.data?.message : null
            toast.error(msg || 'เกิดข้อผิดพลาด')
        } finally {
            setApprovingId(null)
        }
    }

    const filtered = refunds.filter((r) => {
        const q = search.toLowerCase()
        return (
            (r.project_title ?? '').toLowerCase().includes(q) ||
            (r.booster_name ?? '').toLowerCase().includes(q) ||
            (r.booster_email ?? '').toLowerCase().includes(q)
        )
    })

    return (
        <div className="flex flex-col gap-[16px]">
            <PageHeader title="การคืนเงิน" subtitle="รายการขอคืนเงินจาก Booster ที่รอการอนุมัติ" />

            <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="ค้นหาโปรเจกต์หรือ Booster..."
                resultCount={filtered.length}
            />

            {/* Table */}
            <div className="bg-white rounded-xl border border-border overflow-hidden text-[14px]">
                <div className="grid grid-cols-7 bg-[#f8f9fc] px-4 py-3 font-medium text-gray-500 border-b border-border">
                    <div className="text-center">ลำดับ</div>
                    <div className="col-span-2">โปรเจกต์</div>
                    <div className="text-center">Booster</div>
                    <div className="text-center">จำนวนเงิน</div>
                    <div className="text-center">สถานะ</div>
                    <div className="text-center">จัดการ</div>
                </div>

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
                        const status = STATUS_CONFIG[r.status] ?? STATUS_CONFIG['refund_pending']
                        const isPending = r.status === 'refund_pending'
                        const isApproving = approvingId === r.investment_id

                        return (
                            <div
                                key={r.investment_id}
                                className="grid grid-cols-7 border-b border-border last:border-0 hover:bg-gray-50 transition-colors"
                            >
                                <div className="h-14 flex justify-center items-center text-muted-foreground text-[13px]">
                                    {idx + 1}
                                </div>
                                <div className="col-span-2 h-14 flex flex-col justify-center px-2">
                                    <span className="font-medium text-[13px] truncate">{r.project_title || '-'}</span>
                                    <span className="text-[11px] text-muted-foreground">
                                        ขอคืน {fmtDate(r.requested_at)}
                                    </span>
                                </div>
                                <div className="h-14 flex flex-col justify-center items-center gap-[2px]">
                                    <span className="text-[13px]">{r.booster_name || '-'}</span>
                                    <span className="text-[11px] text-muted-foreground truncate max-w-[110px]">{r.booster_email}</span>
                                </div>
                                <div className="h-14 flex justify-center items-center font-semibold text-primary text-[14px]">
                                    ฿{(r.refund_amount ?? 0).toLocaleString('th-TH')}
                                </div>
                                <div className="h-14 flex justify-center items-center">
                                    <StatusBadge label={status.label} className={status.className} icon={status.icon} />
                                </div>
                                <div className="h-14 flex justify-center items-center">
                                    {isPending ? (
                                        <button
                                            onClick={() => handleApprove(r.investment_id)}
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
                                        <span className="text-[12px] text-muted-foreground">-</span>
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
