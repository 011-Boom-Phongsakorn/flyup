import { create } from 'zustand'
import api from '../services/api'
import toast from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode'
import { AxiosError } from 'axios'

interface DecodedUser extends Record<string, unknown> {
    role?: string;
    email?: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    profile_url?: string;
}

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
    logout: () => Promise<void>;
    isSendingReset: boolean;
    isResetting: boolean;
    forgotPassword: (email: string) => Promise<boolean>;
    resetPassword: (token: string, new_password: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isRegistering: false,
    isLoggingIn: false,
    isSendingReset: false,
    isResetting: false,
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
            if (message === 'this email is already registered' || data === 'this email is already registered') {
                toast.error('อีเมลนี้ถูกลงทะเบียนแล้ว')
            } else if (message === `sorry!, the domain doesn't exist`) {
                toast.error('ไม่รองรับมหาลัยนี้')
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
    },
    logout: async () => {
        try {
            await api.post('/signout')
            // console.log('sign out')
        } catch {
            // ignore
        } finally {
            set({ authUser: null })
        }
    },
    forgotPassword: async (email) => {
        set({ isSendingReset: true })
        try {
            await api.post('/forgot-password', { email })
            toast.success('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว')
            return true
        } catch (error: unknown) {
            const err = error instanceof AxiosError ? error : null;
            toast.error(err?.response?.data?.error || 'เกิดข้อผิดพลาดในการส่งอีเมล')
            return false
        } finally {
            set({ isSendingReset: false })
        }
    },
    resetPassword: async (token, new_password) => {
        set({ isResetting: true })
        try {
            await api.post(`/reset-password?reset_token=${token}`, { new_password })
            toast.success('เปลี่ยนรหัสผ่านสำเร็จ สามารถเข้าสู่ระบบได้เลย')
            return true
        } catch (error: unknown) {
            const err = error instanceof AxiosError ? error : null;
            toast.error(err?.response?.data?.error || 'ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้อง หรือหมดอายุแล้ว')
            return false
        } finally {
            set({ isResetting: false })
        }
    }
}))