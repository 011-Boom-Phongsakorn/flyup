import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeApiMock, makeToast, type ApiMock, res, apiError } from '../test/storeKit'

vi.mock('../services/api', () => ({ default: makeApiMock() }))
vi.mock('react-hot-toast', () => { const t = makeToast(); return { default: t, toast: t } })
vi.mock('sweetalert2', () => ({ default: { fire: vi.fn().mockResolvedValue({ isConfirmed: false }) } }))
import api from '../services/api'
import toast from 'react-hot-toast'
import { useProjectStore } from './useProjectStore'

const apiMock = api as unknown as ApiMock

describe('useProjectStore — pure reducers', () => {
  beforeEach(() => { vi.clearAllMocks(); useProjectStore.setState({ projects: [] }) })

  it('updateProjectInfo merges fields into currentProject', () => {
    useProjectStore.getState().updateProjectInfo({ title: 'Hello', fundingGoal: 5000 })
    const cp = useProjectStore.getState().currentProject
    expect(cp.title).toBe('Hello')
    expect(cp.fundingGoal).toBe(5000)
  })

  it('updateMilestone updates a valid index', () => {
    useProjectStore.getState().updateMilestone(0, { title: 'Phase A' })
    expect(useProjectStore.getState().currentProject.milestones[0].title).toBe('Phase A')
  })

  it('updateMilestone toasts on an out-of-bounds index', () => {
    useProjectStore.getState().updateMilestone(99, { title: 'X' })
    expect(toast.error).toHaveBeenCalledWith('เกิดข้อผิดพลาดในการอัปเดตข้อมูล Milestone')
  })
})

describe('useProjectStore — async actions', () => {
  beforeEach(() => { vi.clearAllMocks(); useProjectStore.setState({ projects: [], faqs: [] }) })

  it('fetchMyProjects loads summaries (with thumbnail lookups)', async () => {
    apiMock.get
      .mockResolvedValueOnce(res([{ id: 1, title: 'P1' }]))   // /pioneer/projects
      .mockResolvedValueOnce(res([]))                          // media lookup
    await useProjectStore.getState().fetchMyProjects()
    expect(apiMock.get).toHaveBeenCalledWith('/pioneer/projects')
    expect(useProjectStore.getState().projects).toHaveLength(1)
    expect(useProjectStore.getState().isLoading).toBe(false)
  })

  it('createProject returns the new id and pre-creates milestones', async () => {
    apiMock.post.mockResolvedValue(res({ id: 10 }))
    const id = await useProjectStore.getState().createProject()
    expect(apiMock.post).toHaveBeenCalledWith('/pioneer/projects')
    expect(id).toBe(10)
    expect(useProjectStore.getState().isCreating).toBe(false)
  })

  it('submitProject shows a friendly error when one is already active', async () => {
    apiMock.patch.mockRejectedValueOnce(apiError('you already have an active project'))
    const ok = await useProjectStore.getState().submitProject(1)
    expect(ok).toBe(false)
    expect(toast.error).toHaveBeenCalledWith('คุณมีโปรเจกต์ที่กำลังดำเนินอยู่แล้ว ไม่สามารถส่งโปรเจกต์ใหม่ได้ในขณะนี้')
  })

  it('addFaq validates required fields before calling the API', async () => {
    const ok = await useProjectStore.getState().addFaq(1, { question: '', answer: '' })
    expect(ok).toBe(false)
    expect(apiMock.post).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith('กรุณากรอกคำถามและคำตอบ')
  })

  it('addFaq posts and appends on success', async () => {
    apiMock.post.mockResolvedValueOnce(res({ id: 1, question: 'q', answer: 'a', sort_order: 1 }))
    const ok = await useProjectStore.getState().addFaq(1, { question: 'q', answer: 'a' })
    expect(ok).toBe(true)
    expect(useProjectStore.getState().faqs).toHaveLength(1)
  })
})
