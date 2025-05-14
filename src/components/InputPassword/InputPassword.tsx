import { Field, Button, Group, Input, Stack, Box } from '@chakra-ui/react'
import { useState } from 'react'
interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Box>
      <Stack gap='4' align='flex-start' maxW='sm'>
        <Field.Root>
          <Field.Label>Password</Field.Label>
          <Group attached w='full'>
            <Input
              flex='1'
              css={{ '--focus-color': 'green' }}
              type={showPassword ? 'text' : 'password'}
              id='password'
              value={value}
              onChange={(e) => {
                onChange(e.target.value)
              }}
              autoComplete='current-password'
            />
            <Button
              type='button'
              onClick={() => {
                setShowPassword(!showPassword)
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              colorPalette={'green'}
            >
              {showPassword ? '👁️‍🗨️' : '👁️'}
            </Button>
          </Group>
        </Field.Root>
      </Stack>
      <Field.Root marginTop='2' invalid>
        {<Field.ErrorText maxW='sm'>{error}</Field.ErrorText>}
      </Field.Root>
    </Box>
  )
}
