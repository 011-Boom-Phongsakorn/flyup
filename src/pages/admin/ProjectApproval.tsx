import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Loader2, Search } from 'lucide-react'
import { useAdminStore } from '../../store/useAdminStore'

const ProjectApproval = () => {
    const { pendingProjects, isLoading, fetchPendingProjects } = useAdminStore()
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchPendingProjects()
    }, [fetchPendingProjects])

    const filtered = pendingProjects.filter((p) => {
        const q = search.toLowerCase()
        const fullname = p.owner ? `${p.owner.first_name} ${p.owner.last_name}` : ''
        return p.title.toLowerCase().includes(q) || fullname.toLowerCase().includes(q)
    })

    return (
        <div className="flex flex-col gap-[16px]">
            <div className="p-2.5">
                <h1 className="font-semibold text-[24px]">ตรวจสอบโปรเจกต์</h1>
                <p className="text-[12px] text-muted-foreground">ตรวจสอบและอนุมัติโปรเจกต์ใหม่ที่ส่งเข้ามา</p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-[10px]">
                <div className="relative flex-1 max-w-[320px]">
                    <Search size={14} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="ค้นหาโปรเจกต์หรือ Pioneer..."
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
                <div className="grid grid-cols-[40px_1fr_1fr_1fr] md:grid-cols-[48px_2fr_1fr_1fr_1fr_1fr_1fr] bg-[#f8f9fc] px-4 py-3 font-medium text-gray-500 border-b border-border text-[13px]">
                    <div className="text-center">ลำดับ</div>
                    <div>โปรเจกต์</div>
                    <div className="hidden md:block text-center">Pioneer</div>
                    <div className="hidden md:block text-center">เป้าหมาย</div>
                    <div className="text-center">วันที่ส่ง</div>
                    <div className="hidden md:block text-center">สถานะ</div>
                    <div className="text-center">จัดการ</div>
                </div>

                {/* Body */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <Loader2 className="animate-spin text-muted-foreground" size={28} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-16 text-center text-sm text-muted-foreground">
                        {search ? 'ไม่พบโปรเจกต์ที่ค้นหา' : 'ไม่มีโปรเจกต์ที่รอตรวจสอบ'}
                    </div>
                ) : (
                    filtered.map((p, idx) => {
                        const fullname = p.owner
                            ? `${p.owner.first_name} ${p.owner.last_name}`.trim()
                            : '-'
                        const dateStr = p.CreatedAt
                            ? new Date(p.CreatedAt).toLocaleDateString('th-TH', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                              })
                            : '-'
                        return (
                            <div key={p.id} className="grid grid-cols-[40px_1fr_1fr_1fr] md:grid-cols-[48px_2fr_1fr_1fr_1fr_1fr_1fr] border-b border-border last:border-0 hover:bg-gray-50 transition-colors px-4">
                                <div className="h-14 flex justify-center items-center text-muted-foreground text-[13px]">
                                    {idx + 1}
                                </div>
                                <div className="h-14 flex items-center pr-3 font-medium min-w-0">
                                    <span className="truncate">{p.title}</span>
                                </div>
                                <div className="hidden md:flex h-14 justify-center items-center text-[13px] min-w-0 px-1">
                                    <span className="truncate text-center">{fullname}</span>
                                </div>
                                <div className="hidden md:flex h-14 justify-center items-center text-[13px]">
                                    ฿{p.funding_goal.toLocaleString()}
                                </div>
                                <div className="h-14 flex justify-center items-center text-[13px]">{dateStr}</div>
                                <div className="hidden md:flex h-14 justify-center items-center">
                                    <span className="rounded-full px-2.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 text-[12px] font-medium whitespace-nowrap">
                                        <span className="md:hidden">รอ</span>
                                        <span className="hidden md:inline">รอตรวจสอบ</span>
                                    </span>
                                </div>
                                <div className="h-14 flex justify-center items-center">
                                    <Link
                                        to={`/admin/projects/${p.id}`}
                                        className="px-3 py-1.5 rounded-md bg-primary hover:bg-primary-hover transition-colors text-white text-[12px] font-medium whitespace-nowrap"
                                    >
                                        <span className="md:hidden">ดู</span>
                                        <span className="hidden md:inline">รายละเอียด</span>
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

export default ProjectApproval
