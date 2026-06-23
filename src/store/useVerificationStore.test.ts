import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, makeToast, type ApiMock, res } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
vi.mock('react-hot-toast', () => { const t = makeToast(); return { default: t, toast: t } })
import api from '../services/api'
import toast from 'react-hot-toast'
import { useVerificationStore } from './useVerificationStore'

const apiMock = api as unknown as ApiMock

describe('useVerificationStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useVerificationStore.setState({ studentVerifications: [], idCardVerifications: [], isLoading: false })
  })

  it('fetchVerifications loads both student and id-card queues', async () => {
    apiMock.get
      .mockResolvedValueOnce(res([{ user_id: 1 }]))   // student
      .mockResolvedValueOnce(res([{ user_id: 2 }]))   // id card
    await useVerificationStore.getState().fetchVerifications()
    const urls = apiMock.get.mock.calls.map(c => c[0])
    expect(urls).toEqual(expect.arrayContaining(['/admin/student-verifications', '/admin/id-card-verifications']))
    expect(useVerificationStore.getState().studentVerifications).toHaveLength(1)
    expect(useVerificationStore.getState().idCardVerifications).toHaveLength(1)
  })

  it('approveStudentCard patches the approve endpoint', async () => {
    apiMock.patch.mockResolvedValueOnce(res({}))
    await useVerificationStore.getState().approveStudentCard(1)
    expect(apiMock.patch).toHaveBeenCalledWith('/admin/approve-student-card/1')
    expect(toast.success).toHaveBeenCalledWith('อนุมัติบัตรนักศึกษาสำเร็จ')
  })

  it('rejectIdCard patches the reject endpoint', async () => {
    apiMock.patch.mockResolvedValueOnce(res({}))
    await useVerificationStore.getState().rejectIdCard(2)
    expect(apiMock.patch).toHaveBeenCalledWith('/admin/reject-id-card/2')
    expect(toast.success).toHaveBeenCalledWith('ปฏิเสธบัตรประชาชนแล้ว')
  })
})
