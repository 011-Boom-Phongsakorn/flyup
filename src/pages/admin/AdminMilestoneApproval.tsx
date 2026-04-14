import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Loader2, Search, Milestone } from 'lucide-react'
import { useAdminStore } from '../../store/useAdminStore'

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    submitted: { label: 'รอตรวจสอบ', className: 'bg-amber-50 text-amber-600 border border-amber-200' },
    approved:  { label: 'อนุมัติแล้ว', className: 'bg-green-50 text-green-600 border border-green-200' },
    rejected:  { label: 'ถูกปฏิเสธ', className: 'bg-red-50 text-red-600 border border-red-200' },
}

const AdminMilestoneApproval = () => {
    const { pendingMilestones, isMilestoneLoading, fetchPendingMilestones } = useAdminStore()
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchPendingMilestones()
    }, [fetchPendingMilestones])

    const filtered = pendingMilestones.filter((m) => {
        const q = search.toLowerCase()
        const fullname = m.owner ? `${m.owner.first_name} ${m.owner.last_name}` : ''
        return (
            m.project_title.toLowerCase().includes(q) ||
            m.title.toLowerCase().includes(q) ||
            fullname.toLowerCase().includes(q)
        )
    })

    return (
        <div className="flex flex-col gap-[16px]">
            <div className="p-2.5">
                <h1 className="font-semibold text-[24px]">ตรวจสอบ Milestone</h1>
                <p className="text-[12px] text-muted-foreground">ตรวจสอบและอนุมัติหลักฐาน Milestone ที่ Pioneer ส่งเข้ามา</p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-[10px]">
                <div className="relative flex-1 max-w-[320px]">
                    <Search size={14} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="ค้นหาโปรเจกต์, Milestone หรือ Pioneer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-[34px] pr-[12px] py-[8px] text-[13px] border border-border rounded-[8px] bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                {search && (
                    <span className="text-[12px] text-muted-foreground">
                        พบ {filtered.length} รายการ
                    </span>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-border overflow-hidden text-[14px]">
                {/* Header */}
                <div className="grid grid-cols-7 bg-[#f8f9fc] px-4 py-3 font-medium text-gray-500 border-b border-border">
                    <div className="text-center">ลำดับ</div>
                    <div className="col-span-2">โปรเจกต์</div>
                    <div className="text-center">Pioneer</div>
                    <div className="text-center">Phase</div>
                    <div className="text-center">สถานะ</div>
                    <div className="text-center">จัดการ</div>
                </div>

                {/* Body */}
                {isMilestoneLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <Loader2 className="animate-spin text-muted-foreground" size={28} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-[10px] text-muted-foreground">
                        <Milestone size={28} className="opacity-40" />
                        <p className="text-sm">
                            {search ? 'ไม่พบ Milestone ที่ค้นหา' : 'ไม่มี Milestone ที่รอตรวจสอบ'}
                        </p>
                    </div>
                ) : (
                    filtered.map((m, idx) => {
                        const fullname = m.owner
                            ? `${m.owner.first_name} ${m.owner.last_name}`.trim()
                            : '-'
                        const dateStr = m.submitted_at
                            ? new Date(m.submitted_at).toLocaleDateString('th-TH', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                              })
                            : '-'
                        const badge = STATUS_BADGE[m.status] ?? STATUS_BADGE['submitted']

                        return (
                            <div
                                key={m.id}
                                className="grid grid-cols-7 border-b border-border last:border-0 hover:bg-gray-50 transition-colors"
                            >
                                <div className="h-14 flex justify-center items-center text-muted-foreground text-[13px]">
                                    {idx + 1}
                                </div>
                                <div className="col-span-2 h-14 flex items-center px-2 font-medium truncate">
                                    {m.project_title}
                                </div>
                                <div className="h-14 flex justify-center items-center text-[13px]">
                                    {fullname}
                                </div>
                                <div className="h-14 flex flex-col justify-center items-center gap-[2px]">
                                    <span className="text-[13px] font-medium">Phase {m.phase_no}</span>
                                    <span className="text-[11px] text-muted-foreground truncate max-w-[90px]">{m.title}</span>
                                </div>
                                <div className="h-14 flex justify-center items-center">
                                    <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium ${badge.className}`}>
                                        {badge.label}
                                    </span>
                                </div>
                                <div className="h-14 flex justify-center items-center gap-[6px]">
                                    <span className="text-[11px] text-muted-foreground">{dateStr}</span>
                                    <Link
                                        to={`/admin/milestones/${m.id}`}
                                        className="px-3 py-1.5 rounded-[6px] bg-primary hover:bg-primary-hover transition-colors text-white text-[12px] font-medium"
                                    >
                                        ตรวจสอบ
                                    </Link>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default AdminMilestoneApproval
