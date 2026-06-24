import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, makeToast, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
vi.mock('react-hot-toast', () => { const t = makeToast(); return { default: t, toast: t } })
import api from '../services/api'
import toast from 'react-hot-toast'
import { useSelfVerificationStore } from './useSelfVerificationStore'

const apiMock = api as unknown as ApiMock

describe('useSelfVerificationStore', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uploadVerificationDocument returns the uploaded url', async () => {
    apiMock.post.mockResolvedValueOnce(res({ url: 'https://cdn/x.png' }))
    const url = await useSelfVerificationStore.getState().uploadVerificationDocument(new File(['x'], 'x.png'))
    expect(apiMock.post).toHaveBeenCalledWith('/upload', expect.anything(), expect.anything())
    expect(url).toBe('https://cdn/x.png')
  })

  it('uploadVerificationDocument returns null and toasts on failure', async () => {
    apiMock.post.mockRejectedValueOnce(new Error('413'))
    const url = await useSelfVerificationStore.getState().uploadVerificationDocument(new File(['x'], 'x.png'))
    expect(url).toBeNull()
    expect(toast.error).toHaveBeenCalledWith('อัปโหลดไฟล์ไม่สำเร็จ')
  })

  it('submitStudentVerify posts and returns true', async () => {
    apiMock.post.mockResolvedValueOnce(res({}))
    const ok = await useSelfVerificationStore.getState().submitStudentVerify({ student_card_url: 'u' } as never)
    expect(apiMock.post).toHaveBeenCalledWith('/user/student-verify', { student_card_url: 'u' })
    expect(ok).toBe(true)
  })

  it('addBankAccount posts and returns true', async () => {
    apiMock.post.mockResolvedValueOnce(res({}))
    const ok = await useSelfVerificationStore.getState().addBankAccount({ bank_name: 'KBANK' } as never)
    expect(apiMock.post).toHaveBeenCalledWith('/user/add-bank', { bank_name: 'KBANK' })
    expect(toast.success).toHaveBeenCalledWith('เพิ่มบัญชีสำเร็จ')
    expect(ok).toBe(true)
  })

  it('setDefaultBankAccount patches and returns true', async () => {
    apiMock.patch.mockResolvedValueOnce(res({}))
    const ok = await useSelfVerificationStore.getState().setDefaultBankAccount(3)
    expect(apiMock.patch).toHaveBeenCalledWith('/user/set-default-bank/3')
    expect(ok).toBe(true)
  })
})
