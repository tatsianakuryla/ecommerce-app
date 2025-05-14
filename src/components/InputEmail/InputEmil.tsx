import React from 'react'
import { Field, Input, Stack } from '@chakra-ui/react'

interface EmailInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <Stack align='flex-start' maxW='sm'>
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Input
          css={{ '--focus-color': 'green' }}
          type='text'
          id='email'
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
          }}
          autoComplete='email'
        />
      </Field.Root>
      <Field.Root marginBottom='1' invalid>
        {<Field.ErrorText>{error}</Field.ErrorText>}
      </Field.Root>
    </Stack>
  )
}
