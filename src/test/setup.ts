import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
  // Node-environment tests (like the PDF one) have no localStorage.
  globalThis.localStorage?.clear()
})
