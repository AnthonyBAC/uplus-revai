import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Icon from '../Icon'

describe('Icon', () => {
  it('renderiza icono star', () => {
    const { container } = render(<Icon name="star" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('retorna null para nombre inválido', () => {
    const { container } = render(<Icon name={'invalid' as IconName} />)
    expect(container.querySelector('svg')).toBeNull()
  })

  it('aplica size por defecto 18', () => {
    const { container } = render(<Icon name="home" />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('width')).toBe('18')
    expect(svg.getAttribute('height')).toBe('18')
  })

  it('aplica size personalizado', () => {
    const { container } = render(<Icon name="home" size={24} />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('width')).toBe('24')
  })

  it('aplica strokeWidth por defecto 1.6', () => {
    const { container } = render(<Icon name="star" />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('stroke-width')).toBe('1.6')
  })

  it('aplica strokeWidth personalizado', () => {
    const { container } = render(<Icon name="star" stroke={2.5} />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('stroke-width')).toBe('2.5')
  })

  it('renderiza todos los iconos del mapa', () => {
    const names = ['bar', 'star', 'trend', 'eye', 'home', 'bell', 'search', 'chevron', 'chevronDown', 'plus', 'check', 'x', 'arrow', 'flag', 'clock', 'user', 'msg', 'filter', 'sparkle', 'spark', 'play', 'dots', 'cal', 'settings', 'pin', 'download', 'refresh', 'file', 'menu'] as const
    for (const name of names) {
      const { container, unmount } = render(<Icon name={name} />)
      expect(container.querySelector('svg')).toBeTruthy()
      unmount()
    }
  })
})
