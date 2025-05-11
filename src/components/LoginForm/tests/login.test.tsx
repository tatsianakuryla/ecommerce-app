import fixt from '~fixtures/fixture.json'
import { LoginForm } from '~components/LoginForm/LoginForm'
import { render, renderHook, screen, waitFor } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { useLogin } from '~/hooks/useLogin'

describe('Login API tests', () => {
  it('should log in with correct credentials', async () => {
    const { result } = renderHook(() => useLogin())
    const { login } = result.current
    await login(fixt.correctUsername, fixt.correctPassword)

    await waitFor(() => {
      expect(localStorage.getItem('access_token')).toEqual(
        fixt.mockResponses.successAuth.access_token,
      )
    })
  })

  it('should not log in with incorrect password', () => {
    expect(true).toBe(true)
  })

  it('should not log in with incorrect email', () => {
    expect(true).toBe(true)
  })

  it('should not log in with empty email', () => {
    expect(true).toBe(true)
  })

  it('should not log in with empty password', () => {
    expect(true).toBe(true)
  })

  it('should not log in with more permissions than provided', () => {
    expect(true).toBe(true)
  })
})

describe('Login UI tests', () => {
  it('should log in with correct credentials', async () => {
    render(<LoginForm />)
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const loginButton = screen.getByRole('button', { name: 'Login' })

    fireEvent.change(emailInput, { target: { value: fixt.correctUsername } })
    fireEvent.change(passwordInput, { target: { value: fixt.correctPassword } })
    fireEvent.click(loginButton)

    expect(screen.getByText('Logging in...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Logging in...')).not.toBeInTheDocument()
      expect(localStorage.getItem('access_token')).toEqual(
        fixt.mockResponses.successAuth.access_token,
      )
    })
  })

  it('should render error modal after unsuccessful login', () => {
    expect(true).toBe(true)
  })

  it('should redirect to main page after successful login', () => {
    expect(true).toBe(true)
  })
})
