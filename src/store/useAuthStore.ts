import { create } from 'zustand'
import api from '../services/api'
import toast from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode'
import { AxiosError } from 'axios'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DecodedUser extends Record<string, unknown> { }

interface RegisterData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    accept_terms: boolean;
}

interface LoginData {
    email: string;
    password: string;
}

interface AuthStore {
    authUser: DecodedUser | null;
    checkAuth: () => Promise<void>;
    isCheckingAuth: boolean;
    isRegistering: boolean;
    isLoggingIn: boolean;
    register: (data: RegisterData) => Promise<boolean>;
    login: (data: LoginData) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isRegistering: false,
    isLoggingIn: false,
    checkAuth: async () => {
        try {
            const response = await api.get('/user/me')
            console.log(response?.data)
            set({ authUser: response?.data?.data })
        } catch {
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },
    register: async (data) => {
        set({ isRegistering: true })
        try {
            await api.post('/signup', data)
            console.log(data)
            toast.success('สร้างบัญชีสำเร็จ กรุณายืนยันอีเมล์ก่อนเข้าสู่ระบบ')
            return true
        } catch (error: unknown) {
            const err = error instanceof AxiosError ? error : null;
            const data = err?.response?.data;
            const message = data?.message;
            if (data === 'this email is already registered') {
                toast.error('อีเมล์นี้ถูกใช้แล้ว')
            } else if (message === `sorry!, the domain doesn't exist`) {
                toast.error('ไม่รองรับมหาลัยนี้')
            } else if (message === 'password must contain at least one uppercase letter' || message === 'password must contain at least one special character' || message === `Validation failed: Key: 'UserSignup.Password' Error:Field validation for 'Password' failed on the 'min' tag` || message === `password must contain at least one lowercase letter` || message === `password must contain at least one number`) {
                toast.error('ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว, พิมพ์เล็ก 1 ตัว, ตัวเลข 1 ตัว, อักษรพิเศษ 1 ตัว และ ไม่ต่ำกว่า 8 ตัว')
            } else {
                toast.error(data?.error || 'เกิดข้อผิดพลาดบางอย่าง');
            }
            return false
        } finally {
            set({ isRegistering: false })
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const response = await api.post('/signin', data)
            const token = response.data.token;
            const decodeUser = jwtDecode(token) as DecodedUser
            set({ authUser: decodeUser })
        } catch (error: unknown) {
            console.log(error)
            const err = error instanceof AxiosError ? error : null;
            const errorMessage = err?.response?.data?.error;

            if (errorMessage === 'please verify email') {
                toast.error('กรุณายืนยันอีเมล์ก่อนเข้าสู่ระบบ')
            } else {
                toast.error('อีเมล์หรือรหัสผ่านไม่ถูกต้อง')
            }
        } finally {
            set({ isLoggingIn: false })
        }
    }
}))