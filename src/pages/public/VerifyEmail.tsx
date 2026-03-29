import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import api from '../../services/api'

type VerifyStatus = 'loading' | 'success' | 'error'

const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState<VerifyStatus>('loading')
    const [message, setMessage] = useState('')
    const token = searchParams.get('token')

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error')
                setMessage('ไม่พบ Token สำหรับยืนยันอีเมล์')
                return
            }

            try {
                await api.get(`/verify-email?token=${token}`)
                setStatus('success')
                setMessage('ยืนยันอีเมล์สำเร็จแล้ว!')
            } catch {
                setStatus('error')
                setMessage('ลิงก์ยืนยันไม่ถูกต้องหรือหมดอายุแล้ว')
            }
        }

        verify()
    }, [token])

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
            <div className="w-full max-w-[460px] border border-border rounded-[16px] bg-card p-[40px] text-center">

                {/* Loading */}
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-[16px]">
                        <div className="w-[80px] h-[80px] rounded-full bg-primary-light flex items-center justify-center">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        </div>
                        <h1 className="text-[22px] font-semibold text-foreground">กำลังยืนยันอีเมล์...</h1>
                        <p className="text-[14px] text-muted-foreground">กรุณารอสักครู่</p>
                    </div>
                )}

                {/* Success */}
                {status === 'success' && (
                    <div className="flex flex-col items-center gap-[16px]">
                        <div className="w-[80px] h-[80px] rounded-full bg-emerald-50 flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-success" />
                        </div>
                        <h1 className="text-[22px] font-semibold text-foreground">ยืนยันอีเมล์สำเร็จ!</h1>
                        <p className="text-[14px] text-muted-foreground leading-relaxed">
                            {message}<br />
                            คุณสามารถเข้าสู่ระบบเพื่อเริ่มใช้งาน FlyUp ได้เลย
                        </p>
                        <Link
                            to="/login"
                            className="mt-[8px] w-full bg-primary hover:bg-primary-hover text-white text-[14px] font-medium h-[44px] rounded-[10px] flex items-center justify-center transition-all duration-300"
                        >
                            เข้าสู่ระบบ
                        </Link>
                    </div>
                )}

                {/* Error */}
                {status === 'error' && (
                    <div className="flex flex-col items-center gap-[16px]">
                        <div className="w-[80px] h-[80px] rounded-full bg-red-50 flex items-center justify-center">
                            <XCircle className="w-10 h-10 text-error" />
                        </div>
                        <h1 className="text-[22px] font-semibold text-foreground">ยืนยันไม่สำเร็จ</h1>
                        <p className="text-[14px] text-muted-foreground leading-relaxed">
                            {message}
                        </p>
                        <div className="flex flex-col gap-[10px] w-full mt-[8px]">
                            <Link
                                to="/register"
                                className="w-full bg-primary hover:bg-primary-hover text-white text-[14px] font-medium h-[44px] rounded-[10px] flex items-center justify-center transition-all duration-300"
                            >
                                สมัครสมาชิกใหม่
                            </Link>
                            <Link
                                to="/"
                                className="w-full bg-background border border-border text-foreground text-[14px] font-medium h-[44px] rounded-[10px] flex items-center justify-center hover:bg-muted transition-all duration-300"
                            >
                                กลับหน้าหลัก
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VerifyEmail
