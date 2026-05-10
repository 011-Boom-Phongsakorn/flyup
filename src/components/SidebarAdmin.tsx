import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useAdminBadgeStore } from '@/store/useAdminBadgeStore'
import { House, Search, LayoutDashboard, UserRoundCheck, MailSearch, Milestone, Wallet, TrendingUp, MessageSquareWarning, ShieldBan, RotateCcw, FileText, Users, LogOut, UserRound, GraduationCap, Tag, FolderX } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router'

type BadgeKey = 'pending_verifications' | 'pending_projects' | 'submitted_milestones' | 'open_complaints' | 'pending_cancel_requests' | 'pending_refunds'

interface MenuItem {
    icon: React.ReactNode
    title: string
    path: string
    badge?: BadgeKey
}

const menu: MenuItem[] = [
    { icon: <House size={20} />, title: 'หน้าหลัก', path: '/' },
    { icon: <Search size={20} />, title: 'สำรวจโปรเจกต์', path: '/projects' },
    { icon: <LayoutDashboard size={20} />, title: 'แดชบอร์ด', path: '/admin/dashboard' },
    { icon: <UserRoundCheck size={20} />, title: 'ใบสมัคร Pioneer', path: '/admin/verifications', badge: 'pending_verifications' },
    { icon: <MailSearch size={20} />, title: 'ตรวจสอบโปรเจกต์', path: '/admin/projects-approval', badge: 'pending_projects' },
    { icon: <Milestone size={20} />, title: 'ตรวจสอบ Milestone', path: '/admin/milestones', badge: 'submitted_milestones' },
    { icon: <Wallet size={20} />, title: 'การปล่อยเงิน', path: '/admin/disbursements' },
    { icon: <TrendingUp size={20} />, title: 'โอนกำไรนักลงทุน', path: '/admin/profit-distribution' },
    { icon: <MessageSquareWarning size={20} />, title: 'คำร้องเรียน', path: '/admin/complaints', badge: 'open_complaints' },
    { icon: <FolderX size={20} />, title: 'ยกเลิกโปรเจกต์', path: '/admin/cancel-requests', badge: 'pending_cancel_requests' },
    { icon: <ShieldBan size={20} />, title: 'ระงับโปรเจกต์', path: '/admin/projects-suspension' },
    { icon: <RotateCcw size={20} />, title: 'คืนเงิน', path: '/admin/refunds', badge: 'pending_refunds' },
    { icon: <FileText size={20} />, title: 'บันทึกการตรวจสอบ', path: '/admin/audit-logs' },
    { icon: <Users size={20} />, title: 'จัดการผู้ใช้', path: '/admin/users' },
    { icon: <GraduationCap size={20} />, title: 'จัดการมหาวิทยาลัย', path: '/admin/universities' },
    { icon: <Tag size={20} />, title: 'จัดการหมวดหมู่', path: '/admin/categories' },
    { icon: <UserRound size={20} />, title: 'โปรไฟล์', path: '/admin/profile' },
]

const SidebarAdmin = () => {
    const navigate = useNavigate()
    const { logout, authUser } = useAuthStore()
    const { counts, fetchBadges } = useAdminBadgeStore()

    useEffect(() => {
        fetchBadges()
        const interval = setInterval(fetchBadges, 30_000)
        return () => clearInterval(interval)
    }, [fetchBadges])

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const initials = `${(authUser?.first_name as string)?.[0] ?? ""}${(authUser?.last_name as string)?.[0] ?? ""}`.toUpperCase() || "?"

    return (
        <aside className='bg-sidebar w-[230px] flex-none h-full text-primary-light flex flex-col pt-[10px] border-r border-sidebar-accent'>
            <div className='w-full flex flex-col items-center gap-[10px] pb-4'>
                {authUser?.picture ? (
                    <img src={authUser.picture as string} alt="profile" className='h-[48px] w-[48px] rounded-full object-cover' />
                ) : (
                    <div className='h-[48px] w-[48px] rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[16px]'>
                        {initials}
                    </div>
                )}
                <span className='text-error text-[14px] px-[8px] py-[2px] rounded-[20px] bg-error/20 font-medium'>Admin</span>
            </div>
            <ul className='w-full flex flex-col gap-[4px] p-[10px] flex-1 overflow-y-auto'>
                {menu.map((m, idx) => {
                    const count = m.badge ? (counts[m.badge] ?? 0) : 0
                    return (
                        <li key={idx}>
                            <NavLink
                                to={m.path}
                                end={m.path === '/admin/dashboard'}
                                className={({ isActive }) => `flex p-[10px] gap-[10px] text-[14px] items-center transition-all duration-200 ${isActive ? 'text-sidebar-primary bg-sidebar-accent rounded-[12px]' : 'hover:text-sidebar-primary hover:bg-sidebar-accent hover:rounded-[12px]'}`}
                            >
                                {m.icon}
                                <span className='flex-1'>{m.title}</span>
                                {count > 0 && (
                                    <span className='min-w-[20px] h-[20px] bg-error text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1 leading-none'>
                                        {count > 99 ? '99+' : count}
                                    </span>
                                )}
                            </NavLink>
                        </li>
                    )
                })}
            </ul>
            <div className='w-full p-[10px] border-t border-sidebar-accent'>
                <button onClick={handleLogout} className='flex w-full p-[10px] gap-[12px] text-[14px] items-center hover:text-error hover:bg-sidebar-accent hover:rounded-[12px] transition-all duration-200 cursor-pointer'>
                    <LogOut size={20} /> ออกจากระบบ
                </button>
            </div>
        </aside>
    )
}

export default SidebarAdmin
