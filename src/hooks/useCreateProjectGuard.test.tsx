import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

// ── Mocks (declared via factories so they're hoist-safe) ──────────────────────
const navigate = vi.fn()
vi.mock('react-router', () => ({ useNavigate: () => navigate }))

const swalFire = vi.fn()
vi.mock('sweetalert2', () => ({ default: { fire: (...a: unknown[]) => swalFire(...a) } }))

let authUser: Record<string, unknown> | null = null
vi.mock('../store/useAuthStore', () => ({ useAuthStore: () => ({ authUser }) }))

const createProject = vi.fn()
vi.mock('../store/useProjectStore', () => ({ useProjectStore: () => ({ createProject, isCreating: false }) }))

import useCreateProjectGuard from './useCreateProjectGuard'

const verifiedUser = {
  student_card_verification: { status: 'approved' },
  id_card_verification: { status: 'approved' },
  bank_accounts: [{ id: 1 }],
}

describe('useCreateProjectGuard', () => {
  beforeEach(() => { vi.clearAllMocks(); authUser = null })

  it('warns and does NOT create a project when verification is incomplete', async () => {
    authUser = { bank_accounts: [] }
    swalFire.mockResolvedValueOnce({ isConfirmed: false })
    const { result } = renderHook(() => useCreateProjectGuard())
    const id = await result.current.createWithGuard()
    expect(swalFire).toHaveBeenCalled()
    expect(createProject).not.toHaveBeenCalled()
    expect(id).toBeNull()
  })

  it('creates the project and navigates when fully verified', async () => {
    authUser = verifiedUser
    createProject.mockResolvedValueOnce(123)
    const { result } = renderHook(() => useCreateProjectGuard())
    const id = await result.current.createWithGuard()
    expect(createProject).toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith('/project/overview/123')
    expect(id).toBe(123)
  })
})
