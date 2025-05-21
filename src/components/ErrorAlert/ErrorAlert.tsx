import { Alert } from '@chakra-ui/react';
interface ErrorAlertProps {
  name: string;
  error: string;
}

export function ErrorAlert({ name, error }: ErrorAlertProps) {
  return (
    <Alert.Root
      status='error'
      variant='subtle'
      fontSize='sm'
      mb={4}
      px={2}
      data-testid={`error-alert-${name}`}
    >
      <Alert.Indicator />
      <Alert.Title>{error}</Alert.Title>
    </Alert.Root>
  );
}
