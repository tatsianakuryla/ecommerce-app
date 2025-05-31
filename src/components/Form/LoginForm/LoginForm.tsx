import { useEffect, useState } from 'react';
import { useAuthContext } from '~hooks/useAuthContext.ts';
import { Form } from '~components/Form/Form.tsx';
import { normalizeErrorMessage } from '~utils/helpers.ts';
import { ProgressCircleElement } from '~components/Progress-circle/Progress-circle.tsx';
import RedirectionLink from '~components/RedirectionLink/RedirectionLink.tsx';
import { FiUserPlus } from 'react-icons/fi';
import { Flex } from '@chakra-ui/react';
import { ErrorAlert } from '~components/ErrorAlert/ErrorAlert.tsx';
import {
  validateEmail,
  validatePassword,
} from '~components/Form/LoginForm/loginFormValidation.ts';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState({ email: '', password: '' });

  const { login, error: serverError, loading, setError } = useAuthContext();

  useEffect(() => {
    if (serverError === null) return;
    const message = serverError.toLowerCase();
    const next = { email: '', password: '' };
    if (message.includes('email')) next.email = serverError;
    if (message.includes('password'))
      next.password = normalizeErrorMessage(serverError);
    if (!next.email && !next.password) {
      next.email = next.password = serverError;
    }
    setFieldError(next);
  }, [serverError]);

  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [setError]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setFieldError({ email: emailError, password: passwordError });
    if (emailError || passwordError) return;
    void login(email, password);
  };

  const fields = [
    {
      name: 'email',
      type: 'text',
      value: email,
      placeholder: 'Email',
      onChange: (value: string) => {
        setEmail(value);
        const error = validateEmail(value);
        setFieldError((previous) => ({ ...previous, email: error }));
      },
      error: fieldError.email,
    },
    {
      name: 'password',
      type: 'password',
      value: password,
      placeholder: 'Password',
      onChange: (value: string) => {
        setPassword(value);
        const error = validatePassword(value);
        setFieldError((previous) => ({ ...previous, password: error }));
      },
      error: fieldError.password,
    },
  ];

  return (
    <Flex
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      py='1rem'
    >
      <Form
        id='registration-form'
        fields={fields}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel='Login'
      />
      {serverError && !fieldError.email && !fieldError.password && (
        <ErrorAlert name='error' error={serverError} />
      )}
      <RedirectionLink
        label="Don't have an account?"
        to='/register'
        icon={<FiUserPlus />}
        link='Register'
      />
      {loading && <ProgressCircleElement />}
    </Flex>
  );
}
