import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

function Saludar({ nombre }: { nombre: string }) {
  return <h1>Hola {nombre}</h1>
}

describe('setup de testing', () => {
  it('renderiza un componente simple', () => {
    render(<Saludar nombre="Mundo" />)
    expect(screen.getByText('Hola Mundo')).toBeInTheDocument()
  })

  it('jest-dom matchers funcionan', () => {
    render(<button disabled>Click</button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
