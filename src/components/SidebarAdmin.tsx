import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useAdminBadgeStore } from '@/store/useAdminBadgeStore'
import { House, Search, LayoutDashboard, UserRoundCheck, MailSearch, Milestone, Wallet, TrendingUp, MessageSquareWarning, ShieldBan, RotateCcw, FileText, Users, LogOut, UserRound, GraduationCap, Tag, FolderX } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router'

// ─── Badge ──────────────────────────────────────────────────────────────────

function Badge({ count }: { count: number }) {
    if (count <= 0) return null;
    return (
        <span className="ml-auto min-w-[20px] h-5 px-1.5 bg-error text-white text-[11px] font-bold rounded-full flex items-center justify-center leading-none">
            {count > 99 ? '99+' : count}
        </span>
    );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const SidebarAdmin = () => {
    const navigate = useNavigate()
    const { logout, authUser } = useAuthStore()
    const { counts, fetchBadges } = useAdminBadgeStore()

    useEffect(() => {
        fetchBadges();
        const interval = setInterval(fetchBadges, 60_000);
        return () => clearInterval(interval);
    }, [fetchBadges]);

    const menu = [
        { icon: <House size={20} />,              title: 'หน้าหลัก',           path: '/' },
        { icon: <Search size={20} />,             title: 'สำรวจโปรเจกต์',      path: '/projects' },
        { icon: <LayoutDashboard size={20} />,    title: 'แดชบอร์ด',           path: '/admin/dashboard' },
        { icon: <UserRoundCheck size={20} />,     title: 'ใบสมัคร Pioneer',     path: '/admin/verifications',      badge: counts.pending_verifications },
        { icon: <MailSearch size={20} />,         title: 'ตรวจสอบโปรเจกต์',    path: '/admin/projects-approval',  badge: counts.pending_projects },
        { icon: <Milestone size={20} />,          title: 'ตรวจสอบ Milestone',   path: '/admin/milestones',         badge: counts.submitted_milestones },
        { icon: <Wallet size={20} />,             title: 'การปล่อยเงิน',        path: '/admin/disbursements' },
        { icon: <TrendingUp size={20} />,         title: 'โอนกำไรนักลงทุน',    path: '/admin/profit-distribution' },
        { icon: <MessageSquareWarning size={20} />, title: 'คำร้องเรียน',       path: '/admin/complaints',         badge: counts.open_complaints },
        { icon: <FolderX size={20} />,            title: 'ยกเลิกโปรเจกต์',     path: '/admin/cancel-requests',    badge: counts.pending_cancel_requests },
        { icon: <ShieldBan size={20} />,          title: 'ระงับโปรเจกต์',      path: '/admin/projects-suspension' },
        { icon: <RotateCcw size={20} />,          title: 'คืนเงิน',            path: '/admin/refunds',            badge: counts.pending_refunds },
        { icon: <FileText size={20} />,           title: 'บันทึกการตรวจสอบ',   path: '/admin/audit-logs' },
        { icon: <Users size={20} />,              title: 'จัดการผู้ใช้',        path: '/admin/users' },
        { icon: <GraduationCap size={20} />,      title: 'จัดการมหาวิทยาลัย',  path: '/admin/universities' },
        { icon: <Tag size={20} />,                title: 'จัดการหมวดหมู่',      path: '/admin/categories' },
        { icon: <UserRound size={20} />,          title: 'โปรไฟล์',            path: '/admin/profile' },
    ]

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const initials = `${(authUser?.first_name as string)?.[0] ?? ""}${(authUser?.last_name as string)?.[0] ?? ""}`.toUpperCase() || "?"

    return (
        <aside className='bg-sidebar w-57.5 flex-none h-full text-primary-light flex flex-col pt-2.5 border-r border-sidebar-accent'>
            <div className='w-full flex flex-col items-center gap-2.5 pb-4'>
                {authUser?.picture ? (
                    <img src={authUser.picture as string} alt="profile" className='h-12 w-12 rounded-full object-cover' />
                ) : (
                    <div className='h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[16px]'>
                        {initials}
                    </div>
                )}
                <span className='text-error text-[14px] px-2 py-0.5 rounded-[20px] bg-error/20 font-medium'>Admin</span>
            </div>

            <ul className='w-full flex flex-col gap-1 p-2.5 flex-1 overflow-y-auto'>
                {menu.map((m, idx) => (
                    <li key={idx}>
                        <NavLink
                            to={m.path}
                            end={m.path === '/admin/dashboard'}
                            className={({ isActive }) =>
                                `flex p-2.5 gap-2.5 text-[14px] items-center transition-all duration-200 ${isActive
                                    ? 'text-sidebar-primary bg-sidebar-accent rounded-xl'
                                    : 'hover:text-sidebar-primary hover:bg-sidebar-accent hover:rounded-xl'
                                }`
                            }
                        >
                            {m.icon}
                            <span className="flex-1 truncate">{m.title}</span>
                            {'badge' in m && <Badge count={m.badge ?? 0} />}
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className='w-full p-2.5 border-t border-sidebar-accent'>
                <button
                    onClick={handleLogout}
                    className='flex w-full p-2.5 gap-3 text-[14px] items-center hover:text-error hover:bg-sidebar-accent hover:rounded-xl transition-all duration-200 cursor-pointer'
                >
                    <LogOut size={20} /> ออกจากระบบ
                </button>
            </div>
        </aside>
    )
}

export default SidebarAdmin
