import { useState } from 'react'
import { useLogin } from '~/hooks/useLogin'
import { Spinner } from '@chakra-ui/react'
import { Alert } from '@chakra-ui/react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useLogin()
  const handleLogin = () => {
    void login(email, password)
  }

  return (
    <div>
      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
        }}
        placeholder='Email'
      />
      <input
        type='password'
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
        }}
        placeholder='Password'
      />
      {loading ? (
        <Spinner data-testid='spinner' />
      ) : (
        <button onClick={handleLogin} disabled={loading}>
          Login
        </button>
      )}

      {error != null ? (
        <Alert.Root
          status='error'
          data-testid='error-alert'
          title={error}
          fontSize='md'
        >
          <Alert.Indicator />
          <Alert.Title />
          {error} <Alert.Title />
        </Alert.Root>
      ) : null}
    </div>
  )
}
