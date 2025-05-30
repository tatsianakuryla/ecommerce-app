import { useState } from 'react';
import { Input, Button, Box, IconButton } from '@chakra-ui/react';
import { Select } from '@chakra-ui/select';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FormProperties } from '~types/types';
import { ErrorAlert } from '../ErrorAlert/ErrorAlert';

const getAutocompleteValue = (name: string): string => {
  const map: Record<string, string> = {
    firstName: 'given-name',
    lastName: 'family-name',
    email: 'email',
    password: 'current-password',
    newPassword: 'new-password',
    phone: 'tel',
  };

  return map[name] ?? 'off';
};

export function Form({
  id,
  fields,
  onSubmit,
  loading = false,
  submitLabel = 'Submit',
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

  return (
    <Box
      as='form'
      pos='relative'
      onSubmit={onSubmit}
      style={containerStyle}
      id={id}
    >
      {fields.map(
        ({
          name,
          value,
          placeholder,
          onChange,
          error = '',
          type = 'text',
          options,
        }) => {
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
                {type === 'select' ? (
                  <Select
                    id={name}
                    name={name}
                    autoComplete={getAutocompleteValue(name)}
                    aria-label={placeholder}
                    maxWidth='382px'
                    icon={<Box />}
                    value={value}
                    onChange={(event) => {
                      onChange(event.target.value);
                    }}
                    placeholder={placeholder}
                    pr={isPasswordField ? '2.5rem' : undefined}
                    variant='outline'
                    borderColor={hasError ? 'red.500' : 'gray.300'}
                    focusBorderColor={hasError ? 'red.500' : 'teal.500'}
                    errorBorderColor='red.500'
                    borderRadius='md'
                    _hover={{ borderColor: hasError ? 'red.500' : 'gray.400' }}
                  >
                    {options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                ) : (
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
                )}
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
