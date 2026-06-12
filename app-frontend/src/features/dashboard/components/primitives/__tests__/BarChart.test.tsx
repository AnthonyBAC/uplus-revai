import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BarChart, { BarDatum } from '../BarChart'

const sampleData: BarDatum[] = [
  { label: '5★', value: 10, color: 'var(--good)' },
  { label: '4★', value: 7, color: 'var(--good)' },
  { label: '3★', value: 3, color: 'var(--warn)' },
  { label: '2★', value: 1, color: 'var(--bad)' },
  { label: '1★', value: 0, color: 'var(--bad)' },
]

describe('BarChart', () => {
  it('renderiza SVG', () => {
    const { container } = render(<BarChart data={sampleData} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renderiza etiquetas del eje X', () => {
    render(<BarChart data={sampleData} />)
    expect(screen.getByText('5★')).toBeInTheDocument()
    expect(screen.getByText('3★')).toBeInTheDocument()
    expect(screen.getByText('1★')).toBeInTheDocument()
  })

  it('modo horizontal', () => {
    const { container } = render(<BarChart data={sampleData} horizontal />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('formatea valores con formatY', () => {
    render(<BarChart data={sampleData} formatY={(v) => `${v}k`} />)
    expect(screen.getByText('0k')).toBeInTheDocument()
  })

  it('array vacío no rompe', () => {
    const { container } = render(<BarChart data={[]} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
