// import { useState, useCallback, useEffect } from 'react'
// import { useLogin } from '~/hooks/useLogin'
// import { EmailInput } from '../InputEmail/ImputEmail'
// import { PasswordInput } from '../InputPassword/InputPassword'
// import {

//   Button,
//   Box,
//   ProgressCircle,

// } from "@chakra-ui/react"
// import { normalizeErrorMessage } from '~/utils/helpers'
// import { ProgressCircleElement } from '../Progress-circle/Progress-circle'

// export function LoginForm() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [fieldError, setFieldError] = useState({
//     email: '',
//     password: '',
//   })
//   const [isTouched, setIsTouched] = useState({
//     email: false,
//     password: false,
//   })

//   const { login, loading, error } = useLogin()

//   const validateEmail = useCallback((value: string): boolean => {
//     const trimmedValue = value.trim()
//     const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

//     if (value !== trimmedValue) {
//       setFieldError(prev => ({
//         ...prev,
//         email: 'Email must not contain leading or trailing whitespace',
//       }))
//       return false
//     }

//     if (!emailRegex.test(value)) {
//       setFieldError(prev => ({
//         ...prev,
//         email: 'Please enter a valid email address (e.g., user@example.com)',
//       }))
//       return false
//     }

//     setFieldError(prev => ({ ...prev, email: '' }))
//     return true
//   }, [])

//   const validatePassword = useCallback((value: string): boolean => {
//     const newRequirements = {
//       length: value.length >= 8,
//       upper: /[A-Z]/.test(value),
//       lower: /[a-z]/.test(value),
//       digit: /[0-9]/.test(value),
//       special: /[!@#$%^&*]/.test(value),
//     }

//     const isValid = Object.values(newRequirements).every(Boolean)
//     setFieldError(prev => ({
//       ...prev,
//       password: isValid
//         ? ''
//         : `Password must contain at least 8 characters, 1 number, 1 uppercase letter,
//          1 lowercase letter, 1 special character. No leading or trailing whitespace.`,
//     }))

//     return isValid
//   }, [])

//   useEffect(() => {
//     if (error === null) return

//     const msg = error.toLowerCase()
//     const next = { email: '', password: '' }

//     if (msg.includes('email')) next.email = error
//     if (msg.includes('password')) next.password = normalizeErrorMessage(error)
//     if (!next.email && !next.password) next.email = next.password = error

//     setFieldError(next)
//   }, [error])

//   const handleBlur = (field: 'email' | 'password') => {
//     setIsTouched(prev => ({ ...prev, [field]: true }))
//     if (field === 'email') {
//       validateEmail(email)
//     } else {
//       validatePassword(password)
//     }
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsTouched({ email: true, password: true })

//     const isEmailValid = validateEmail(email)
//     const isPasswordValid = validatePassword(password)

//     if (isEmailValid && isPasswordValid) {
//       void login(email, password)
//     }
//   }

//   const shouldShowError = (field: 'email' | 'password') => {
//     return isTouched[field] || (error != null && fieldError[field])
//   }

//   return (
//     <>
//       <Box
//         as='form'
//         pos='relative'
//         onSubmit={handleSubmit}
//         style={{
//           maxWidth: 320,
//           width: '100%',
//           margin: '2rem auto',
//           ...(loading && { filter: 'blur(1px)' }),
//         }}
//       >
//         <EmailInput
//           value={email}
//           onChange={setEmail}
//           onBlur={() => { handleBlur('email') }}
//           error={fieldError.email}
//           isTouched={isTouched.email}
//           hasError={Boolean(shouldShowError('email'))}
//         />

//         <PasswordInput
//           value={password}
//           onChange={setPassword}
//           onBlur={() => { handleBlur('password') }}
//           error={fieldError.password}
//           isTouched={isTouched.password}
//           hasError={Boolean(shouldShowError('password'))}
//         />

//         <Button
//           type='submit'
//           disabled={loading}
//           style={{
//             width: '100%',
//             padding: '0.5rem',
//             transition: 'opacity 0.3s ease',
//             opacity: loading ? 0.7 : 1,
//           }}
//           data-testid='login-button'
//         >
//           Login
//         </Button>
//       </Box>

//       {loading && (
//         <ProgressCircle.Root value={null} pos='absolute' data-testid='progress-bar'>
//           <ProgressCircle.Circle>
//             <ProgressCircle.Track />
//             <ProgressCircle.Range strokeLinecap='round' />
//           </ProgressCircle.Circle>
//         </ProgressCircle.Root>
//       )}
//       {loading ? <ProgressCircleElement /> : null}
//     </>
//   )
// }

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginFormData, loginSchema } from '~/hooks/login-schema'
import { useLogin } from '~/hooks/useLogin'
import { EmailInput } from '../InputEmail/ImputEmail'
import { PasswordInput } from '../InputPassword/InputPassword'
import { Alert, Button, ProgressCircle } from '@chakra-ui/react'
import { ProgressCircleElement } from '../Progress-circle/Progress-circle'
import { useEffect } from 'react'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
    criteriaMode: 'all',
  })

  const { login, loading, error } = useLogin()

  useEffect(() => {
    if (error == null) return

    if (error.toLowerCase().includes('email')) {
      setError('email', { message: error })
    } else if (error.toLowerCase().includes('password')) {
      setError('password', { message: error })
    } else {
      setError('root', { message: error })
    }
  }, [error, setError])

  const onSubmit = async (data: LoginFormData) => {
    clearErrors()
    await login(data.email, data.password)
  }

  // const onSubmit = useCallback(async (data: LoginFormData) => {
  //   clearErrors();
  //   try {
  //     await login(data.email, data.password);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, [login, clearErrors]);
  return (
    <>
      <form
        // pos="relative"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(onSubmit)(e).catch((err: unknown) => {
            console.error(err)
          })
        }}
        style={{
          maxWidth: 320,
          width: '100%',
          margin: '2rem auto',
          ...(loading && { filter: 'blur(1px)' }),
        }}
      >
        <EmailInput
          {...register('email')}
          error={errors.email?.message}
          isTouched={touchedFields.email}
          hasError={!!errors.email}
        />
        {errors.root && (
          <Alert.Root
            status='error'
            variant='subtle'
            fontSize='sm'
            mb={4}
            px={2}
            data-testid='error-alert'
          >
            <Alert.Indicator />
            <Alert.Title>{errors.root.message}</Alert.Title>
          </Alert.Root>
        )}
        <PasswordInput
          {...register('password')}
          error={errors.password?.message}
          isTouched={touchedFields.password}
          hasError={!!errors.password}
        />

        {errors.root && (
          <Alert.Root
            status='error'
            variant='subtle'
            fontSize='sm'
            mb={4}
            px={2}
            data-testid='error-alert'
          >
            <Alert.Indicator />
            <Alert.Title>{errors.root.message}</Alert.Title>
          </Alert.Root>
        )}

        <Button
          type='submit'
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '0.5rem',
            transition: 'opacity 0.3s ease',
            opacity: isSubmitting ? 0.7 : 1,
          }}
          data-testid='login-button'
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      {isSubmitting && (
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
      {isSubmitting && <ProgressCircleElement />}
    </>
  )
}
