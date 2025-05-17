import { useEffect, useState, useRef, useCallback } from 'react'
import { useLogin } from '~/hooks/useLogin'
import {
  Alert,
  Input,
  Button,
  Box,
  ProgressCircle,
  Stack,
  Group,
} from '@chakra-ui/react'
import { normalizeErrorMessage } from '~/utils/helpers'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldError, setFieldError] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isTouched, setIsTouched] = useState({
    email: false,
    password: false,
  })

  const emailTimerRef = useRef<NodeJS.Timeout | null>(null)
  const passwordTimerRef = useRef<NodeJS.Timeout | null>(null)

  const validateEmail = useCallback((value: string): boolean => {
    const trimmedValue = value.trim()
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
  }, [])

  const validatePassword = useCallback((value: string): boolean => {
    const newRequirements = {
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      digit: /[0-9]/.test(value),
      special: /[!@#$%^&*]/.test(value),
    }

    const isValid = Object.values(newRequirements).every(Boolean)
    setFieldError((prev) => ({
      ...prev,
      password: isValid
        ? ''
        : `Password must contain at least 8 characters, 1 number, 1 uppercase letter,
         1 lowercase letter, 1 special character. No leading or trailing whitespace.`,
    }))

    return isValid
  }, [])

  const { login, loading, error } = useLogin()

  useEffect(() => {
    if (error === null) return

    const msg = error.toLowerCase()
    const next = { email: '', password: '' }

    if (msg.includes('email')) next.email = error
    if (msg.includes('password')) next.password = normalizeErrorMessage(error)
    if (!next.email && !next.password) next.email = next.password = error

    setFieldError(next)
  }, [error])

  useEffect(() => {
    return () => {
      if (emailTimerRef.current) clearTimeout(emailTimerRef.current)
      if (passwordTimerRef.current) clearTimeout(passwordTimerRef.current)
    }
  }, [])

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setIsTouched((prev) => ({ ...prev, email: true }))
    if (emailTimerRef.current) clearTimeout(emailTimerRef.current)

    emailTimerRef.current = setTimeout(() => {
      validateEmail(value)
    }, 500)
  }

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    setIsTouched((prev) => ({ ...prev, password: true }))

    if (passwordTimerRef.current) clearTimeout(passwordTimerRef.current)

    passwordTimerRef.current = setTimeout(() => {
      validatePassword(value)
    }, 500)
  }

  const handleBlur = (field: 'email' | 'password') => {
    setIsTouched((prev) => ({ ...prev, [field]: true }))
    if (field === 'email') validateEmail(email)
    else validatePassword(password)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsTouched({ email: true, password: true })

    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (isEmailValid && isPasswordValid) {
      void login(email, password)
    }
  }

  const shouldShowError = (field: 'email' | 'password') =>
    isTouched[field] || (error != null && fieldError[field])

  return (
    <>
      <Box
        as='form'
        pos='relative'
        onSubmit={handleSubmit}
        style={{
          maxWidth: 320,
          width: '100%',
          margin: '2rem auto',
          ...(loading && { filter: 'blur(1px)' }),
        }}
      >
        <Input
          value={email}
          onChange={onEmailChange}
          onBlur={() => {
            handleBlur('email')
          }}
          placeholder='Email'
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: 4,
            border: '1px solid',
            borderColor:
              Boolean(shouldShowError('email')) && fieldError.email
                ? 'red'
                : '#cbd5e0',
            marginBottom:
              Boolean(shouldShowError('email')) && fieldError.email ? 2 : 12,
            transition: 'border-color 0.3s ease', // Плавное изменение цвета
          }}
        />
        {Boolean(shouldShowError('email')) && fieldError.email && (
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

        <Stack gap='4' align='flex-start' style={{ marginBottom: 12 }}>
          <Group attached w='full'>
            <Input
              flex='1'
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={password}
              onChange={onPasswordChange}
              onBlur={() => {
                handleBlur('password')
              }}
              autoComplete='current-password'
              style={{
                border: '1px solid',
                borderColor:
                  Boolean(shouldShowError('password')) && fieldError.password
                    ? 'red'
                    : '#cbd5e0',
                transition: 'border-color 0.3s ease',
              }}
            />
            <Button
              type='button'
              onClick={() => {
                setShowPassword(!showPassword)
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🗨️' : '👁️'}
            </Button>
          </Group>
        </Stack>

        {Boolean(shouldShowError('password')) && fieldError.password && (
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
            transition: 'opacity 0.3s ease',
            opacity: loading ? 0.7 : 1,
          }}
          data-testid='login-button'
        >
          Login
        </Button>
      </Box>

      {loading && (
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
      )}
    </>
  )
}
