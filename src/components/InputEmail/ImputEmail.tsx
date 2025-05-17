import { Input, Alert } from '@chakra-ui/react';
import { EmailInputProps } from '~/types/types';

export function EmailInput({
  error,
  isTouched,
  hasError,
  ...props
}: EmailInputProps) {
  console.log('EmailInput props:', { error, isTouched, hasError });
  return (
    <>
      <Input
        {...props}
        type='email'
        onBlur={(e) => {
          e.target.value = e.target.value.trim();
          props.onBlur?.(e);
        }}
        style={{
          borderColor: (isTouched ?? false) && hasError ? 'red' : '#cbd5e0',
          marginBottom: (isTouched ?? false) && hasError ? '0.5rem' : '1.6rem',
        }}
      />
      {isTouched === true && hasError && (
        <Alert.Root status='error' variant='subtle' fontSize='sm' mb={4} px={2}>
          <Alert.Indicator />
          <Alert.Title>{error}</Alert.Title>
        </Alert.Root>
      )}
    </>
  );
}
