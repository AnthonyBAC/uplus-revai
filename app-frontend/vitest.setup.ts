import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
})

vi.stubGlobal('scrollTo', vi.fn())

const { getComputedStyle } = window
window.getComputedStyle = (elt) => getComputedStyle(elt)
