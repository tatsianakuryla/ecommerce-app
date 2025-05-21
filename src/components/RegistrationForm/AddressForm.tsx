import { Box, VStack, Input, Heading } from '@chakra-ui/react';
import { ErrorAlert } from '~components/ErrorAlert/ErrorAlert.tsx';
import type { FieldKey } from '~types/types.ts';

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface AddressFormProps {
  title: string;
  value: Address;
  onChange: (newAddress: Address) => void;
  isDefault: boolean;
  onDefaultChange: (isDefault: boolean) => void;
  countryOptions: Array<{ label: string; value: string }>;
  errors?: Partial<Record<FieldKey, string>>;
  type?: 'billing' | 'shipping';
}

export const AddressForm: React.FC<AddressFormProps> = ({
  title,
  value,
  onChange,
  isDefault,
  onDefaultChange,
  countryOptions,
  errors = {},
  type,
}) => {
  const handleFieldChange =
    (field: keyof Address) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange({ ...value, [field]: e.target.value });
    };
  const addressErrors = {
    street:
      type === 'billing'
        ? errors.billingAddressStreet
        : errors.shippingAddressStreet,
    city:
      type === 'billing'
        ? errors.billingAddressCity
        : errors.shippingAddressCity,
    postalCode:
      type === 'billing'
        ? errors.billingAddressPostalCode
        : errors.shippingAddressPostalCode,
    country:
      type === 'billing'
        ? errors.billingAddressCountry
        : errors.shippingAddressCountry,
  };

  return (
    <Box
      border='1px solid'
      borderColor='gray.200'
      borderRadius='md'
      p={4}
      mb={4}
    >
      <Heading as='h4' size='md' mb={3}>
        {title}
      </Heading>

      <VStack align='stretch'>
        <div>
          <label htmlFor={`${title}-street`}>Street</label>
          <Input
            id={`${title}-street`}
            placeholder='Street'
            value={value.street}
            onChange={handleFieldChange('street')}
          />
          {addressErrors.street && (
            <ErrorAlert name={`${title}-street`} error={addressErrors.street} />
          )}
        </div>

        <div>
          <label htmlFor={`${title}-city`}>City</label>
          <Input
            id={`${title}-city`}
            placeholder='City'
            value={value.city}
            onChange={handleFieldChange('city')}
          />
          {addressErrors.city && (
            <ErrorAlert name={`${title}-city`} error={addressErrors.city} />
          )}
        </div>

        <div>
          <label htmlFor={`${title}-postalCode`}>Postal Code</label>
          <Input
            id={`${title}-postalCode`}
            placeholder='Postal Code'
            value={value.postalCode}
            onChange={handleFieldChange('postalCode')}
          />
          {addressErrors.postalCode && (
            <ErrorAlert
              name={`${title}-postalCode`}
              error={addressErrors.postalCode}
            />
          )}
        </div>

        <div>
          <label htmlFor={`${title}-country`}>Country</label>
          <select
            id={`${title}-country`}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #CBD5E0',
            }}
            value={value.country}
            onChange={handleFieldChange('country')}
          >
            <option value=''>Select country</option>
            {countryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {addressErrors.country && (
            <ErrorAlert
              name={`${title}-country`}
              error={addressErrors.country}
            />
          )}
        </div>

        <div>
          <label>
            <input
              type='checkbox'
              checked={isDefault}
              onChange={(e) => {
                onDefaultChange(e.target.checked);
              }}
              style={{ marginRight: '0.5rem' }}
            />
            Set as default {title.toLowerCase()}
          </label>
        </div>
      </VStack>
    </Box>
  );
};
