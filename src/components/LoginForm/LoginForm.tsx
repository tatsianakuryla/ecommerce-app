import { useState, useEffect } from 'react'
import { useLogin } from '~/hooks/useLogin'
import { Spinner, Alert, Input, Button, Box } from '@chakra-ui/react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldError, setFieldError] = useState({
    email: '',
    password: '',
  })

  const { login, loading, error } = useLogin()

  useEffect(() => {
    if (error === null) return
    const msg = error.toLowerCase()
    const next = { email: '', password: '' }
    if (msg.includes('email')) next.email = error
    if (msg.includes('password')) next.password = error
    if (!next.email && !next.password) {
      next.email = next.password = error
    }
    setFieldError(next)
  }, [error])

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
  }

  return (
    <Box
      as='form'
      onSubmit={handleSubmit}
      style={{ maxWidth: 320, margin: '2rem auto' }}
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
        <Alert.Root status='error' variant='subtle' fontSize='sm' mb={4} px={2}>
          <Alert.Indicator />
          <Alert.Title>{fieldError.email}</Alert.Title>
        </Alert.Root>
      )}

      <Input
        type='password'
        value={password}
        onChange={onPasswordChange}
        placeholder='Password'
        style={{
          width: '100%',
          padding: '0.5rem',
          borderRadius: 4,
          border: '1px solid',
          borderColor: fieldError.password ? 'red' : '#cbd5e0',
          marginBottom: fieldError.password ? 2 : 12,
        }}
      />
      {fieldError.password && (
        <Alert.Root status='error' variant='subtle' fontSize='sm' mb={4} px={2}>
          <Alert.Indicator />
          <Alert.Title>{fieldError.password}</Alert.Title>
        </Alert.Root>
      )}

      {loading ? (
        <Spinner data-testid='spinner' />
      ) : (
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
      )}
    </Box>
  )
}
