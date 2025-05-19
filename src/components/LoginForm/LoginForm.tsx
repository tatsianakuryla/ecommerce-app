import { useEffect, useState } from 'react';
import { useAuthContext } from '~/hooks/useAuthContext';
import { Form } from '~components/Form/Form';
import { normalizeErrorMessage } from '~/utils/helpers';
import { ProgressCircleElement } from '~components/Progress-circle/Progress-circle';
import RedirectionLink from '~components/RedirectionLink/RedirectionLink';
import { FiUserPlus } from 'react-icons/fi';
import { Flex } from '@chakra-ui/react';
import { ErrorAlert } from '~components/ErrorAlert/ErrorAlert.tsx';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState({ email: '', password: '' });

  const { login, error, loading, setError } = useAuthContext();

  useEffect(() => {
    if (error === null) return;
    const msg = error.toLowerCase();
    const next = { email: '', password: '' };
    if (msg.includes('email')) next.email = error;
    if (msg.includes('password')) next.password = normalizeErrorMessage(error);
    if (!next.email && !next.password) {
      next.email = next.password = error;
    }
    setFieldError(next);
  }, [error]);

  useEffect(() => {
    return () => {
      setError(null);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        if (fieldError.email) {
          setFieldError((err) => ({ ...err, email: '' }));
        }
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
        if (fieldError.password) {
          setFieldError((err) => ({ ...err, password: '' }));
        }
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
        fields={fields}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel='Login'
      />
      {error != null && <ErrorAlert name='error' error={error} />}
      <RedirectionLink
        label='Don`t have an account?'
        to='/register'
        icon={<FiUserPlus />}
        link='Register'
      />
      {loading && <ProgressCircleElement />}
    </Flex>
  );
}
