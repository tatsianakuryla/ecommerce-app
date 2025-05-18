import { Container, Heading, VisuallyHidden } from '@chakra-ui/react';
import { RegistrationForm } from '~components/RegistrationForm/RegistrationForm.tsx';

export const RegisterPage = () => {
  return (
    <Container py='1rem'>
      <VisuallyHidden>
        <Heading>Register page</Heading>
      </VisuallyHidden>
      <RegistrationForm />
    </Container>
  );
};
