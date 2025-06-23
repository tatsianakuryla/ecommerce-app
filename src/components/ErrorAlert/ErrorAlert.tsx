import { Alert } from '@chakra-ui/react';
import { errorAlertStyle } from '~/styles/style';
interface ErrorAlertProperties {
  name: string;
  error: string;
}

export function ErrorAlert({ name, error }: ErrorAlertProperties) {
  return (
    <Alert.Root
      variant='subtle'
      data-testid={`error-alert-${name}`}
      status='error'
      {...errorAlertStyle}
    >
      <Alert.Indicator />
      <Alert.Title>{error}</Alert.Title>
    </Alert.Root>
  );
}
