import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardPreview from '../DashboardPreview'

describe('DashboardPreview', () => {
  it('renderiza preview del dashboard', () => {
    render(<DashboardPreview />)
    expect(screen.getByText('Resumen')).toBeInTheDocument()
  })
})
