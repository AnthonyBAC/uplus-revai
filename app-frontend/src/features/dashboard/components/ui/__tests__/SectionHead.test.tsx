import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SectionHead from '../ui/SectionHead'

describe('SectionHead', () => {
  it('renderiza título y subtítulo', () => {
    render(<SectionHead title="Resumen" sub="Vista general del negocio" />)
    expect(screen.getByText('Resumen')).toBeInTheDocument()
    expect(screen.getByText('Vista general del negocio')).toBeInTheDocument()
  })

  it('acepta right slot', () => {
    render(<SectionHead title="X" sub="Y" right={<button>Acción</button>} />)
    expect(screen.getByText('Acción')).toBeInTheDocument()
  })
})
