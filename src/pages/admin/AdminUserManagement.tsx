import { useState, useEffect, useCallback } from 'react'
import { Loader2, UserX, RotateCcw, Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import api from '../../services/api'
import PageHeader from '../../components/admin/PageHeader'

interface UserRow {
    id: number
    email: string
    first_name: string
    last_name: string
    role: string
    status: string
    picture?: string | null
    suspend_reason?: string | null
}

const ROLE_BADGE: Record<string, { label: string; cls: string }> = {
    pioneer: { label: 'Pioneer', cls: 'bg-primary/10 text-primary border border-primary/20' },
    booster: { label: 'Booster', cls: 'bg-rose-50 text-rose-600 border border-rose-200' },
    admin:   { label: 'Admin',   cls: 'bg-red-50 text-red-700 border border-red-200' },
}

const STATUS_BADGE: Record<string, string> = {
    active: 'bg-green-50 text-green-700 border border-green-200',
    suspended: 'bg-red-50 text-red-700 border border-red-200',
}

const SuspendModal = ({
    userId,
    onClose,
    onConfirm,
    isSubmitting,
}: {
    userId: number
    onClose: () => void
    onConfirm: (reason: string) => Promise<void>
    isSubmitting: boolean
}) => {
    const [reason, setReason] = useState('')
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-[420px] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-3">
                    <h2 className="text-lg font-bold text-foreground">ระงับผู้ใช้ ID #{userId}</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
                </div>
                <div className="flex flex-col gap-1 mb-5">
                    <label className="text-[13px] font-medium">เหตุผล <span className="text-error">*</span></label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={4}
                        placeholder="ระบุเหตุผลในการระงับบัญชีผู้ใช้นี้"
                        className="border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary resize-none"
                    />
                </div>
                <div className="flex gap-2 justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-[13px] rounded-lg border border-border hover:bg-gray-50">ยกเลิก</button>
                    <button
                        onClick={() => onConfirm(reason)}
                        disabled={!reason.trim() || isSubmitting}
                        className="px-4 py-2 text-[13px] rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <UserX size={14} />}
                        ระงับ
                    </button>
                </div>
            </div>
        </div>
    )
}

const AdminUserManagement = () => {
    const [users, setUsers] = useState<UserRow[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const pageSize = 15

    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [suspendTarget, setSuspendTarget] = useState<number | null>(null)
    const [isSuspending, setIsSuspending] = useState(false)
    const [rollingBackId, setRollingBackId] = useState<number | null>(null)

    const totalPages = Math.ceil(total / pageSize)

    const fetchUsers = useCallback(async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams({
                page: String(page),
                page_size: String(pageSize),
            })
            if (search) params.set('search', search)
            if (roleFilter) params.set('role', roleFilter)
            if (statusFilter) params.set('status', statusFilter)

            const res = await api.get(`/admin/list-users?${params}`)
            setUsers(res.data?.data ?? [])
            setTotal(res.data?.meta?.total ?? 0)
        } catch {
            toast.error('โหลดรายชื่อผู้ใช้ไม่สำเร็จ')
        } finally {
            setIsLoading(false)
        }
    }, [page, search, roleFilter, statusFilter])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleSearch = () => {
        setSearch(searchInput)
        setPage(1)
    }

    const handleSuspend = async (reason: string) => {
        if (!suspendTarget) return
        setIsSuspending(true)
        try {
            await api.patch(`/admin/suspend-user/${suspendTarget}`, { reason })
            toast.success(`ระงับผู้ใช้ #${suspendTarget} สำเร็จ`)
            setSuspendTarget(null)
            fetchUsers()
        } catch (error) {
            const msg = error instanceof AxiosError ? error.response?.data?.message : null
            toast.error(msg || 'ระงับไม่สำเร็จ')
        } finally {
            setIsSuspending(false)
        }
    }

    const handleRollback = async (id: number) => {
        setRollingBackId(id)
        try {
            await api.patch(`/admin/rollback-user/${id}`)
            toast.success(`คืนสถานะผู้ใช้ #${id} สำเร็จ`)
            fetchUsers()
        } catch (error) {
            const msg = error instanceof AxiosError ? error.response?.data?.message : null
            toast.error(msg || 'คืนสถานะไม่สำเร็จ')
        } finally {
            setRollingBackId(null)
        }
    }

    return (
        <div className="flex flex-col gap-[16px]">
            <PageHeader title="จัดการผู้ใช้" subtitle="ระงับหรือคืนสถานะบัญชีผู้ใช้" />

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-border rounded-lg px-3 py-2 bg-white focus-within:border-primary">
                    <Search size={15} className="text-muted-foreground shrink-0" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="ค้นหาชื่อ หรืออีเมล..."
                        className="flex-1 text-[13px] outline-none bg-transparent"
                    />
                    {searchInput && (
                        <button onClick={() => { setSearchInput(''); setSearch(''); setPage(1) }}>
                            <X size={14} className="text-muted-foreground" />
                        </button>
                    )}
                </div>
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 rounded-lg bg-primary text-white text-[13px] font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                >
                    ค้นหา
                </button>
                <select
                    value={roleFilter}
                    onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
                    className="border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary bg-white cursor-pointer"
                >
                    <option value="">ทุก Role</option>
                    <option value="pioneer">Pioneer</option>
                    <option value="booster">Booster</option>
                    <option value="admin">Admin</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                    className="border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus:border-primary bg-white cursor-pointer"
                >
                    <option value="">ทุกสถานะ</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                </select>
                <span className="text-[12px] text-muted-foreground ml-auto">{total} ผู้ใช้</span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-border overflow-hidden text-[14px]">
                <div className="grid grid-cols-[60px_1fr_1fr_90px_90px_120px] bg-[#f8f9fc] px-4 py-3 font-medium text-gray-500 border-b border-border text-[13px]">
                    <div className="text-center">ID</div>
                    <div>ชื่อ</div>
                    <div>อีเมล</div>
                    <div className="text-center">Role</div>
                    <div className="text-center">สถานะ</div>
                    <div className="text-center">จัดการ</div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <Loader2 className="animate-spin text-muted-foreground" size={28} />
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex justify-center items-center py-16 text-[13px] text-muted-foreground">
                        ไม่พบผู้ใช้
                    </div>
                ) : (
                    users.map((u) => (
                        <div
                            key={u.id}
                            className="grid grid-cols-[60px_1fr_1fr_90px_90px_120px] border-b border-border last:border-0 hover:bg-gray-50 transition-colors px-4"
                        >
                            <div className="h-12 flex items-center justify-center text-[12px] text-muted-foreground">
                                {u.id}
                            </div>
                            <div className="h-12 flex items-center text-[13px] font-medium truncate pr-2">
                                {u.first_name} {u.last_name}
                            </div>
                            <div className="h-12 flex items-center text-[13px] text-muted-foreground truncate pr-2">
                                {u.email}
                            </div>
                            <div className="h-12 flex items-center justify-center">
                                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${ROLE_BADGE[u.role]?.cls ?? 'bg-gray-100 text-gray-600'}`}>
                                    {ROLE_BADGE[u.role]?.label ?? u.role}
                                </span>
                            </div>
                            <div className="h-12 flex items-center justify-center">
                                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[u.status] ?? ''}`}>
                                    {u.status === 'active' ? 'Active' : 'Suspended'}
                                </span>
                            </div>
                            <div className="h-12 flex items-center justify-center gap-1.5">
                                {u.status === 'active' ? (
                                    <button
                                        onClick={() => setSuspendTarget(u.id)}
                                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                        title="ระงับบัญชี"
                                    >
                                        <UserX size={15} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleRollback(u.id)}
                                        disabled={rollingBackId === u.id}
                                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-50"
                                        title="คืนสถานะ"
                                    >
                                        {rollingBackId === u.id
                                            ? <Loader2 size={15} className="animate-spin" />
                                            : <RotateCcw size={15} />
                                        }
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-1.5 rounded-lg border border-border hover:bg-gray-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-[13px] text-muted-foreground">
                        หน้า {page} / {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-1.5 rounded-lg border border-border hover:bg-gray-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {suspendTarget && (
                <SuspendModal
                    userId={suspendTarget}
                    onClose={() => setSuspendTarget(null)}
                    onConfirm={handleSuspend}
                    isSubmitting={isSuspending}
                />
            )}
        </div>
    )
}

export default AdminUserManagement
