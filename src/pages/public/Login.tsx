import { useState, useEffect } from "react"
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-hot-toast";
import { Link } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { Loader, Eye, EyeOff } from "lucide-react";


interface LoginFromData {
    email: string;
    password: string;
}

const Login = () => {
    const { login, isLoggingIn } = useAuthStore()
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({})
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState<LoginFromData>({
        email: '',
        password: ''
    })

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get('error') === 'oauth_failed') {
            toast.error('เข้าสู่ระบบด้วย Google ไม่สำเร็จ กรุณาลองใหม่')
            params.delete('error')
            window.history.replaceState({}, '', window.location.pathname)
        }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => {
            const n = { ...prev }
            delete n[name]
            return n
        })
    }

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: boolean } = {};

        if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = true;
            setErrors(newErrors);
            toast.error('รูปแบบอีเมล์ไม่ถูกต้อง')
            return false;
        }

        const fields = ['email', 'password']
        fields.forEach(f => {
            if (!(formData as unknown as Record<string, string>)[f].trim()) newErrors[f] = true;
        })

        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) {
            toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            return false;
        }

        return true;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            await login(formData)
        }
    }

    const inputStyle = (n: string) => `border focus:outline-none bg-background text-foreground rounded-[6px] border-border outline-none p-[12px] h-[38px] ${errors[n] ? 'border-error focus:border-error' : 'border-border focus:border-primary'}`

    return (
        <div className="w-full px-4">
        <div className="mx-auto max-w-[510px] border border-border rounded-[12px] bg-white mt-[100px] mb-6">
            <div className="flex flex-col gap-[16px] p-[24px]">
                <div>
                    <div className="flex flex-col items-center justify-center">
                        <img src="./flyup-logo.png" alt="flyup-logo.png" />
                        <h1 className="text-foreground text-[24px] font-semibold">ยินดีต้อนรับกลับ</h1>
                        <p className="text-muted-foreground text-[14px] font-medium">เข้าสู่ระบบบัญชี FlyUp ของคุณ</p>
                        <a href={`${import.meta.env.VITE_BASE_URL}/auth/google?role=booster`} className="flex items-center gap-[8px] mt-[24px] mb-[8px] h-[40px] bg-background border border-border rounded-[12px] justify-center w-full"><FcGoogle size={32} />เข้าสู่ระบบด้วย Google</a>
                        <div className="flex items-center w-full gap-4 mb-[6px]">
                            <div className="flex-grow h-px bg-border"></div>
                            <span className="text-muted-foreground text-sm font-medium">หรือ</span>
                            <div className="flex-grow h-px bg-border"></div>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-[27px]">
                    <div className="flex flex-col gap-[16px]">
                        <div className="flex flex-col gap-[4px]">
                            <label className="text-[14px] text-foreground">อีมล์ <span className="text-error">*</span></label>
                            <input name="email" onChange={handleChange} value={formData.email} type="text" className={inputStyle('email')} />
                        </div>
                        <div className="flex flex-col gap-[4px]">
                            <label className="text-[14px] text-foreground">รหัสผ่าน <span className="text-error">*</span></label>
                            <div className="relative">
                                <input name="password" onChange={handleChange} value={formData.password} type={showPassword ? 'text' : 'password'} className={`${inputStyle('password')} w-full pr-[38px]`} />
                                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-[10px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <Link to='/forgot/password' className="self-start text-[14px] text-muted-foreground hover:text-primary transition-all duration-200">ลืมรหัสผ่าน</Link>
                    </div>
                    <button disabled={isLoggingIn} type="submit" className="bg-primary text-white text-[14px] w-full flex items-center justify-center h-[40px] rounded-[8px] cursor-pointer hover:bg-primary-hover transition-all duration-300">
                        {isLoggingIn ? (
                            <>
                                <Loader className="h-5 w-5 animate-spin" />
                                <span>กำลังเข้าสู่ระบบ...</span>
                            </>
                        ) : <p>เข้าสู่ระบบ</p>}
                    </button>
                </form>
                <div className="text-center text-[14px] text-foreground">
                    <p>ยังไม่มีบัญชี? <Link to='/register' className="text-primary">สมัครสมาชิก</Link></p>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Login