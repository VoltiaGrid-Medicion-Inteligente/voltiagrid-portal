import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('shows the customer portal home page', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /portal del cliente/i })).toBeInTheDocument()
  })
})
