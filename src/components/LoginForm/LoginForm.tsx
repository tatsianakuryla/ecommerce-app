import { useEffect, useState } from 'react';
import { useAuthContext } from '~/hooks/useAuthContext';
import { Form } from '~components/Form/Form';
import { normalizeErrorMessage } from '~/utils/helpers';
import { ProgressCircleElement } from '~components/Progress-circle/Progress-circle';
import RedirectionLink from '~components/RedirectionLink/RedirectionLink';
import { FiUserPlus } from 'react-icons/fi';
import { Flex } from '@chakra-ui/react';
import { ErrorAlert } from '~components/ErrorAlert/ErrorAlert.tsx';
import {
  validateEmail,
  validatePassword,
} from '~components/LoginForm/loginFormValidation.ts';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState({ email: '', password: '' });

  const { login, error: serverError, loading, setError } = useAuthContext();

  useEffect(() => {
    if (serverError === null) return;
    const msg = serverError.toLowerCase();
    const next = { email: '', password: '' };
    if (msg.includes('email')) next.email = serverError;
    if (msg.includes('password'))
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setFieldError({ email: eErr, password: pErr });
    if (eErr || pErr) return;
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
        const err = validateEmail(value);
        setFieldError((prev) => ({ ...prev, email: err }));
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
        const err = validatePassword(value);
        setFieldError((prev) => ({ ...prev, password: err }));
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
