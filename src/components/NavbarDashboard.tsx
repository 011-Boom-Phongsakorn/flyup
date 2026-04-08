import { BellIcon, Menu } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

interface NavbarProps {
    onOpenSidebar: () => void;
}

const NavbarDashboard = ({ onOpenSidebar }: NavbarProps) => {
    const { authUser } = useAuthStore()

    const displayName = [authUser?.first_name, authUser?.last_name].filter(Boolean).join(' ') || authUser?.name || ''

    return (
        <header className="h-[64px] bg-white border-b border-border flex items-center justify-between px-4 lg:px-[32px] sticky top-0 z-10 font-kanit">
            <div className="flex items-center">
                <button
                    onClick={onOpenSidebar}
                    className="lg:hidden p-2 hover:bg-background rounded-md mr-2"
                >
                    <Menu size={20} className="text-foreground" />
                </button>
            </div>
            <div className="flex items-center gap-2 lg:gap-[17px]">
                <div className="p-2 text-foreground hover:bg-background rounded-full transition-colors relative cursor-pointer">
                    <BellIcon size={20} />
                    {/* <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span> */}
                </div>
                <div className="flex items-center">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-[14px] text-foreground">{displayName}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default NavbarDashboard