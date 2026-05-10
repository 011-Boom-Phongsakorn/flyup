import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useAdminBadgeStore } from '@/store/useAdminBadgeStore'
import {
    House, Search, LayoutDashboard,
    UserRoundCheck, MailSearch, Milestone,
    Wallet, TrendingUp, RotateCcw,
    MessageSquareWarning, FolderX, ShieldBan, FileText,
    Users, GraduationCap, Tag,
    UserRound, LogOut,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router'

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ count }: { count: number }) {
    if (count <= 0) return null
    return (
        <span className="ml-auto min-w-[20px] h-5 px-1.5 bg-error text-white text-[11px] font-bold rounded-full flex items-center justify-center leading-none">
            {count > 99 ? '99+' : count}
        </span>
    )
}

// ─── Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
    return (
        <li className="px-2.5 pt-4 pb-1">
            <span className="text-[11px] font-bold text-muted-foreground/80 select-none">
                {label}
            </span>
        </li>
    )
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────

interface NavItemProps {
    icon: React.ReactNode
    title: string
    path: string
    badge?: number
    end?: boolean
}

function NavItem({ icon, title, path, badge, end }: NavItemProps) {
    return (
        <li>
            <NavLink
                to={path}
                end={end}
                className={({ isActive }) =>
                    `flex p-2.5 gap-2.5 text-[13.5px] items-center transition-all duration-200 ${isActive
                        ? 'text-sidebar-primary bg-sidebar-accent rounded-xl'
                        : 'hover:text-sidebar-primary hover:bg-sidebar-accent hover:rounded-xl'
                    }`
                }
            >
                {icon}
                <span className="flex-1 truncate">{title}</span>
                {badge !== undefined && <Badge count={badge} />}
            </NavLink>
        </li>
    )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const SidebarAdmin = () => {
    const navigate = useNavigate()
    const { logout, authUser } = useAuthStore()
    const { counts, fetchBadges } = useAdminBadgeStore()

    useEffect(() => {
        fetchBadges()
        const interval = setInterval(fetchBadges, 60_000)
        return () => clearInterval(interval)
    }, [fetchBadges])

    const handleLogout = () => { logout(); navigate('/') }

    const initials = `${(authUser?.first_name as string)?.[0] ?? ''}${(authUser?.last_name as string)?.[0] ?? ''}`.toUpperCase() || '?'

    return (
        <aside className="bg-sidebar w-57.5 flex-none h-full text-primary-light flex flex-col pt-2.5 border-r border-sidebar-accent">

            {/* Profile */}
            <div className="w-full flex flex-col items-center gap-2 pb-4 px-3">
                {authUser?.picture ? (
                    <img src={authUser.picture as string} alt="profile" className="h-11 w-11 rounded-full object-cover" />
                ) : (
                    <div className="h-11 w-11 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[15px]">
                        {initials}
                    </div>
                )}
                <span className="text-error text-[12px] px-2 py-0.5 rounded-full bg-error/15 font-semibold">Admin</span>
            </div>

            {/* Nav */}
            <ul className="w-full flex flex-col gap-0.5 px-2.5 flex-1 overflow-y-auto pb-2">

                {/* ── ทั่วไป ── */}
                <SectionLabel label="ทั่วไป" />
                <NavItem icon={<House size={17} />}          title="หน้าหลัก"      path="/" end />
                <NavItem icon={<Search size={17} />}         title="สำรวจโปรเจกต์" path="/projects" />
                <NavItem icon={<LayoutDashboard size={17} />} title="แดชบอร์ด"     path="/admin/dashboard" end />

                {/* ── การตรวจสอบ ── */}
                <SectionLabel label="การตรวจสอบ" />
                <NavItem icon={<UserRoundCheck size={17} />} title="ใบสมัคร Pioneer"    path="/admin/verifications"     badge={counts.pending_verifications} />
                <NavItem icon={<MailSearch size={17} />}     title="ตรวจสอบโปรเจกต์"   path="/admin/projects-approval"  badge={counts.pending_projects} />
                <NavItem icon={<Milestone size={17} />}      title="ตรวจสอบ Milestone"  path="/admin/milestones"         badge={counts.submitted_milestones} />

                {/* ── การเงิน ── */}
                <SectionLabel label="การเงิน" />
                <NavItem icon={<Wallet size={17} />}      title="การปล่อยเงิน"      path="/admin/disbursements" />
                <NavItem icon={<TrendingUp size={17} />}  title="โอนกำไรนักลงทุน"  path="/admin/profit-distribution" />
                <NavItem icon={<RotateCcw size={17} />}   title="คืนเงิน"           path="/admin/refunds"            badge={counts.pending_refunds} />

                {/* ── การจัดการ ── */}
                <SectionLabel label="การจัดการ" />
                <NavItem icon={<MessageSquareWarning size={17} />} title="คำร้องเรียน"      path="/admin/complaints"      badge={counts.open_complaints} />
                <NavItem icon={<FolderX size={17} />}              title="ยกเลิกโปรเจกต์"  path="/admin/cancel-requests" badge={counts.pending_cancel_requests} />
                <NavItem icon={<ShieldBan size={17} />}            title="ระงับโปรเจกต์"   path="/admin/projects-suspension" />
                <NavItem icon={<FileText size={17} />}             title="บันทึกตรวจสอบ"   path="/admin/audit-logs" />

                {/* ── ระบบ ── */}
                <SectionLabel label="ระบบ" />
                <NavItem icon={<Users size={17} />}         title="จัดการผู้ใช้"         path="/admin/users" />
                <NavItem icon={<GraduationCap size={17} />} title="จัดการมหาวิทยาลัย"   path="/admin/universities" />
                <NavItem icon={<Tag size={17} />}            title="จัดการหมวดหมู่"      path="/admin/categories" />
                <NavItem icon={<UserRound size={17} />}     title="โปรไฟล์"             path="/admin/profile" />

            </ul>

            {/* Logout */}
            <div className="w-full p-2.5 border-t border-sidebar-accent">
                <button
                    onClick={handleLogout}
                    className="flex w-full p-2.5 gap-3 text-[13.5px] items-center hover:text-error hover:bg-sidebar-accent hover:rounded-xl transition-all duration-200 cursor-pointer"
                >
                    <LogOut size={17} /> ออกจากระบบ
                </button>
            </div>
        </aside>
    )
}

export default SidebarAdmin
