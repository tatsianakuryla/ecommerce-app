import { Input, Button, Box } from '@chakra-ui/react';
import { FormProps } from '~types/types';
import { ErrorAlert } from '../ErrorAlert/ErrorAlert';

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
              {showError && <ErrorAlert name={name} error={error} />}
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
