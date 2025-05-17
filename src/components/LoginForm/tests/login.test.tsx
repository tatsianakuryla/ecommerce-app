import fixture from '~fixtures/fixture.json'
import { LoginForm } from '~components/LoginForm/LoginForm'
import {
  render,
  renderHook,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react'
import { useLogin } from '~/hooks/useLogin'
import { Provider } from '~/components/ui/provider'

const renderComponent = (Component: React.FC) => {
  render(
    <Provider>
      <Component />
    </Provider>,
  )
  const emailInput = screen.getByPlaceholderText('Email')
  const passwordInput = screen.getByPlaceholderText('Password')

  return {
    emailInput,
    passwordInput,
  }
}

describe('Login API tests', () => {
  it('should log in with correct credentials', async () => {
    const { result } = renderHook(() => useLogin())

    await act(async () => {
      await result.current.login(
        fixture.correctUsername,
        fixture.correctPassword,
      )
    })

    expect(result.current.authResponseBody).toEqual(
      fixture.mockResponses.successAuth,
    )

    await waitFor(() => {
      expect(localStorage.getItem('access_token')).toEqual(
        fixture.mockResponses.successAuth.access_token,
      )
    })
  })

  it.each([
    {
      desc: 'incorrect password',
      username: fixture.correctUsername,
      password: fixture.incorrectPassword,
    },
    {
      desc: 'incorrect email',
      username: fixture.incorrectUsername,
      password: fixture.correctPassword,
    },
  ])('should not log in with $desc', async ({ username, password }) => {
    const { result } = renderHook(() => useLogin())

    await act(async () => {
      await result.current.login(username, password)
    })

    expect(result.current.error).toEqual(
      fixture.mockResponses.wrongCredentials.message,
    )
    expect(localStorage.getItem('access_token')).toBeNull()
  })

  it('should not log in with empty password', async () => {
    const { result } = renderHook(() => useLogin())

    await act(async () => {
      await result.current.login(fixture.correctUsername, '')
    })

    expect(result.current.error).toEqual(
      fixture.mockResponses.emptyPassword.message,
    )
    expect(localStorage.getItem('access_token')).toBeNull()
  })

  it('should not log in with empty email', async () => {
    const { result } = renderHook(() => useLogin())

    await act(async () => {
      await result.current.login('', fixture.correctPassword)
    })

    expect(result.current.error).toEqual(
      fixture.mockResponses.wrongCredentials.message,
    )
    expect(localStorage.getItem('access_token')).toBeNull()
  })
})

describe('Login UI tests', () => {
  it('should not render error modal after successful login', async () => {
    const { emailInput, passwordInput } = renderComponent(LoginForm)
    const loginButton = screen.getByRole('button', { name: 'Login' })

    fireEvent.change(emailInput, {
      target: { value: fixture.correctUsername },
    })
    fireEvent.change(passwordInput, {
      target: { value: fixture.correctPassword },
    })
    fireEvent.click(loginButton)

    expect(screen.queryByTestId('progress-bar')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByTestId('progress-bar')).not.toBeInTheDocument()
      expect(screen.queryByTestId('error-alert')).not.toBeInTheDocument()
      expect(localStorage.getItem('access_token')).toEqual(
        fixture.mockResponses.successAuth.access_token,
      )
    })
  })

  it('should render error modal after unsuccessful login', async () => {
    const { emailInput, passwordInput } = renderComponent(LoginForm)
    const loginButton = screen.getByRole('button', { name: 'Login' })

    fireEvent.change(emailInput, {
      target: { value: fixture.incorrectUsername },
    })
    fireEvent.change(passwordInput, {
      target: { value: fixture.correctPassword },
    })
    fireEvent.click(loginButton)

    expect(screen.queryByTestId('progress-bar')).toBeInTheDocument()
    expect(await screen.findByTestId('error-alert')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByTestId('progress-bar')).not.toBeInTheDocument()
      expect(screen.queryByTestId('error-alert')).toBeInTheDocument()
      expect(localStorage.getItem('access_token')).toBeNull()
    })
  })
})

describe('LoginForm validation logic', () => {
  const { result } = renderHook(() => {
    const validateEmail = (value: string) => {
      const trimmedValue = value.trim()
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

      if (value !== trimmedValue) return false
      return emailRegex.test(value)
    }

    const validatePassword = (value: string) => {
      const requirements = {
        length: value.length >= 8,
        upper: /[A-Z]/.test(value),
        lower: /[a-z]/.test(value),
        digit: /[0-9]/.test(value),
        special: /[!@#$%^&*]/.test(value),
      }
      return Object.values(requirements).every(Boolean)
    }

    return { validateEmail, validatePassword }
  })

  it('should validate email correctly', () => {
    expect(result.current.validateEmail('  test@test.com  ')).toBe(false)
    expect(result.current.validateEmail('invalid-email')).toBe(false)
    expect(result.current.validateEmail('valid@test.com')).toBe(true)
  })

  it('should validate password strength', () => {
    expect(result.current.validatePassword('weak')).toBe(false)
    expect(result.current.validatePassword('Weak123')).toBe(false)
    expect(result.current.validatePassword('StrongPass123!')).toBe(true)
  })
})
