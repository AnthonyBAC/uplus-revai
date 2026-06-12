import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from '../Badge'

describe('Badge', () => {
  it('renderiza children', () => {
    render(<Badge>Activo</Badge>)
    expect(screen.getByText('Activo')).toBeInTheDocument()
  })

  it('tone=accent por defecto', () => {
    render(<Badge>X</Badge>)
    expect(screen.getByText('X').className).toContain('accent')
  })

  it('aplica tone especificado', () => {
    render(<Badge tone="good">OK</Badge>)
    expect(screen.getByText('OK').className).toContain('good')
  })

  it('aplica tone warn', () => {
    render(<Badge tone="warn">Warn</Badge>)
    expect(screen.getByText('Warn').className).toContain('warn')
  })

  it('aplica tone bad', () => {
    render(<Badge tone="bad">Bad</Badge>)
    expect(screen.getByText('Bad').className).toContain('bad')
  })

  it('size=md por defecto', () => {
    render(<Badge>X</Badge>)
    expect(screen.getByText('X').className).toContain('md')
  })

  it('size=sm', () => {
    render(<Badge size="sm">X</Badge>)
    expect(screen.getByText('X').className).toContain('sm')
  })
})
