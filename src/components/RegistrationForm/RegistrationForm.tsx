import { useEffect, useState } from 'react';
import { Form } from '~components/Form/Form';
import RedirectionLink from '~components/RedirectionLink/RedirectionLink';
import { FiLogIn } from 'react-icons/fi';
import type {
  Address,
  FieldKey,
  FormField,
  RegistrationData,
} from '~/types/types';
import { ErrorAlert } from '~components/ErrorAlert/ErrorAlert';
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
} from '~components/RegistrationForm/registrationFormValidation.ts';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { useAuthContext } from '~/hooks/useAuthContext';
import { Button } from '@chakra-ui/react';
import { AddressForm } from '~components/RegistrationForm/AddressForm.tsx';
countries.registerLocale(enLocale);
const COUNTRY_OPTIONS = Object.entries(countries.getNames('en')).map(
  ([code, name]) => ({
    label: name,
    value: code,
  }),
);
const linkButtonStyle = {
  backgroundColor: 'transparent',
  color: 'teal.600',
  fontWeight: 'semibold',
  display: 'block',
  textAlign: 'left',
  px: 0,
  _hover: {
    textDecoration: 'underline',
    bg: 'transparent',
    color: 'teal.700',
  },
  _focus: {
    boxShadow: 'none',
    textDecoration: 'underline',
    color: 'teal.700',
  },
  _active: {
    transform: 'scale(0.98)',
  },
};

export function RegistrationForm() {
  const { register, error, setError, loading } = useAuthContext();
  const [fieldError, setFieldError] = useState<
    Partial<Record<FieldKey, string>>
  >({});
  const [confirmPassword, setConfirmPassword] = useState('');
  const [data, setData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    mainAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: '',
    },
    billingAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: '',
    },
    shippingAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: '',
    },
    isBillingAddressDefault: false,
    isShippingAddressDefault: false,
  });
  const [showBilling, setShowBilling] = useState(false);
  const [showShipping, setShowShipping] = useState(false);

  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [setError]);
  const errors: Partial<Record<FieldKey, string>> = {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    errors.firstName = validateFirstName(data.firstName);
    errors.lastName = validateLastName(data.lastName);
    errors.email = validateEmail(data.email);
    errors.password = validatePassword(data.password);
    errors.confirmPassword = validateConfirmPassword(
      data.password,
      confirmPassword,
    );
    errors.dateOfBirth = validateDateOfBirth(data.dateOfBirth);
    errors.mainAddressStreet = validateStreet(data.mainAddress.street);
    errors.mainAddressCity = validateCity(data.mainAddress.city);
    errors.mainAddressPostalCode = validatePostalCode(
      data.mainAddress.postalCode,
      data.mainAddress.country,
    );
    errors.mainAddressCountry = validateCountry(data.mainAddress.country);

    if (showBilling) {
      errors.billingAddressStreet = validateStreet(data.billingAddress.street);
      errors.billingAddressCity = validateCity(data.billingAddress.city);
      errors.billingAddressPostalCode = validatePostalCode(
        data.billingAddress.postalCode,
        data.billingAddress.country,
      );
      errors.billingAddressCountry = validateCountry(
        data.billingAddress.country,
      );
    }

    if (showShipping) {
      errors.shippingAddressStreet = validateStreet(
        data.shippingAddress.street,
      );
      errors.shippingAddressCity = validateCity(data.shippingAddress.city);
      errors.shippingAddressPostalCode = validatePostalCode(
        data.shippingAddress.postalCode,
        data.shippingAddress.country,
      );
      errors.shippingAddressCountry = validateCountry(
        data.shippingAddress.country,
      );
    }

    setFieldError(errors);
    if (Object.values(errors).some((msg) => msg && msg.length > 0)) return;
    setFieldError(errors);
    await register(data);
  };

  const mainFields: FormField[] = [
    {
      name: 'firstName',
      value: data.firstName,
      placeholder: 'First Name',
      onChange: (value) => {
        setData({ ...data, firstName: value });
        setFieldError((f) => ({ ...f, firstName: validateFirstName(value) }));
      },
      error: fieldError.firstName,
    },
    {
      name: 'lastName',
      value: data.lastName,
      placeholder: 'Last Name',
      onChange: (value) => {
        setData({ ...data, lastName: value });
        setFieldError((f) => ({ ...f, lastName: validateLastName(value) }));
      },
      error: fieldError.lastName,
    },
    {
      name: 'email',
      type: 'email',
      value: data.email,
      placeholder: 'Email',
      onChange: (value) => {
        setData({ ...data, email: value });
        setFieldError((f) => ({ ...f, email: validateEmail(value) }));
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
        setData((prev) => ({ ...prev, dateOfBirth: formatted }));
        setFieldError((prev) => ({
          ...prev,
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
        setData({ ...data, password: value });
        setFieldError((f) => ({ ...f, password: validatePassword(value) }));
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
        setFieldError((f) => ({
          ...f,
          confirmPassword: validateConfirmPassword(data.password, value),
        }));
      },
      error: fieldError.confirmPassword,
    },
    {
      name: 'street',
      value: data.mainAddress.street,
      placeholder: 'Street',
      onChange: (value) => {
        setData({
          ...data,
          mainAddress: { ...data.mainAddress, street: value },
        });
        setFieldError((f) => ({ ...f, street: validateStreet(value) }));
      },
      error: fieldError.mainAddressStreet,
    },
    {
      name: 'city',
      value: data.mainAddress.city,
      placeholder: 'City',
      onChange: (value) => {
        setData({ ...data, mainAddress: { ...data.mainAddress, city: value } });
        setFieldError((f) => ({ ...f, city: validateCity(value) }));
      },
      error: fieldError.mainAddressCity,
    },
    {
      name: 'postalCode',
      value: data.mainAddress.postalCode,
      placeholder: 'Postal Code',
      onChange: (value) => {
        setData({
          ...data,
          mainAddress: { ...data.mainAddress, postalCode: value },
        });
        setFieldError((f) => ({
          ...f,
          postalCode: validatePostalCode(value, data.mainAddress.country),
        }));
      },
      error: fieldError.mainAddressPostalCode,
    },
    {
      name: 'country',
      type: 'select',
      options: COUNTRY_OPTIONS,
      value: data.mainAddress.country,
      placeholder: 'Country',
      onChange: (value: string) => {
        setData({
          ...data,
          mainAddress: { ...data.mainAddress, country: value },
        });
        setFieldError((f) => ({ ...f, country: validateCountry(value) }));
      },
      error: fieldError.mainAddressCountry,
    },
  ];

  return (
    <>
      <Form
        id='registration-form'
        fields={mainFields}
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        loading={loading}
        submitLabel='Register'
      >
        <Button
          onClick={() => {
            setShowBilling((b) => !b);
          }}
          {...linkButtonStyle}
        >
          {showBilling ? 'Hide billing address' : 'Add billing address'}
        </Button>
        {showBilling && (
          <AddressForm
            type='billing'
            title='Billing Address'
            value={data.billingAddress}
            onChange={(addr: Address) => {
              setData((d) => ({ ...d, billingAddress: addr }));
            }}
            isDefault={data.isBillingAddressDefault}
            onDefaultChange={(flag: boolean) => {
              setData((d) => ({ ...d, isBillingAddressDefault: flag }));
            }}
            countryOptions={COUNTRY_OPTIONS}
            errors={errors}
          />
        )}
        <Button
          onClick={() => {
            setShowShipping((s) => !s);
          }}
          {...linkButtonStyle}
        >
          {showShipping ? 'Hide shipping address' : 'Add shipping address'}
        </Button>
        {showShipping && (
          <AddressForm
            type='shipping'
            title='Shipping Address'
            value={data.shippingAddress}
            onChange={(addr: Address) => {
              setData((d) => ({ ...d, shippingAddress: addr }));
            }}
            isDefault={data.isShippingAddressDefault}
            onDefaultChange={(flag: boolean) => {
              setData((d) => ({ ...d, isShippingAddressDefault: flag }));
            }}
            countryOptions={COUNTRY_OPTIONS}
            errors={errors}
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
