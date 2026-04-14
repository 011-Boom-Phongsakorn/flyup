import { NavLink, useNavigate } from "react-router"
import {
    HomeIcon, LogOut, SearchIcon, LayoutDashboard, UserRound,
    Wallet, Video, Vote, TrendingUp, RotateCcw, MessageSquareWarning
} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

const menu = [
    { icon: <HomeIcon size={20} />, title: 'หน้าหลัก', path: '/' },
    { icon: <SearchIcon size={20} />, title: 'สำรวจโปรเจกต์', path: '/projects' },
    { icon: <LayoutDashboard size={20} />, title: 'แดชบอร์ด', path: '/booster/dashboard' },
    { icon: <Wallet size={20} />, title: 'การลงทุน', path: '/booster/investments' },
    { icon: <Video size={20} />, title: 'การประชุม', path: '/booster/meetings' },
    { icon: <Vote size={20} />, title: 'โหวต', path: '/booster/votes' },
    { icon: <TrendingUp size={20} />, title: 'กำไร', path: '/booster/profits' },
    { icon: <RotateCcw size={20} />, title: 'คืนเงิน', path: '/booster/refunds' },
    { icon: <MessageSquareWarning size={20} />, title: 'คำร้องเรียน', path: '/booster/complaints' },
    { icon: <UserRound size={20} />, title: 'โปรไฟล์', path: '/booster/profile' },
]

const SidebarBooster = () => {
    const navigate = useNavigate();
    const { logout, authUser } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    const profileUrl = authUser?.profile_url || "https://ui-avatars.com/api/?name=" + (authUser?.email || "B");

    return (
        <aside className="bg-sidebar w-[230px] min-w-[230px] h-full text-primary-light flex flex-col pt-[10px] border-r border-sidebar-accent">
            <div className="w-full flex flex-col items-center gap-[10px] pb-4">
                <img
                    src={typeof profileUrl === 'string' ? profileUrl : '/flyup-logo.png'}
                    alt="Profile"
                    className="h-[56px] w-[56px] rounded-full border-2 border-sidebar-accent object-cover"
                />
                <span className="text-sidebar-primary text-[13px] px-[10px] py-[2px] rounded-[20px] bg-sidebar-primary/20 font-medium">
                    Booster
                </span>
            </div>

            <ul className="w-full flex flex-col gap-[4px] p-[10px] flex-1 overflow-y-auto font-kanit">
                {menu.map((item, idx) => (
                    <li key={idx}>
                        <NavLink
                            to={item.path}
                            end={item.path === '/booster/dashboard'}
                            className={({ isActive }) =>
                                `flex p-[10px] gap-[10px] text-[14px] items-center transition-all duration-200 ${isActive
                                    ? "text-sidebar-primary bg-sidebar-accent rounded-[12px]"
                                    : "hover:text-sidebar-primary hover:bg-sidebar-accent hover:rounded-[12px]"
                                }`
                            }
                        >
                            {item.icon} {item.title}
                        </NavLink>
                    </li>
                ))}
            </ul>

            <div className="w-full p-[10px] border-t border-sidebar-accent">
                <button
                    onClick={handleLogout}
                    className="flex w-full p-[10px] gap-[12px] text-[14px] items-center hover:text-error hover:bg-sidebar-accent hover:rounded-[12px] transition-all duration-200 cursor-pointer"
                >
                    <LogOut size={20} /> ออกจากระบบ
                </button>
            </div>
        </aside>
    )
}

export default SidebarBooster
