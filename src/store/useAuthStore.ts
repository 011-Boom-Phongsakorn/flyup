import { create } from 'zustand'
import api from '../services/api'
import toast from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode'
import { AxiosError } from 'axios'

interface University {
    id?: number;
    name_th?: string;
    name_en?: string;
    province?: string;
}

interface StudentProfile {
    bio?: string;
    portfolio?: string;
    skills?: string;
    faculty?: string;
    major?: string;
    student_code?: string;
    university_id?: number;
    university?: University;
}

interface CardVerification {
    id?: number;
    document?: string;
    selfie_url?: string;
    status?: string;
    verified_at?: string;
}

interface BankAccount {
    id?: number;
    bank_name?: string;
    account_name?: string;
    account_number?: string;
}

interface DecodedUser extends Record<string, unknown> {
    role?: string;
    email?: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
    picture?: string;
    google_sub?: string;
    has_password?: boolean;
    student_profile?: StudentProfile;
    bank_account?: BankAccount;
    student_card_verification?: CardVerification;
    id_card_verification?: CardVerification;
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
    isSelectingRole: boolean;
    register: (data: RegisterData) => Promise<boolean>;
    login: (data: LoginData) => Promise<void>;
    loginWithGoogleToken: (token: string) => void;
    logout: () => Promise<void>;
    selectRole: (role: 'pioneer' | 'booster') => Promise<boolean>;
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
    isSelectingRole: false,
    isSendingReset: false,
    isResetting: false,
    checkAuth: async () => {
        try {
            const response = await api.get('/user/me')
            set({ authUser: response?.data?.data })
        } catch {
            // ถ้ามี token ใน localStorage อยู่แล้ว (เช่น หลัง Google OAuth)
            // ไม่ล้าง authUser เพื่อไม่ให้ลบ session ที่เพิ่ง set ไป
            if (!localStorage.getItem('auth_token')) {
                set({ authUser: null })
            }
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
    loginWithGoogleToken: (token) => {
        localStorage.setItem('auth_token', token)
        const decoded = jwtDecode(token) as DecodedUser
        set({ authUser: decoded })
    },
    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await api.post('/signin', data)
            const token: string = res.data?.token
            if (token) {
                localStorage.setItem('auth_token', token)
            }
            const meRes = await api.get('/user/me')
            set({ authUser: meRes.data.data })
        } catch (error: unknown) {
            const err = error instanceof AxiosError ? error : null;
            const errorMessage = err?.response?.data?.error;

            if (!err || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
                toast.error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่')
            } else if (errorMessage === 'please verify email') {
                toast.error('กรุณายืนยันอีเมล์ก่อนเข้าสู่ระบบ')
            } else if (err?.response?.data?.login_method === 'google') {
                toast.error('บัญชีผู้ใช้นี้ลงทะเบียนด้วย Google กรุณาเข้าสู่ระบบด้วย Google')
            } else {
                toast.error('อีเมล์หรือรหัสผ่านไม่ถูกต้อง')
            }
        } finally {
            set({ isLoggingIn: false })
        }
    },
    logout: async () => {
        try {
            await api.post('/user/signout')
        } catch {
            // ignore
        } finally {
            localStorage.removeItem('auth_token')
            set({ authUser: null })
        }
    },
    selectRole: async (role) => {
        set({ isSelectingRole: true })
        try {
            const res = await api.put('/user/select-role', { role })
            const token: string = res.data?.token
            if (token) {
                localStorage.setItem('auth_token', token)
            }
            const meRes = await api.get('/user/me')
            set({ authUser: meRes.data.data })
            return true
        } catch (error: unknown) {
            const err = error instanceof AxiosError ? error : null;
            const msg = err?.response?.data?.error || err?.response?.data?.message
            if (msg?.includes('domain') || msg?.includes('university')) {
                toast.error('อีเมลนี้ไม่ใช่อีเมลมหาวิทยาลัยที่รองรับ')
            } else {
                toast.error(msg || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
            }
            return false
        } finally {
            set({ isSelectingRole: false })
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