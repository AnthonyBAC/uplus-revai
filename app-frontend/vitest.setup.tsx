import React from 'react'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, afterAll, beforeAll, vi } from 'vitest'
import { server } from './src/mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
afterAll(() => server.close())

vi.stubGlobal('scrollTo', vi.fn())

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { src, alt, width, height, priority: _p, ...rest } = props as Record<string, unknown>
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src as string} alt={alt as string} width={width as number} height={height as number} {...rest} />
  },
}))

vi.mock('next/link', () => ({
  default: (props: Record<string, unknown>) => {
    const { href, children, ...rest } = props
    return <a href={href as string} {...rest}>{children as React.ReactNode}</a>
  },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

vi.mock('motion/react', () => ({
  LazyMotion: ({ children }: { children: React.ReactNode }) => children,
  domAnimation: {},
  m: new Proxy({} as Record<string, React.FC<Record<string, unknown>>>, {
    get: (_target, prop: string) => {
      if (prop === '$$typeof') return undefined
      return ({ children, ...rest }: Record<string, unknown>) => {
        const Tag = (prop === 'p' ? 'p' : prop === 'h1' ? 'h1' : prop === 'h2' ? 'h2' : prop === 'section' ? 'section' : prop === 'a' ? 'a' : prop === 'button' ? 'button' : prop === 'span' ? 'span' : prop === 'main' ? 'main' : 'div') as React.ElementType
        return <Tag {...rest}>{children as React.ReactNode}</Tag>
      }
    },
  }),
  useReducedMotion: () => true,
}))

const { getComputedStyle } = window
window.getComputedStyle = (elt) => getComputedStyle(elt)
