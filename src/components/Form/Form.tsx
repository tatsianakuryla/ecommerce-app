import { useState } from 'react';
import { Input, Button, Box, IconButton } from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FormProperties } from '~types/types';
import { ErrorAlert } from '../ErrorAlert/ErrorAlert';
import { getAutocompleteValue } from '~utils/helpers';

export function Form({
  id,
  fields,
  onSubmit,
  loading = false,
  submitLabel = 'Submit',
  children,
}: FormProperties) {
  const [showMap, setShowMap] = useState<Record<string, boolean>>({});

  const toggleShow = (name: string): void => {
    setShowMap((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };

  const containerStyle = loading
    ? {
        minWidth: 382,
        maxWidth: 382,
        margin: '2rem auto',
        filter: 'blur(1px)',
      }
    : {
        minWidth: 382,
        maxWidth: 382,
        margin: '2rem auto',
      };

  const registrationButtonStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    marginTop: '1rem',
    backgroundColor: 'teal.500',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    opacity: loading ? 0.6 : 1,
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  return (
    <Box
      as='form'
      pos='relative'
      onSubmit={onSubmit}
      style={containerStyle}
      id={id}
    >
      {fields.map(
        ({ name, value, placeholder, onChange, error = '', type = 'text' }) => {
          const hasError = error.trim() !== '';
          const isPasswordField = type === 'password';
          const showPassword = showMap[name];
          const inputType = isPasswordField
            ? showPassword
              ? 'text'
              : 'password'
            : type;

          return (
            <Box key={name} mb={hasError ? 2 : 4}>
              <Box position='relative' w='full'>
                <Input
                  id={name}
                  name={name}
                  autoComplete={getAutocompleteValue(name)}
                  type={inputType}
                  value={value}
                  onChange={(event) => {
                    onChange(event.target.value);
                  }}
                  placeholder={placeholder}
                  pr={isPasswordField ? '2.5rem' : undefined}
                  borderColor={hasError ? 'red' : undefined}
                />
                {isPasswordField && (
                  <IconButton
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
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
      {children}
      <Button
        type='submit'
        disabled={loading}
        data-testid='auth-submit-button'
        cursor={loading ? 'not-allowed' : 'pointer'}
        {...registrationButtonStyle}
      >
        {submitLabel}
      </Button>
    </Box>
  );
}
