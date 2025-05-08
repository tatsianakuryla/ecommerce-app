import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/router/tests/helpers/renderWithRouter'
import '@testing-library/jest-dom'
import { AppRoutes } from '@/router/App-routes.tsx'

describe('Routing', () => {
  it('redirects / to /main', async () => {
    renderWithRouter(<AppRoutes />, { initialEntries: ['/'] })
    expect(
      await screen.findByRole('heading', { level: 2, name: /main page/i }),
    ).toBeInTheDocument()
  })

  it('renders 404 page for unknown route', async () => {
    renderWithRouter(<AppRoutes />, { initialEntries: ['/unknown'] })

    expect(
      await screen.findByRole('heading', { level: 2, name: /not found page/i }),
    ).toBeInTheDocument()
  })

  it('renders about page for "/about" route', async () => {
    renderWithRouter(<AppRoutes />, { initialEntries: ['/about'] })

    expect(
      await screen.findByRole('heading', { level: 2, name: /about page/i }),
    ).toBeInTheDocument()
  })

  it('renders register page for "/register" route', async () => {
    renderWithRouter(<AppRoutes />, { initialEntries: ['/register'] })

    expect(
      await screen.findByRole('heading', { level: 2, name: /register page/i }),
    ).toBeInTheDocument()
  })

  it('renders register page for "/login" route', async () => {
    renderWithRouter(<AppRoutes />, { initialEntries: ['/login'] })

    expect(
      await screen.findByRole('heading', { level: 2, name: /login page/i }),
    ).toBeInTheDocument()
  })
})
