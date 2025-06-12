import { useEffect, useState } from 'react';
import { Form } from '~components/Form/Form';
import RedirectionLink from '~components/RedirectionLink/RedirectionLink';
import { FiLogIn } from 'react-icons/fi';
import type {
  FieldKey,
  FormField,
  RegistrationData,
  Address,
} from '~types/types';
import {
  formatDateInput,
  validateCity,
  validateConfirmPassword,
  validateCountry,
  validateDateOfBirth,
  validateEmail,
  validateFirstName,
  validateLastName,
  validatePassword,
  validatePostalCode,
  validateStreet,
} from '~components/Form/RegistrationForm/registrationFormValidation';
import { useAuthContext } from '~hooks/useAuthContext';
import { AddressForm } from '~components/Form/AddressForm/AddressForm';
import { Button } from '@chakra-ui/react';
import { ErrorAlert } from '~components/ErrorAlert/ErrorAlert';
import {
  defaultAddressIndex,
  defaultAddressInfo,
  defaultUserInfo,
} from '~constants/constants.ts';

export function RegistrationForm() {
  const { register, error, setError, loading } = useAuthContext();
  const [fieldError, setFieldError] = useState<
    Partial<Record<FieldKey, string>>
  >({});
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAddedBillingAddress, setIsAddedBillingAddress] = useState(false);
  const [data, setData] = useState<RegistrationData>({
    ...defaultUserInfo,
    addresses: [defaultAddressInfo, defaultAddressInfo],
    defaultShippingAddress: defaultAddressIndex,
    defaultBillingAddress: defaultAddressIndex,
  });

  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [setError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const errors: Partial<Record<FieldKey, string>> = {};
    errors.firstName = validateFirstName(data.firstName);
    errors.lastName = validateLastName(data.lastName);
    errors.email = validateEmail(data.email);
    errors.password = validatePassword(data.password);
    errors.confirmPassword = validateConfirmPassword(
      data.password,
      confirmPassword,
    );
    errors.dateOfBirth = validateDateOfBirth(data.dateOfBirth);
    errors.shippingStreet = validateStreet(data.addresses[0].streetName);
    errors.shippingCity = validateCity(data.addresses[0].city);
    errors.shippingPostalCode = validatePostalCode(
      data.addresses[0].postalCode,
      data.addresses[0].country,
    );
    errors.shippingCountry = validateCountry(data.addresses[0].country);
    if (isAddedBillingAddress) {
      errors.billingStreet = validateStreet(data.addresses[1].streetName);
      errors.billingCity = validateCity(data.addresses[1].city);
      errors.billingPostalCode = validatePostalCode(
        data.addresses[1].postalCode,
        data.addresses[1].country,
      );
      errors.billingCountry = validateCountry(data.addresses[1].country);
    }

    setFieldError(errors);

    const hasError = Object.values(errors).some(
      (message) => message && message.length > 0,
    );
    if (hasError) {
      return;
    }

    await register(data);
  };

  const handleDefaultShippingAddress = () => {
    setData((previous) => {
      if (previous.defaultShippingAddress === defaultAddressIndex) {
        return {
          ...previous,
          defaultShippingAddress: 0,
        };
      } else {
        return {
          ...previous,
          defaultShippingAddress: defaultAddressIndex,
        };
      }
    });
  };

  const handleDefaultBillingAddress = () => {
    setData((previous) => {
      if (previous.defaultBillingAddress === defaultAddressIndex) {
        return {
          ...previous,
          defaultBillingAddress: 1,
        };
      } else {
        return {
          ...previous,
          defaultBillingAddress: defaultAddressIndex,
        };
      }
    });
  };

  const fields: FormField[] = [
    {
      name: 'firstName',
      value: data.firstName,
      placeholder: 'First Name',
      onChange: (value) => {
        setData((previous) => ({ ...previous, firstName: value }));
        setFieldError((field) => ({
          ...field,
          firstName: validateFirstName(value),
        }));
      },
      error: fieldError.firstName,
    },
    {
      name: 'lastName',
      value: data.lastName,
      placeholder: 'Last Name',
      onChange: (value) => {
        setData((previous) => ({ ...previous, lastName: value }));
        setFieldError((field) => ({
          ...field,
          lastName: validateLastName(value),
        }));
      },
      error: fieldError.lastName,
    },
    {
      name: 'email',
      type: 'email',
      value: data.email,
      placeholder: 'Email',
      onChange: (value) => {
        setData((previous) => ({ ...previous, email: value }));
        setFieldError((field) => ({
          ...field,
          email: validateEmail(value),
        }));
      },
      error: fieldError.email,
    },
    {
      name: 'dateOfBirth',
      type: 'text',
      value: data.dateOfBirth,
      placeholder: '1998-12-31',
      onChange: (value) => {
        const formatted = formatDateInput(value);
        setData((previous) => ({ ...previous, dateOfBirth: formatted }));
        setFieldError((previousError) => ({
          ...previousError,
          dateOfBirth: validateDateOfBirth(formatted),
        }));
      },
      error: fieldError.dateOfBirth,
    },
    {
      name: 'password',
      type: 'password',
      value: data.password,
      placeholder: 'Password',
      onChange: (value) => {
        setData((previous) => ({ ...previous, password: value }));
        setFieldError((field) => ({
          ...field,
          password: validatePassword(value),
        }));
      },
      error: fieldError.password,
    },
    {
      name: 'confirmPassword',
      type: 'password',
      value: confirmPassword,
      placeholder: 'Confirm Password',
      onChange: (value) => {
        setConfirmPassword(value);
        setFieldError((field) => ({
          ...field,
          confirmPassword: validateConfirmPassword(data.password, value),
        }));
      },
      error: fieldError.confirmPassword,
    },
  ];

  const addAddressButtonStyle = {
    background: 'none',
    color: 'teal.600',
    padding: '0',
    height: 'auto',
    _hover: { textDecoration: 'underline', background: 'none' },
    _active: { background: 'none' },
    _focus: { boxShadow: 'none' },
    transition: 'all 0.2s ease',
    mb: '1rem',
    mt: '1rem',
  };

  return (
    <>
      <Form
        id='registration-form'
        fields={fields}
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        loading={loading}
        submitLabel='Register'
      >
        <AddressForm
          addressType='shipping'
          handleDefaultShippingAddress={handleDefaultShippingAddress}
          data={data.addresses[0]}
          setData={(address: Address) => {
            setData((previous) => ({
              ...previous,
              addresses: [address, previous.addresses[1]],
            }));
          }}
          fieldError={fieldError}
          setFieldError={setFieldError}
        />

        <Button
          {...addAddressButtonStyle}
          onClick={() => {
            setIsAddedBillingAddress((previous) => !previous);
          }}
        >
          {isAddedBillingAddress
            ? 'Hide Billing Address'
            : 'Add Billing Address'}
        </Button>

        {isAddedBillingAddress && (
          <AddressForm
            addressType='billing'
            handleDefaultBillingAddress={handleDefaultBillingAddress}
            data={data.addresses[1]}
            setData={(address: Address) => {
              setData((previous) => ({
                ...previous,
                addresses: [previous.addresses[0], address],
              }));
            }}
            fieldError={fieldError}
            setFieldError={setFieldError}
          />
        )}
      </Form>
      {error != null && <ErrorAlert name='error' error={error} />}

      <RedirectionLink
        label='Already have an account?'
        to='/login'
        icon={<FiLogIn />}
        link='Login'
      />
    </>
  );
}
