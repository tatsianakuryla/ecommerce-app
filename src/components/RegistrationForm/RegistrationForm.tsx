import { useState } from 'react';
import { Form } from '~components/Form/Form';
import RedirectionLink from '~components/RedirectionLink/RedirectionLink.tsx';
import { FiLogIn } from 'react-icons/fi';

export function RegistrationForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldError, setFieldError] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: typeof fieldError = {};

    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!email.trim()) errors.email = 'Email is required';
    if (!password.trim()) errors.password = 'Password is required';
    if (password !== confirmPassword)
      errors.confirmPassword = 'Passwords do not match';

    setFieldError(errors);
    if (Object.keys(errors).length > 0) return;
  };

  return (
    <>
      <Form
        fields={[
          {
            name: 'firstName',
            value: firstName,
            placeholder: 'First Name',
            onChange: (value: string) => {
              setFirstName(value);
            },
            error: fieldError.firstName,
          },
          {
            name: 'lastName',
            value: lastName,
            placeholder: 'Last Name',
            onChange: (value: string) => {
              setLastName(value);
            },
            error: fieldError.lastName,
          },
          {
            name: 'email',
            value: email,
            placeholder: 'Email',
            onChange: (v) => {
              setEmail(v);
            },
            error: fieldError.email,
          },
          {
            name: 'password',
            type: 'password',
            value: password,
            placeholder: 'Password',
            onChange: (v) => {
              setPassword(v);
            },
            error: fieldError.password,
          },
          {
            name: 'confirmPassword',
            type: 'password',
            value: confirmPassword,
            placeholder: 'Confirm Password',
            onChange: (v) => {
              setConfirmPassword(v);
            },
            error: fieldError.confirmPassword,
          },
        ]}
        onSubmit={handleSubmit}
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
