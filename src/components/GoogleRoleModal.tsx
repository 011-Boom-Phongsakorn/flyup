import { Users, Loader2 } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { useAuthStore } from "../store/useAuthStore"

type UserRole = 'booster' | 'pioneer'

interface GoogleRoleModalProps {
    open: boolean
    onClose: () => void
}

const GoogleRoleModal = ({ open, onClose }: GoogleRoleModalProps) => {
    const { selectRole, isSelectingRole } = useAuthStore()

    if (!open) return null

    const handleSelect = async (role: UserRole) => {
        const success = await selectRole(role)
        if (success) {
            onClose()
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
        >
            <div
                className="bg-white rounded-[16px] p-[24px] max-w-[460px] w-full flex flex-col gap-[16px]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-[8px]">
                        <FcGoogle size={28} />
                        <h3 className="text-foreground text-[18px] font-semibold">เลือกบทบาทของคุณ</h3>
                    </div>
                </div>
                <p className="text-[14px] text-muted-foreground">กรุณาเลือกบทบาทเพื่อดำเนินการต่อ</p>
                <div className="grid grid-cols-2 gap-[10px] w-full">
                    <button
                        type="button"
                        disabled={isSelectingRole}
                        onClick={() => handleSelect('pioneer')}
                        className="flex flex-col items-center justify-center h-[132px] border-[2px] border-border rounded-[12px] gap-[10px] p-[16px] cursor-pointer transition-all duration-200 hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="w-[48px] h-[48px] flex justify-center items-center rounded-full bg-background">
                            <Users size={16} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-foreground text-[16px] font-bold">Pioneer</h3>
                            <p className="text-muted-foreground text-[12px]">ผู้สร้างโปรเจกต์</p>
                        </div>
                    </button>
                    <button
                        type="button"
                        disabled={isSelectingRole}
                        onClick={() => handleSelect('booster')}
                        className="flex flex-col items-center justify-center h-[132px] border-[2px] border-border rounded-[12px] gap-[10px] p-[16px] cursor-pointer transition-all duration-200 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="w-[48px] h-[48px] flex justify-center items-center rounded-full bg-background">
                            <Users size={16} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-foreground text-[16px] font-bold">Booster</h3>
                            <p className="text-muted-foreground text-[12px]">ผู้ลงทุน</p>
                        </div>
                    </button>
                </div>
                {isSelectingRole && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-[14px]">
                        <Loader2 size={16} className="animate-spin" />
                        <span>กำลังตั้งค่า...</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default GoogleRoleModal
