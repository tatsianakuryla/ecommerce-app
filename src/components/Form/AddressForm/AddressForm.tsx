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
import { Box, Heading, Input, Checkbox } from '@chakra-ui/react';
import { Select } from '@chakra-ui/select';
import { ErrorAlert } from '~components/ErrorAlert/ErrorAlert';

const COUNTRY_OPTIONS: Array<{ label: string; value: string }> = Object.entries(
  countries.getNames('en'),
).map(([code, name]) => ({
  label: name,
  value: code,
}));

const addressLabels = {
  shipping: 'Shipping Address',
  billing: 'Billing Address',
  main: 'Main Address',
};

export function AddressForm({
  addressType,
  data,
  setData,
  fieldError,
  setFieldError,
  handleDefaultShippingAddress,
  handleDefaultBillingAddress,
}: AddressFormProperties) {
  const isShippingAddress = addressType === 'shipping';
  const prefix = isShippingAddress ? 'shipping' : 'billing';
  const addressesFields: FormField[] = [
    {
      name: 'streetName',
      value: data.streetName,
      placeholder: 'Street',
      onChange: (value) => {
        const errorField = `${prefix}Street`;
        setData({ ...data, streetName: value });
        setFieldError((field) => ({
          ...field,
          [errorField]: validateStreet(value),
        }));
      },
      error: fieldError[`${prefix}Street`],
    },
    {
      name: 'city',
      value: data.city,
      placeholder: 'City',
      onChange: (value) => {
        const errorField = `${prefix}City`;
        setData({ ...data, city: value });
        setFieldError((field) => ({
          ...field,
          [errorField]: validateCity(value),
        }));
      },
      error: fieldError[`${prefix}City`],
    },
    {
      name: 'postalCode',
      value: data.postalCode,
      placeholder: 'Postal Code',
      onChange: (value) => {
        const errorField = `${prefix}PostalCode`;
        setData({ ...data, postalCode: value });
        setFieldError((field) => ({
          ...field,
          [errorField]: validatePostalCode(value, data.country),
        }));
      },
      error: fieldError[`${prefix}PostalCode`],
    },
    {
      name: 'country',
      type: 'select',
      options: COUNTRY_OPTIONS,
      value: data.country,
      placeholder: 'Country',
      onChange: (value: string) => {
        const errorField = `${prefix}Country`;
        setData({ ...data, country: value });
        setFieldError((field) => ({
          ...field,
          [errorField]: validateCountry(value),
        }));
      },
      error: fieldError[`${prefix}Country`],
    },
  ];
  const handleDefaultAddress = isShippingAddress
    ? handleDefaultShippingAddress
    : handleDefaultBillingAddress;

  return (
    <>
      <Heading as='h3' size='md' mb={2}>
        {addressLabels[addressType] || 'Address'}
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
                    id={prefix + name}
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
                    size='md'
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
      <Checkbox.Root variant='outline' onCheckedChange={handleDefaultAddress}>
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>
          {isShippingAddress
            ? 'Select the shipping address as default'
            : 'Select the billing address as default'}
        </Checkbox.Label>
      </Checkbox.Root>
    </>
  );
}
