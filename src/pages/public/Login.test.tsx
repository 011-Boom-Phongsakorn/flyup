import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import Login from './Login'

// ── Mock the auth store: the component only needs `login` + `isLoggingIn` ──────
const mockLogin = vi.fn()
let mockIsLoggingIn = false
vi.mock('../../store/useAuthStore', () => ({
  useAuthStore: () => ({ login: mockLogin, isLoggingIn: mockIsLoggingIn }),
}))

// ── Mock toast so we can assert validation messages ───────────────────────────
const toastError = vi.fn()
vi.mock('react-hot-toast', () => ({
  toast: { error: (m: string) => toastError(m) },
  default: { error: (m: string) => toastError(m) },
}))

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  )
}

describe('<Login />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsLoggingIn = false
  })

  it('renders the email, password fields and submit button', () => {
    renderLogin()
    expect(screen.getByTestId('login-email')).toBeInTheDocument()
    expect(screen.getByTestId('login-password')).toBeInTheDocument()
    expect(screen.getByTestId('login-submit')).toBeInTheDocument()
  })

  it('blocks submission and warns when fields are empty', async () => {
    const user = userEvent.setup()
    renderLogin()
    await user.click(screen.getByTestId('login-submit'))
    expect(toastError).toHaveBeenCalledWith('กรุณากรอกข้อมูลให้ครบถ้วน')
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('warns on an invalid email format', async () => {
    const user = userEvent.setup()
    renderLogin()
    // 'bad@x' passes the browser's native type=email check (so the form submits)
    // but fails the app's stricter regex that requires a dotted domain.
    await user.type(screen.getByTestId('login-email'), 'bad@x')
    await user.type(screen.getByTestId('login-password'), 'secret123')
    await user.click(screen.getByTestId('login-submit'))
    expect(toastError).toHaveBeenCalledWith('รูปแบบอีเมลไม่ถูกต้อง')
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('calls login with the entered credentials when valid', async () => {
    const user = userEvent.setup()
    renderLogin()
    await user.type(screen.getByTestId('login-email'), 'user@flyup.dev')
    await user.type(screen.getByTestId('login-password'), 'secret123')
    await user.click(screen.getByTestId('login-submit'))
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'user@flyup.dev',
      password: 'secret123',
    })
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderLogin()
    const pw = screen.getByTestId('login-password') as HTMLInputElement
    expect(pw.type).toBe('password')
    // the eye toggle is the only icon button next to the password input
    const toggle = pw.parentElement!.querySelector('button')!
    await user.click(toggle)
    expect(pw.type).toBe('text')
  })
})
