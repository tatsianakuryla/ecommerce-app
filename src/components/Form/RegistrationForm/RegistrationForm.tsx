import { useEffect, useState } from 'react';
import { Form } from '~components/Form/Form.tsx';
import RedirectionLink from '~components/RedirectionLink/RedirectionLink.tsx';
import { FiLogIn } from 'react-icons/fi';
import type { FieldKey, FormField, RegistrationData } from '~types/types.ts';
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
} from '~components/Form/RegistrationForm/registrationFormValidation.ts';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { useAuthContext } from '~hooks/useAuthContext.ts';
countries.registerLocale(enLocale);
const COUNTRY_OPTIONS = Object.entries(countries.getNames('en')).map(
  ([code, name]) => ({
    label: name,
    value: code,
  }),
);

export function RegistrationForm() {
  const { register, setError, loading } = useAuthContext();
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
    address: {
      id: '',
      streetName: '',
      city: '',
      postalCode: '',
      country: '',
    },
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
    errors.street = validateStreet(data.address.streetName);
    errors.city = validateCity(data.address.city);
    errors.postalCode = validatePostalCode(
      data.address.postalCode,
      data.address.country,
    );
    errors.country = validateCountry(data.address.country);
    setFieldError(errors);
    if (Object.values(errors).some((message) => message && message.length > 0))
      return;
    setFieldError(errors);
    await register(data);
  };

  const fields: FormField[] = [
    {
      name: 'firstName',
      value: data.firstName,
      placeholder: 'First Name',
      onChange: (value) => {
        setData({ ...data, firstName: value });
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
        setData({ ...data, lastName: value });
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
        setData({ ...data, email: value });
        setFieldError((field) => ({ ...field, email: validateEmail(value) }));
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
        setFieldError((previous) => ({
          ...previous,
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
    {
      name: 'street',
      value: data.address.streetName,
      placeholder: 'Street',
      onChange: (value) => {
        setData({ ...data, address: { ...data.address, streetName: value } });
        setFieldError((field) => ({ ...field, street: validateStreet(value) }));
      },
      error: fieldError.street,
    },
    {
      name: 'city',
      value: data.address.city,
      placeholder: 'City',
      onChange: (value) => {
        setData({ ...data, address: { ...data.address, city: value } });
        setFieldError((field) => ({ ...field, city: validateCity(value) }));
      },
      error: fieldError.city,
    },
    {
      name: 'postalCode',
      value: data.address.postalCode,
      placeholder: 'Postal Code',
      onChange: (value) => {
        setData({ ...data, address: { ...data.address, postalCode: value } });
        setFieldError((field) => ({
          ...field,
          postalCode: validatePostalCode(value, data.address.country),
        }));
      },
      error: fieldError.postalCode,
    },
    {
      name: 'country',
      type: 'select',
      options: COUNTRY_OPTIONS,
      value: data.address.country,
      placeholder: 'Country',
      onChange: (value: string) => {
        setData({ ...data, address: { ...data.address, country: value } });
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
      <Form
        id='registration-form'
        fields={fields}
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        loading={loading}
        submitLabel='Register'
      />

      <RedirectionLink
        label='Already have an account?'
        to='/login'
        icon={<FiLogIn />}
        link='Login'
      />
    </>
  );
}
