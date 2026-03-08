import { create } from 'zustand'
// import api from '../services/api'
import toast from 'react-hot-toast'

interface AuthStore {
    authUser: any;
    // checkAuth: () => Promise<void>;
    isCheckingAuth: boolean;
    isRegistering: boolean;
    isLoggingIn: boolean;
    register: (data: any) => Promise<void>;
    login: (dayta: any) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isRegistering: false,
    isLoggingIn: false,
    register: async (data) => {
        set({ isRegistering: true })
        try{
            // await api.post('/users/register', data)
            console.log(data)
            toast.success('สร้างบัญชีสำเร็จ กรุณายืนยันอีเมล์ก่อนเข้าสู่ระบบ')
        }catch(error: any) {
            const errorMessage = error.response?.data?.error;
            if (errorMessage === 'email already exists') {
                toast.error('อีเมล์นี้ถูกใช้แล้ว')
            }else {
                toast.error(error.response?.data?.error || 'เกิดข้อผิดพลาดบางอย่าง');
            }
        }finally {
            set({ isRegistering: false })
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true })
        try{
            // await api.post('/users/login', data)
            console.log(data)
        }catch(error: any){
            const errorMessage = error.response?.data?.error;

            if (errorMessage === 'please verify email') {
                toast.error('กรุณายืนยันอีเมล์ก่อนเข้าสู่ระบบ')
            } else {
                toast.error('อีเมล์หรือรหัสผ่านไม่ถูกต้อง')
            }
        }finally {
            set({ isLoggingIn: false })
        }
    }
}))