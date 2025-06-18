import { useState } from 'react';
import { Input, Button, Box, IconButton } from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FormProperties } from '~types/types';
import { ErrorAlert } from '../ErrorAlert/ErrorAlert';
import { getAutocompleteValue } from '~utils/helpers';
import {
  formContainerStyle,
  formIconStyle,
  registrationButtonStyle,
} from '~/styles/style';

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

  return (
    <Box
      as='form'
      id={id}
      onSubmit={onSubmit}
      {...formContainerStyle}
      filter={loading ? 'blur(1px)' : 'none'}
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
                    size='sm'
                    variant='ghost'
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    onClick={() => {
                      toggleShow(name);
                    }}
                    {...formIconStyle}
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
        {...registrationButtonStyle}
        opacity={loading ? 0.6 : 1}
        cursor={loading ? 'not-allowed' : 'pointer'}
      >
        {submitLabel}
      </Button>
    </Box>
  );
}
