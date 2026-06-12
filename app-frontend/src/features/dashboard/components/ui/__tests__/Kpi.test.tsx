import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Kpi from '../Kpi'

describe('Kpi', () => {
  it('renderiza label y value', () => {
    render(<Kpi label="Reseñas" value={42} />)
    expect(screen.getByText('Reseñas')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renderiza sub si se pasa', () => {
    render(<Kpi label="Total" value={100} sub="+12% este mes" />)
    expect(screen.getByText('+12% este mes')).toBeInTheDocument()
  })

  it('no renderiza sub si no se pasa', () => {
    render(<Kpi label="Total" value={100} />)
    const subElements = screen.queryByText(/mes/)
    expect(subElements).toBeNull()
  })

  it('aplica color accent al sub', () => {
    render(<Kpi label="X" value={1} sub="sub" accent="#00ff00" />)
    expect(screen.getByText('sub').style.color).toBe('#00ff00')
  })

  it('acepta value string', () => {
    render(<Kpi label="Nota" value="4.8" />)
    expect(screen.getByText('4.8')).toBeInTheDocument()
  })
})
