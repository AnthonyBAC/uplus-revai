import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReviewCard from '../ReviewCard'
import type { ReviewItem } from '../ReviewCard'

const review: ReviewItem = {
  id: 'r1', name: 'Ana Pérez', initial: 'A', rating: 4, date: '1 jun', source: 'Google',
  text: 'Muy buena atención', tags: [], reply: null,
}
const replied: ReviewItem = { ...review, reply: 'Gracias por tu comentario' }

describe('ReviewCard', () => {
  it('muestra nombre, rating y texto', () => {
    render(<ReviewCard r={review} onReply={vi.fn()} />)
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument()
    expect(screen.getByText('Muy buena atención')).toBeInTheDocument()
  })

  it('muestra botón responder si no hay reply', () => {
    render(<ReviewCard r={review} onReply={vi.fn()} />)
    expect(screen.getByText('Responder')).toBeInTheDocument()
  })

  it('muestra reply si existe', () => {
    render(<ReviewCard r={replied} onReply={vi.fn()} />)
    expect(screen.getByText('Tu respuesta')).toBeInTheDocument()
    expect(screen.getByText('Gracias por tu comentario')).toBeInTheDocument()
  })

  it('abre textarea al clickear responder y llama onReply', async () => {
    const onReply = vi.fn()
    render(<ReviewCard r={review} onReply={onReply} />)
    await userEvent.click(screen.getByText('Responder'))
    expect(screen.getByPlaceholderText('Escribe una respuesta…')).toBeInTheDocument()
    await userEvent.type(screen.getByPlaceholderText('Escribe una respuesta…'), 'Hola!')
    await userEvent.click(screen.getByText('Enviar'))
    expect(onReply).toHaveBeenCalledWith('Hola!')
  })
})
