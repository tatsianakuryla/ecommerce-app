import { Input, Button, Box, Alert } from '@chakra-ui/react';
import { FormProps } from '~types/types';

export function Form({
  fields,
  onSubmit,
  loading = false,
  submitLabel = 'Submit',
}: FormProps) {
  return (
    <Box
      as='form'
      pos='relative'
      onSubmit={onSubmit}
      style={
        loading
          ? {
              minWidth: 320,
              maxWidth: 320,
              margin: '2rem auto',
              filter: 'blur(1px)',
            }
          : { minWidth: 320, maxWidth: 320, margin: '2rem auto' }
      }
    >
      {fields.map(
        ({ name, value, placeholder, onChange, error, type = 'text' }) => {
          const showError = error !== undefined && error.trim() !== '';
          return (
            <Box key={name} mb={showError ? 2 : 4}>
              <Input
                type={type}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
                placeholder={placeholder}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: showError ? 'red' : '#cbd5e0',
                }}
              />
              {showError && (
                <Alert.Root
                  status='error'
                  variant='subtle'
                  fontSize='sm'
                  mb={4}
                  px={2}
                  data-testid={`error-alert-${name}`}
                >
                  <Alert.Indicator />
                  <Alert.Title>{error}</Alert.Title>
                </Alert.Root>
              )}
            </Box>
          );
        },
      )}

      <Button
        type='submit'
        disabled={loading}
        style={{ width: '100%', padding: '0.5rem' }}
        data-testid='auth-submit-button'
      >
        {submitLabel}
      </Button>
    </Box>
  );
}
