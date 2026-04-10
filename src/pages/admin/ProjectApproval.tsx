import { useEffect } from 'react'
import { Link } from 'react-router'
import { Loader2 } from 'lucide-react'
import { useAdminStore } from '../../store/useAdminStore'

const ProjectApproval = () => {
    const { pendingProjects, isLoading, fetchPendingProjects } = useAdminStore()

    useEffect(() => {
        fetchPendingProjects()
    }, [fetchPendingProjects])

    return (
        <div>
            <div className="text-foreground">
                <div className="p-2.5">
                    <h1 className="font-semibold text-[24px]">ตรวจสอบโปรเจกต์</h1>
                    <p className="text-[12px] text-muted-foreground">ตรวจสอบและอนุมัติโปรเจกต์ใหม่ที่ส่งเข้ามา</p>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-xl border border-border overflow-hidden text-[14px]">
                    {/* Table Header */}
                    <div className="grid grid-cols-6 bg-[#f8f9fc] p-4 font-medium text-gray-500 border-b border-border">
                        <div className="text-center">โปรเจกต์</div>
                        <div className="text-center">Pioneer</div>
                        <div className="text-center">เป้าหมาย</div>
                        <div className="text-center">วันที่ส่ง</div>
                        <div className="text-center">สถานะ</div>
                        <div className="text-center"></div>
                    </div>

                    {/* Table Body */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-16">
                            <Loader2 className="animate-spin text-muted-foreground" size={28} />
                        </div>
                    ) : pendingProjects.length === 0 ? (
                        <div className="py-16 text-center text-sm text-muted-foreground">
                            ไม่มีโปรเจกต์ที่รอตรวจสอบ
                        </div>
                    ) : (
                        pendingProjects.map((p) => {
                            const fullname = p.owner
                                ? `${p.owner.first_name} ${p.owner.last_name}`.trim()
                                : '-'
                            const dateStr = new Date(p.created_at).toLocaleDateString('th-TH', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            })
                            return (
                                <div key={p.id} className="grid grid-cols-6 border-b border-border last:border-0">
                                    <div className="h-15 flex justify-center items-center px-2 text-center">{p.title}</div>
                                    <div className="h-15 flex justify-center items-center">{fullname}</div>
                                    <div className="h-15 flex justify-center items-center">
                                        ฿{p.funding_goal.toLocaleString()}
                                    </div>
                                    <div className="h-15 flex justify-center items-center">{dateStr}</div>
                                    <div className="h-15 flex justify-center items-center">
                                        <span className="rounded-xl px-2.5 py-0.5 bg-gray-100 text-gray-600">
                                            รอตรวจสอบ
                                        </span>
                                    </div>
                                    <div className="h-15 flex justify-center items-center">
                                        <Link
                                            to={`/admin/projects/${p.id}`}
                                            className="px-4 py-2 rounded-xs bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                                        >
                                            รายละเอียด
                                        </Link>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProjectApproval
