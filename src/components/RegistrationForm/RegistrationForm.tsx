import { useState } from 'react';
import { Form } from '~components/Form/Form';
import { NavLink } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { Link as ChakraLink } from '@chakra-ui/react';
import { FiLogIn } from 'react-icons/fi';

export function RegistrationForm() {
  const loginLinkStyle = {
    textDecoration: 'none',
    _hover: {
      textDecoration: 'none',
      boxShadow: '0 0 0 3px rgba(56, 178, 172, 0.6)',
    },
    _focus: {
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(56, 178, 172, 0.6)',
    },
    _active: {
      transform: 'scale(0.98)',
    },
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
  };

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
      <Box display='flex' justifyContent='center' alignItems='center'>
        <ChakraLink asChild {...loginLinkStyle}>
          <NavLink to='/login'>
            <Box
              as='span'
              display='flex'
              alignItems='center'
              gap='0.5rem'
              fontSize='md'
            >
              Already have an account?
              <Box
                as='span'
                color='teal.600'
                fontWeight='semibold'
                display='flex'
                alignItems='center'
                gap='0.25rem'
              >
                Login
                <FiLogIn />
              </Box>
            </Box>
          </NavLink>
        </ChakraLink>
      </Box>
    </>
  );
}
