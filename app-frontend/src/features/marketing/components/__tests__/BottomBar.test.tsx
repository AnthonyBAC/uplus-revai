import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BottomBar from '../BottomBar'

describe('BottomBar', () => {
  it('renderiza pasos', () => {
    render(<BottomBar />)
    expect(screen.getByText('Conectas tus reseñas')).toBeInTheDocument()
    expect(screen.getByText('La IA encuentra patrones')).toBeInTheDocument()
    expect(screen.getByText('Plan semanal')).toBeInTheDocument()
  })
})
