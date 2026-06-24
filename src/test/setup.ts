import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Unmount React trees and clear mocks/storage between tests so they stay isolated.
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  localStorage.clear()
})

// jsdom doesn't implement these — stub so components that call them don't crash.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

if (!window.scrollTo) {
  window.scrollTo = vi.fn()
}
