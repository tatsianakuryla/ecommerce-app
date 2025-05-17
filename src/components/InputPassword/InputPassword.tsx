import { Input, Alert, Button, Group } from '@chakra-ui/react';
import { useState } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { PasswordInputProps } from '~/types/types';

export function PasswordInput({
  error,
  isTouched,
  hasError,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

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
            setShowPassword(!showPassword);
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
  );
}
