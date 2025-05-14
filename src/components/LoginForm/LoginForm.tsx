import { useEffect, useState } from 'react'
import { useLogin } from '~/hooks/useLogin'
import { Alert, Input, Button, Box, ProgressCircle } from '@chakra-ui/react'
import { normalizeErrorMessage } from '~/utils/helpers'
import { PasswordInput } from '../InputPassword/InputPassword'
export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldError, setFieldError] = useState({
    email: '',
    password: '',
  })

  const validateEmail = (value: string): boolean => {
    const trimmedValue = value.trim()
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (value !== trimmedValue) {
      setFieldError((prev) => ({
        ...prev,
        email: 'Email must not contain leading or trailing whitespace',
      }))
      return false
    }

    if (!emailRegex.test(value)) {
      setFieldError((prev) => ({
        ...prev,
        email: 'Please enter a valid email address (e.g., user@example.com)',
      }))
      return false
    }

    setFieldError((prev) => ({ ...prev, email: '' }))
    return true
  }

  const validatePassword = (value: string): boolean => {
    const newRequirements = {
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      digit: /[0-9]/.test(value),
      special: /[!@#$%^&*]/.test(value),
    }

    const isValid = Object.values(newRequirements).every((req) => req)
    setFieldError((prev) => ({
      ...prev,
      password: isValid
        ? ''
        : `Password must contain at least 8 characters, 1 number, 1 uppercase letter,
         1 lowercase letter, 1 special character. No leading/trailing whitespace.`,
    }))

    return isValid
  }

  const { login, loading, error } = useLogin()

  useEffect(() => {
    if (error === null) return
    const msg = error.toLowerCase()
    const next = { email: '', password: '' }
    if (msg.includes('email')) next.email = error
    if (msg.includes('password')) {
      next.password = normalizeErrorMessage(error)
    }
    if (!next.email && !next.password) {
      next.email = next.password = error
    }
    setFieldError(next)
  }, [error])

  useEffect(() => {
    if (email) validateEmail(email)
  }, [email])

  useEffect(() => {
    if (password) validatePassword(password)
  }, [password])

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (fieldError.email) {
      setFieldError((fieldError) => ({ ...fieldError, email: '' }))
    }
  }

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (fieldError.password) {
      setFieldError((fieldError) => ({ ...fieldError, password: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void login(email, password)
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (isEmailValid && isPasswordValid) {
      console.log('Form submitted:', { email, password })
    }
  }

  return (
    <>
      <Box
        as='form'
        pos='relative'
        onSubmit={handleSubmit}
        style={
          loading
            ? {
                width: 320,
                margin: '2rem auto',
                filter: 'blur(1px)',
              }
            : { maxWidth: 320, margin: '2rem auto' }
        }
      >
        <Input
          value={email}
          onChange={onEmailChange}
          placeholder='Email'
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: 4,
            border: '1px solid',
            borderColor: fieldError.email ? 'red' : '#cbd5e0',
            marginBottom: fieldError.email ? 2 : 12,
          }}
        />
        {fieldError.email && (
          <Alert.Root
            status='error'
            variant='subtle'
            fontSize='sm'
            mb={4}
            px={2}
          >
            <Alert.Indicator />
            <Alert.Title>{fieldError.email}</Alert.Title>
          </Alert.Root>
        )}
        <PasswordInput
          value={password}
          placeholder='Password'
          onChange={onPasswordChange}
        />
        {/* <Input
          type='password'
          value={password}
          onChange={onPasswordChange}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: 4,
            border: '1px solid',
            borderColor: fieldError.password ? 'red' : '#cbd5e0',
            marginBottom: fieldError.password ? 2 : 12,
          }}
        /> */}
        {fieldError.password && (
          <Alert.Root
            status='error'
            variant='subtle'
            fontSize='sm'
            mb={4}
            px={2}
            data-testid='error-alert'
          >
            <Alert.Indicator />
            <Alert.Title>{fieldError.password}</Alert.Title>
          </Alert.Root>
        )}

        <Button
          type='submit'
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.5rem',
          }}
          data-testid='login-button'
        >
          Login
        </Button>
      </Box>
      {loading ? (
        <ProgressCircle.Root
          value={null}
          pos='absolute'
          data-testid='progress-bar'
        >
          <ProgressCircle.Circle>
            <ProgressCircle.Track />
            <ProgressCircle.Range strokeLinecap='round' />
          </ProgressCircle.Circle>
        </ProgressCircle.Root>
      ) : null}
    </>
  )
}
