// import { useEffect, useRef, useState } from 'react'
// import { Input, Alert, Button, Group, Stack } from "@chakra-ui/react"
// import { BsEye, BsEyeSlash } from "react-icons/bs"
// import { PasswordInputProps } from '~/types/types'

// export function PasswordInput({ value, onChange, onBlur, error, hasError }: PasswordInputProps) {
//   const [showPassword, setShowPassword] = useState(false)
//   const passwordTimerRef = useRef<NodeJS.Timeout | null>(null)

//   useEffect(() => {
//     return () => {
//       if (passwordTimerRef.current) clearTimeout(passwordTimerRef.current)
//     }
//   }, [])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value
//     onChange(value)
//     if (passwordTimerRef.current) clearTimeout(passwordTimerRef.current)
//     passwordTimerRef.current = setTimeout(() => {
//       onBlur()
//     }, 500)
//   }

//   return (
//     <Stack gap='4' align='flex-start' style={{ marginBottom: 12 }}>
//       <Group attached w='full'>
//         <Input
//           flex='1'
//           type={showPassword ? 'text' : 'password'}
//           placeholder='Password'
//           value={value}
//           onChange={handleChange}
//           onBlur={onBlur}
//           autoComplete='current-password'
//           style={{
//             border: '1px solid',
//             borderColor: hasError && error ? 'red' : '#cbd5e0',
//             transition: 'border-color 0.3s ease',
//           }}
//         />
//         <Button
//           type='button'
//           onClick={() =>{ setShowPassword(!showPassword)}}
//           aria-label={showPassword ? 'Hide password' : 'Show password'}
//         >
//           {showPassword ? <BsEye /> : <BsEyeSlash />}
//         </Button>
//       </Group>

//       {hasError && error && (
//         <Alert.Root status='error' variant='subtle' fontSize='sm' mb={4} px={2} data-testid='error-alert'>
//           <Alert.Indicator />
//           <Alert.Title>{error}</Alert.Title>
//         </Alert.Root>
//       )}
//     </Stack>
//   )
// }
import { Input, Alert, Button, Group } from '@chakra-ui/react'
import { ComponentProps, useState } from 'react'
import { BsEye, BsEyeSlash } from 'react-icons/bs'

type PasswordInputProps = ComponentProps<typeof Input> & {
  error?: string
  isTouched: boolean | undefined
  hasError: boolean
}

export function PasswordInput({
  error,
  isTouched,
  hasError,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <Group attached w='full' style={{ marginBottom: 16 }}>
        <Input
          {...props}
          type={showPassword ? 'text' : 'password'}
          style={{
            borderColor: (isTouched ?? false) && hasError ? 'red' : '#cbd5e0',
          }}
        />
        <Button
          type='button'
          onClick={() => {
            setShowPassword(!showPassword)
          }}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <BsEye /> : <BsEyeSlash />}
        </Button>
      </Group>
      {isTouched === true && hasError && (
        <Alert.Root
          status='error'
          variant='subtle'
          fontSize='sm'
          mb={4}
          px={2}
          data-testid='error-alert'
        >
          <Alert.Indicator />
          <Alert.Title>{error}</Alert.Title>
        </Alert.Root>
      )}
    </>
  )
}
