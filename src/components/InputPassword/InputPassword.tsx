import { Field, Button, Group, Input, Stack } from '@chakra-ui/react'
import { useState } from 'react'
interface PasswordInputProps {
  value: string
  placeholder: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  // error,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <Stack
        gap='4'
        align='flex-start'
        style={{
          marginBottom: 12,
        }}
      >
        <Field.Root>
          <Group attached w='full'>
            <Input
              flex='1'
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              style={{
                border: '1px solid',
                // borderColor: error ? 'red' : '#cbd5e0',
              }}
              value={value}
              onChange={(e) => {
                onChange(e)
              }}
              autoComplete='current-password'
            />
            <Button
              type='button'
              onClick={() => {
                setShowPassword(!showPassword)
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁️‍🗨️' : '👁️'}
            </Button>
          </Group>
        </Field.Root>
      </Stack>
      <Field.Root invalid>
        {/*       
         {(
                  <Alert.Root
                    status='error'
                    variant='subtle'
                    fontSize='sm'
                    mb={4}
                    px={2}
                    
                  >
                    <Alert.Indicator />
                    <Alert.Title>{error}</Alert.Title>
                  </Alert.Root>
                )} */}
      </Field.Root>
    </>
  )
}
