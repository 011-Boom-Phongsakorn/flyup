import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Loader2, Users } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuthStore } from "../../store/useAuthStore"

type UserRole = 'booster' | 'pioneer' | ''

interface RegisterFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    accept_terms: boolean;
}

const Register = () => {
    const { register, isRegistering } = useAuthStore()
    const navigate = useNavigate()
    const [role, setRole] = useState<UserRole>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({})
    const [formData, setFormData] = useState<RegisterFormData>({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        role: '',
        accept_terms: false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => {
            const n = { ...prev }
            delete n[name];
            return n
        })
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setConfirmPassword(value);

        if (errors.confirmPassword) {
            setErrors(prev => {
                const n = { ...prev };
                delete n.confirmPassword;
                return n;
            });
        }
    };

    const handleRoleSelect = (role: UserRole) => {
        setRole(role)
        setFormData(prev => ({ ...prev, role: role }))
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        console.log(checked)
        setFormData(prev => ({ ...prev, accept_terms: checked }))
    }

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: boolean } = {};

        if (!role) {
            toast.error('กรุณาเลือกบทบาท')
            return false
        }

        const fields = ['first_name', 'last_name', 'email', 'phone', 'password'];
        fields.forEach(f => { if (!(formData as unknown as Record<string, string>)[f].trim()) newErrors[f] = true });

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = true;
        }

        if (formData.password !== confirmPassword) {
            toast.error('รหัสผ่านไม่ตรงกัน')
            return false
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            return false
        }

        if (!formData.accept_terms) {
            toast.error('กรุณายอมรับข้อกำหนดและเงื่อนไข')
            return false;
        }

        return true;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (validateForm()) {
            const success = await register(formData)
            if (success) navigate('/login')
        }
    }

    const inputStyle = (n: string) => `border focus:outline-none bg-background text-foreground rounded-[6px] border-border outline-none p-[12px] h-[38px] ${errors[n] ? 'border-error focus:border-error' : 'border-border focus:border-primary'}`

    return (
        <div className="w-full mx-auto max-w-[510px] border border-border rounded-[12px] bg-card mt-[100px]">
            <div className="flex flex-col gap-[16px] p-[24px]">
                <div className="flex flex-col items-center justify-center">
                    <img src="/flyup-logo.png" alt="flyup-logo.png" className="h-[70px] w-[106px]" />
                    <h1 className="text-[24px] font-semibold text-foreground">สร้างบัญชี FLYUP</h1>
                    <p className="text-[14px] text-muted-foreground font-medium">เข้าร่วมแพลตฟอร์มระดมทุนซอฟต์แวร์นักศึกษา</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
                    <p className="text-[14px] text-foreground font-semibold">เลือกบทบาทของคุณ</p>
                    <div className="grid grid-cols-2 gap-[10px] w-full">
                        <div className={`flex flex-col items-center justify-center h-[132px] border-[2px] rounded-[12px] gap-[10px] p-[16px] cursor-pointer transition-all duration-200 ${role === 'pioneer' ? 'border-accent' : 'border-border hover:border-accent'}`} onClick={() => handleRoleSelect('pioneer')}>
                            <div className={`w-[48px] h-[48px] flex justify-center items-center rounded-full transition-all duration-200 ${role === 'pioneer' ? 'bg-accent text-white' : 'bg-background'}`}>
                                <Users size={16} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-foreground text-[16px] font-bold">Pioneer</h3>
                                <p className="text-muted-foreground text-[12px]">ผู้สร้างโปรเจกต์</p>
                            </div>
                        </div>
                        <div className={`flex flex-col items-center justify-center h-[132px] border-[2px] rounded-[12px] gap-[10px] p-[16px] cursor-pointer transition-all duration-200 ${role === 'booster' ? 'border-primary' : 'border-border hover:border-primary'}`} onClick={() => handleRoleSelect('booster')}>
                            <div className={`w-[48px] h-[48px] flex justify-center items-center rounded-full transition-all duration-200 ${role === 'booster' ? 'bg-primary text-white' : 'bg-background'}`}>
                                <Users size={16} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-foreground text-[16px] font-bold">Booster</h3>
                                <p className="text-muted-foreground text-[12px]">ผู้ลงทุน</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[16px]">
                        <div className="flex justify-between">
                            <div className="flex flex-col gap-[4px]">
                                <label className="font-[14px] text-foreground">ชื่อ *</label>
                                <input name="first_name" onChange={handleChange} value={formData.first_name} type="text" className={inputStyle('first_name')} />
                            </div>
                            <div className="flex flex-col gap-[4px]">
                                <label className="font-[14px] text-foreground">นามสกุล *</label>
                                <input name="last_name" onChange={handleChange} value={formData.last_name} type="text" className={inputStyle('last_name')} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-[4px]">
                            <label className="font-[14px] text-foreground">อีเมล์ *</label>
                            <input name="email" onChange={handleChange} value={formData.email} type="text" className={inputStyle('email')} />
                        </div>
                        <div className="flex flex-col gap-[4px]">
                            <label className="font-[14px] text-foreground">เบอร์โทรศัพท์ *</label>
                            <input name="phone" onChange={handleChange} value={formData.phone} type="text" className={inputStyle('phone')} />
                        </div>
                        <div className="flex flex-col gap-[4px]">
                            <label className="font-[14px] text-foreground">รหัสผ่าน *</label>
                            <input name="password" onChange={handleChange} value={formData.password} type="password" className={inputStyle('password')} />
                        </div>
                        <div className="flex flex-col gap-[4px]">
                            <label className="font-[14px] text-foreground">ยืนยันรหัสผ่าน *</label>
                            <input name="confirmPassword" onChange={handleConfirmPasswordChange} value={confirmPassword} type="password" className={inputStyle('confirmPassword')} />
                        </div>
                        <div className="flex gap-[8px] items-center">
                            <input name="accept_terms" onChange={handleCheckboxChange} checked={formData.accept_terms} type="checkbox" className="w-[18px] h-[18px] accent-primary cursor-pointer" />
                            <label className="text-muted-foreground text-[14px]">ฉันยอมรับ <Link to='/condition' className="underline text-foreground">ข้อกำหนดและเงื่อนไข</Link> ของ FlyUp</label>
                        </div>
                    </div>
                    <button disabled={isRegistering} type="submit" className="bg-primary text-white text-[14px] w-full flex items-center justify-center h-[40px] rounded-[8px] cursor-pointer hover:bg-primary-hover transition-all duration-300">
                        {
                            isRegistering ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>สร้างบัญชี...</span>
                                </>
                            ) : <p>สร้างบัญชี</p>
                        }
                    </button>
                </form>
                <div className="text-center">
                    <p className="text-[14px] text-foreground">มีบัญชีอยู่แล้ว? <Link to='/login' className="text-primary">เข้าสู่ระบบ</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Register