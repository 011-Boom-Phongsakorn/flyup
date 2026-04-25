import { Users, X } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

type UserRole = 'booster' | 'pioneer'

interface GoogleRoleModalProps {
    open: boolean
    onClose: () => void
}

const GoogleRoleModal = ({ open, onClose }: GoogleRoleModalProps) => {
    if (!open) return null

    const handleSelect = (role: UserRole) => {
        window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google?role=${role}`
    }

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[16px] p-[24px] max-w-[460px] w-full flex flex-col gap-[16px]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-[8px]">
                        <FcGoogle size={28} />
                        <h3 className="text-foreground text-[18px] font-semibold">เข้าสู่ระบบด้วย Google</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="ปิด"
                    >
                        <X size={20} />
                    </button>
                </div>
                <p className="text-[14px] text-muted-foreground">เลือกบทบาทของคุณเพื่อดำเนินการต่อ</p>
                <div className="grid grid-cols-2 gap-[10px] w-full">
                    <button
                        type="button"
                        onClick={() => handleSelect('pioneer')}
                        className="flex flex-col items-center justify-center h-[132px] border-[2px] border-border rounded-[12px] gap-[10px] p-[16px] cursor-pointer transition-all duration-200 hover:border-accent"
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
                        onClick={() => handleSelect('booster')}
                        className="flex flex-col items-center justify-center h-[132px] border-[2px] border-border rounded-[12px] gap-[10px] p-[16px] cursor-pointer transition-all duration-200 hover:border-primary"
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
                <p className="text-[12px] text-muted-foreground text-center">
                    หากเคยเข้าสู่ระบบแล้ว ระบบจะใช้บทบาทเดิมของคุณโดยอัตโนมัติ
                </p>
            </div>
        </div>
    )
}

export default GoogleRoleModal
