// import { useEffect, useRef } from 'react'
// import { Input, Alert } from "@chakra-ui/react"
// import { EmailInputProps } from '~/types/types'

// export function EmailInput({ value, onChange, onBlur, error,  hasError }: EmailInputProps) {
//   const emailTimerRef = useRef<NodeJS.Timeout | null>(null)

//   useEffect(() => {
//     return () => {
//       if (emailTimerRef.current) clearTimeout(emailTimerRef.current)
//     }
//   }, [])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value
//     onChange(value)
//     if (emailTimerRef.current) clearTimeout(emailTimerRef.current)
//     emailTimerRef.current = setTimeout(() => {onBlur()}, 500)
//   }

//   return (
//     <>
//       <Input
//         value={value}
//         onChange={handleChange}
//         onBlur={onBlur}
//         placeholder='Email'
//         style={{
//           width: '100%',
//           padding: '0.5rem',
//           borderRadius: 4,
//           border: '1px solid',
//           borderColor: hasError && error ? 'red' : '#cbd5e0',
//           marginBottom: hasError && error ? 2 : 12,
//           transition: 'border-color 0.3s ease',
//         }}
//       />
//       {hasError && error && (
//         <Alert.Root status='error' variant='subtle' fontSize='sm' mb={4} px={2}>
//           <Alert.Indicator />
//           <Alert.Title>{error}</Alert.Title>
//         </Alert.Root>
//       )}
//     </>
//   )
// }

import { Input, Alert } from '@chakra-ui/react'
import { ComponentProps } from 'react'

type EmailInputProps = ComponentProps<typeof Input> & {
  error?: string
  isTouched: boolean | undefined
  hasError: boolean
}

export function EmailInput({
  error,
  isTouched,
  hasError,
  ...props
}: EmailInputProps) {
  return (
    <div className='mb-4'>
      <Input
        {...props}
        type='email'
        style={{
          borderColor: (isTouched ?? false) && hasError ? 'red' : '#cbd5e0',
          marginBottom: (isTouched ?? false) && hasError ? '0.5rem' : '1rem',
        }}
      />
      {(isTouched ?? false) && hasError && (
        <Alert.Root status='error' variant='subtle' fontSize='sm' mb={4} px={2}>
          <Alert.Indicator />
          <Alert.Title>{error}</Alert.Title>
        </Alert.Root>
      )}
    </div>
  )
}
