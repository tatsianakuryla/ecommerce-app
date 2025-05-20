import { useState } from 'react';
import { Input, Button, Box, IconButton } from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FormProps } from '~types/types';
import { ErrorAlert } from '../ErrorAlert/ErrorAlert';

export function Form({
  fields,
  onSubmit,
  loading = false,
  submitLabel = 'Submit',
}: FormProps) {
  const [showMap, setShowMap] = useState<Record<string, boolean>>({});

  const toggleShow = (name: string): void => {
    setShowMap((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const containerStyle = loading
    ? {
        minWidth: 320,
        maxWidth: 320,
        margin: '2rem auto',
        filter: 'blur(1px)',
      }
    : {
        minWidth: 320,
        maxWidth: 320,
        margin: '2rem auto',
      };

  return (
    <Box as='form' pos='relative' onSubmit={onSubmit} style={containerStyle}>
      {fields.map(
        ({ name, value, placeholder, onChange, error = '', type = 'text' }) => {
          const hasError = error.trim() !== '';
          const isPasswordField = type === 'password';
          const showPassword = !!showMap[name];
          const inputType = isPasswordField
            ? showPassword
              ? 'text'
              : 'password'
            : type;

          return (
            <Box key={name} mb={hasError ? 2 : 4}>
              {/* Блок только для инпута + глазика */}
              <Box position='relative' w='full'>
                <Input
                  type={inputType}
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value);
                  }}
                  placeholder={placeholder}
                  boxSizing='border-box'
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    paddingRight: isPasswordField ? '2.5rem' : '0.5rem',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: hasError ? 'red' : '#cbd5e0',
                  }}
                />
                {isPasswordField && (
                  <IconButton
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    // иконка как children, чтобы не было TS-ошибки
                    position='absolute'
                    right='0.5rem'
                    top='50%'
                    transform='translateY(-50%)'
                    size='sm'
                    variant='ghost'
                    onClick={() => {
                      toggleShow(name);
                    }}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </IconButton>
                )}
              </Box>

              {hasError && <ErrorAlert name={name} error={error} />}
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
