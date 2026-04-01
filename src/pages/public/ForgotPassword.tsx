import { useState } from "react"
import { Link } from "react-router"
import { Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuthStore } from "../../store/useAuthStore"

const ForgotPassword = () => {
    const { forgotPassword, isSendingReset } = useAuthStore()
    const [email, setEmail] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!email.trim()) {
            toast.error('กรุณากรอกอีเมล')
            return
        }
        await forgotPassword(email)
    }

    const inputStyle = `w-full border focus:outline-none bg-background text-foreground rounded-[6px] border-border outline-none p-[12px] h-[38px] focus:border-primary`

    return (
        <div className="w-full mx-auto max-w-[510px] border border-border rounded-[12px] bg-card mt-[100px]">
            <div className="flex flex-col gap-[16px] p-[24px]">
                <div className="flex flex-col items-center justify-center">
                    <img src="/flyup-logo.png" alt="flyup-logo.png" className="h-[70px] w-[106px]" />
                    <h1 className="text-[24px] font-semibold text-foreground">ลืมรหัสผ่าน</h1>
                    <p className="text-[14px] text-muted-foreground font-medium text-center">กรอกอีเมลของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-[16px] mt-[8px]">
                    <div className="flex flex-col gap-[4px] w-full">
                        <label className="text-[14px] text-foreground">อีเมล <span className="text-error">*</span></label>
                        <input name="email" onChange={(e) => setEmail(e.target.value)} value={email} type="email" className={inputStyle} />
                    </div>
                    <button disabled={isSendingReset} type="submit" className="bg-primary text-white text-[14px] w-full flex items-center justify-center h-[40px] rounded-[8px] cursor-pointer hover:bg-primary-hover transition-all duration-300">
                        {isSendingReset ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                <span>กำลังส่งลิงก์...</span>
                            </>
                        ) : <span>เซ็ตรหัสผ่าน</span>}
                    </button>
                </form>
                <div className="text-center mt-[8px]">
                    <Link to='/login' className="text-[14px] text-muted-foreground hover:text-primary transition-all duration-200">กลับไปยังหน้าเข้าสู่ระบบ</Link>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
