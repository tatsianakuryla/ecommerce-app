import { useState } from 'react'
import { useLogin } from '~/hooks/useLogin'

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
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error != null ? <p style={{ color: 'red' }}>{error}</p> : null}
    </div>
  )
}
