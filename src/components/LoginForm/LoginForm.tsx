import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, loginSchema } from '~/hooks/login-schema';
import { useEffect} from 'react';
import { useAuthContext } from '~/hooks/useAuthContext';
import { EmailInput } from '../InputEmail/ImputEmail';
import { PasswordInput } from '../InputPassword/InputPassword';
import { Alert, Button, ProgressCircle,  Flex  } from '@chakra-ui/react';
import { ProgressCircleElement } from '../Progress-circle/Progress-circle';
import { FiUserPlus } from 'react-icons/fi';
import RedirectionLink from '../RedirectionLink/RedirectionLink';
export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
    criteriaMode: 'all',
  });
  const { login, error, loading } = useAuthContext();

  useEffect(() => {
    if (error == null) return;

    if (error.toLowerCase().includes('email')) {
      setError('email', { message: error });
    } else if (error.toLowerCase().includes('password')) {
      setError('password', { message: error });
    } else {
      setError('root', { message: error });
    }
  }, [error, setError]);

  // const onSubmit = async (data: LoginFormData) => {
  //   clearErrors();
  //   await login(data.email, data.password);
  // };

const onSubmit = async (data: LoginFormData) => {
  clearErrors();
  if (typeof login === 'function') {
    await login(data.email, data.password);
  } else {
    console.error('login is not a function');
    setError('root', { message: 'Login functionality is not available' });
  }
};


  return (
    <>
        <Flex
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      py='1rem'
    >
      <form
        // pos="relative"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit)(e).catch((err: unknown) => {
            console.error(err);
          });
        }}
        style={{
          maxWidth: 320,
          width: '100%',
          margin: '2rem auto',
          ...(loading && { filter: 'blur(1px)' }),
        }}
      >
        <EmailInput
          {...register('email')}
          error={errors.email?.message}
          isTouched={touchedFields.email}
          hasError={!!errors.email}
        />

        {errors.root && (
          <Alert.Root
            status='error'
            variant='subtle'
            fontSize='sm'
            mb={4}
            px={2}
            data-testid='error-alert'
          >
            <Alert.Indicator />
            <Alert.Title>{errors.root.message}</Alert.Title>
          </Alert.Root>
        )}
        <PasswordInput
          {...register('password')}
          error={errors.password?.message}
          isTouched={touchedFields.password}
          hasError={!!errors.password}
        />

        {errors.root && (
          <Alert.Root
            status='error'
            variant='subtle'
            fontSize='sm'
            mb={4}
            px={2}
            data-testid='error-alert'
          >
            <Alert.Indicator />
            <Alert.Title>{errors.root.message}</Alert.Title>
          </Alert.Root>
        )}

        <Button
          type='submit'
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '0.5rem',
            transition: 'opacity 0.3s ease',
            opacity: isSubmitting ? 0.7 : 1,
          }}
          data-testid='login-button'
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      {isSubmitting && (
        <ProgressCircle.Root
          value={null}
          pos='absolute'
          data-testid='progress-bar'
        >
          <ProgressCircle.Circle>
            <ProgressCircle.Track />
            <ProgressCircle.Range strokeLinecap='round' />
          </ProgressCircle.Circle>
        </ProgressCircle.Root>
      )}
      {isSubmitting && <ProgressCircleElement />}

           <RedirectionLink
        label='Don`t have an account?'
        to='/register'
        icon={<FiUserPlus />}
        link='Register'
      />
      </Flex>
    </>
  );
}

