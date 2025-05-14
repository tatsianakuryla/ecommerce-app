import React, { useState, useEffect } from 'react'
import { Button, Box } from '@chakra-ui/react'
import { EmailInput } from '../InputEmail/InputEmil'
import { PasswordInput } from '../InputPassword/InputPassword'

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  })

  const validateEmail = (value: string): boolean => {
    const trimmedValue = value.trim()
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (value !== trimmedValue) {
      setErrors((prev) => ({
        ...prev,
        email: 'Email must not contain leading or trailing whitespace',
      }))
      return false
    }

    if (!emailRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        email: 'Please enter a valid email address (e.g., user@example.com)',
      }))
      return false
    }

    setErrors((prev) => ({ ...prev, email: '' }))
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
    setErrors((prev) => ({
      ...prev,
      password: isValid
        ? ''
        : `Password must contain at least 8 characters, 1 number, 1 uppercase letter,
         1 lowercase letter, 1 special character. No leading/trailing whitespace.`,
    }))

    return isValid
  }

  useEffect(() => {
    if (email) validateEmail(email)
  }, [email])

  useEffect(() => {
    if (password) validatePassword(password)
  }, [password])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (isEmailValid && isPasswordValid) {
      console.log('Form submitted:', { email, password })
    }
  }

  return (
    <Box as='form' maxW='md' onSubmit={handleSubmit} paddingTop='10' mx='auto'>
      <EmailInput value={email} onChange={setEmail} error={errors.email} />
      <PasswordInput
        value={password}
        onChange={setPassword}
        error={errors.password}
      />
      <Box marginTop='4'>
        <Button type='submit' colorPalette={'green'}>
          Submit
        </Button>
      </Box>
    </Box>
  )
}
