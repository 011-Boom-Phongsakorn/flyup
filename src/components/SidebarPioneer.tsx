import { NavLink, useNavigate } from "react-router"
import { HomeIcon, LogOut, SearchIcon, LayoutDashboard, UserRound, Files, Flag } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

const menu = [
    { icon: <HomeIcon size={20} />, title: 'หน้าหลัก', path: '/' },
    { icon: <SearchIcon size={20} />, title: 'สำรวจโปรเจกต์', path: '/projects' },
    { icon: <LayoutDashboard size={20} />, title: 'แดชบอร์ด', path: '/pioneer/dashboard' },
    { icon: <Files size={20} />, title: 'โปรเจกต์ของฉัน', path: '/pioneer/dashboard/projects' },
    { icon: <Flag size={20} />, title: 'Milestone', path: '/pioneer/dashboard/milestones' },
    { icon: <UserRound size={20} />, title: 'โปรไฟล์', path: '/pioneer/profile' },
]

const SidebarPioneer = () => {
    const navigate = useNavigate();
    const { logout, authUser } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    const initials = `${(authUser?.first_name as string)?.[0] ?? ""}${(authUser?.last_name as string)?.[0] ?? ""}`.toUpperCase() || "?";

    return (
        <aside className="bg-sidebar w-[230px] min-w-[230px] h-full text-primary-light flex flex-col pt-[10px] border-r border-sidebar-accent">
            <div className="w-full flex flex-col items-center gap-[10px] pb-4">
                {authUser?.picture ? (
                    <img src={authUser.picture as string} alt="Profile" className="h-[48px] w-[48px] rounded-full object-cover" />
                ) : (
                    <div className="h-[48px] w-[48px] rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary text-[16px] font-bold">
                        {initials}
                    </div>
                )}
                <span className="text-sidebar-primary text-[14px] px-[8px] py-[2px] rounded-[20px] bg-sidebar-primary/20 font-medium">Pioneer</span>
            </div>

            <ul className="w-full flex flex-col gap-[4px] p-[10px] flex-1 overflow-y-auto font-kanit">
                {menu.map((item, idx) => (
                    <li key={idx}>
                        <NavLink to={item.path} end={item.path === '/pioneer/dashboard'} className={({ isActive }) => `flex p-[10px] gap-[10px] text-[14px] items-center transition-all duration-200 ${isActive ? "text-sidebar-primary bg-sidebar-accent rounded-[12px]" : "hover:text-sidebar-primary hover:bg-sidebar-accent hover:rounded-[12px]"}`}>
                            {item.icon} {item.title}
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className="w-full p-[10px] border-t border-sidebar-accent">
                <button onClick={handleLogout} className="flex w-full p-[10px] gap-[12px] text-[14px] items-center hover:text-error hover:bg-sidebar-accent hover:rounded-[12px] transition-all duration-200 cursor-pointer">
                    <LogOut size={20} /> ออกจากระบบ
                </button>
            </div>
        </aside>
    )
}

export default SidebarPioneer