import {
  validateCity,
  validateCountry,
  validatePostalCode,
  validateStreet,
} from '~components/Form/RegistrationForm/registrationFormValidation';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
countries.registerLocale(enLocale);
import { AddressFormProperties, FormField } from '~types/types';
import { Box, Heading, Input } from '@chakra-ui/react';
import { Select } from '@chakra-ui/select';
import { ErrorAlert } from '~components/ErrorAlert/ErrorAlert';

const COUNTRY_OPTIONS: Array<{ label: string; value: string }> = Object.entries(
  countries.getNames('en'),
).map(([code, name]) => ({
  label: name,
  value: code,
}));

export function AddressForm({
  addressType,
  data,
  setData,
  fieldError,
  setFieldError,
}: AddressFormProperties) {
  const addressesFields: FormField[] = [
    {
      name: 'streetName',
      value: data.streetName,
      placeholder: 'Street',
      onChange: (value) => {
        setData({ ...data, streetName: value });
        setFieldError((field) => ({ ...field, street: validateStreet(value) }));
      },
      error: fieldError.street,
    },
    {
      name: 'city',
      value: data.city,
      placeholder: 'City',
      onChange: (value) => {
        setData({ ...data, city: value });
        setFieldError((field) => ({ ...field, city: validateCity(value) }));
      },
      error: fieldError.city,
    },
    {
      name: 'postalCode',
      value: data.postalCode,
      placeholder: 'Postal Code',
      onChange: (value) => {
        setData({ ...data, postalCode: value });
        setFieldError((field) => ({
          ...field,
          postalCode: validatePostalCode(value, data.country),
        }));
      },
      error: fieldError.postalCode,
    },
    {
      name: 'country',
      type: 'select',
      options: COUNTRY_OPTIONS,
      value: data.country,
      placeholder: 'Country',
      onChange: (value: string) => {
        setData({ ...data, country: value });
        setFieldError((field) => ({
          ...field,
          country: validateCountry(value),
        }));
      },
      error: fieldError.country,
    },
  ];
  return (
    <>
      <Heading as='h3' size='md' mb={2}>
        {addressType === 'shipping' ? 'Shipping Address' : 'Billing Address'}
      </Heading>
      {addressesFields.map(
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

          return (
            <Box key={name} mb={hasError ? 2 : 4}>
              <Box position='relative' w='full'>
                {type === 'select' ? (
                  <Select
                    id={name}
                    name={name}
                    aria-label={placeholder}
                    maxWidth='382px'
                    icon={<Box />}
                    value={value}
                    onChange={(event) => {
                      onChange(event.target.value);
                    }}
                    placeholder={placeholder}
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
                    type={type}
                    value={value}
                    onChange={(event) => {
                      onChange(event.target.value);
                    }}
                    placeholder={placeholder}
                    borderColor={hasError ? 'red' : undefined}
                  />
                )}
              </Box>

              {hasError && <ErrorAlert name={name} error={error} />}
            </Box>
          );
        },
      )}
    </>
  );
}
