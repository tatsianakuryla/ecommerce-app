import { useState } from 'react';
import { Form } from '~components/Form/Form';
import RedirectionLink from '~components/RedirectionLink/RedirectionLink.tsx';
import { FiLogIn } from 'react-icons/fi';
import type { FieldKey, FormField, RegistrationData } from '~/types/types';
import { useAuth } from '~/contexts/authContext.tsx';
import { ErrorAlert } from '~components/ErrorAlert/ErrorAlert.tsx';

export function RegistrationForm() {
  const [fieldError, setFieldError] = useState<
    Partial<Record<FieldKey, string>>
  >({});
  const [data, setData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: '',
    },
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, loading, error, clearErrors } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    const errors: Partial<Record<FieldKey, string>> = {};

    if (!data.firstName.trim()) errors.firstName = 'First name is required';
    if (!data.lastName.trim()) errors.lastName = 'Last name is required';
    if (!data.email.trim()) errors.email = 'Email is required';
    if (!data.password.trim()) errors.password = 'Password is required';
    if (data.password !== confirmPassword)
      errors.confirmPassword = 'Passwords must match';
    if (!data.dateOfBirth.trim())
      errors.dateOfBirth = 'Date of birth is required';

    if (!data.address.street.trim()) errors.street = 'Street is required';
    if (!data.address.city.trim()) errors.city = 'City is required';
    if (!data.address.postalCode.trim())
      errors.postalCode = 'Postal code is required';
    if (!data.address.country.trim()) errors.country = 'Country is required';

    setFieldError(errors);
    if (Object.keys(errors).length > 0) return;

    await register(data);
  };

  const fields: FormField[] = [
    {
      name: 'firstName',
      value: data.firstName,
      placeholder: 'First Name',
      onChange: (value: string) => {
        setData({ ...data, firstName: value });
      },
      error: fieldError.firstName,
    },
    {
      name: 'lastName',
      value: data.lastName,
      placeholder: 'Last Name',
      onChange: (value: string) => {
        setData({ ...data, lastName: value });
      },
      error: fieldError.lastName,
    },
    {
      name: 'email',
      type: 'email',
      value: data.email,
      placeholder: 'Email',
      onChange: (value: string) => {
        setData({ ...data, email: value });
      },
      error: fieldError.email,
    },
    {
      name: 'dateOfBirth',
      type: 'string',
      value: data.dateOfBirth,
      placeholder: 'Date of Birth',
      onChange: (value: string) => {
        setData({ ...data, dateOfBirth: value });
      },
      error: fieldError.email,
    },
    {
      name: 'password',
      type: 'password',
      value: data.password,
      placeholder: 'Password',
      onChange: (value: string) => {
        setData({ ...data, password: value });
      },
      error: fieldError.password,
    },
    {
      name: 'confirmPassword',
      type: 'password',
      value: confirmPassword,
      placeholder: 'Confirm Password',
      onChange: (value: string) => {
        setConfirmPassword(value);
      },
      error: fieldError.confirmPassword,
    },
    {
      name: 'street',
      value: data.address.street,
      placeholder: 'Street',
      onChange: (value: string) => {
        setData({ ...data, address: { ...data.address, street: value } });
      },
      error: fieldError.street,
    },
    {
      name: 'city',
      value: data.address.city,
      placeholder: 'City',
      onChange: (value) => {
        setData({ ...data, address: { ...data.address, city: value } });
      },
      error: fieldError.city,
    },
    {
      name: 'postalCode',
      value: data.address.postalCode,
      placeholder: 'Postal Code',
      onChange: (value) => {
        setData({
          ...data,
          address: { ...data.address, postalCode: value },
        });
      },
      error: fieldError.postalCode,
    },
    {
      name: 'country',
      value: data.address.country,
      placeholder: 'Country',
      onChange: (value) => {
        setData({
          ...data,
          address: { ...data.address, country: value },
        });
      },
      error: fieldError.country,
    },
  ];

  return (
    <>
      <Form
        fields={fields}
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        loading={loading}
        submitLabel='Register'
      />
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
