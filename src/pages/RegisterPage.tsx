import { Container, Heading, VisuallyHidden } from '@chakra-ui/react';
import { RegistrationForm } from '~components/Form/RegistrationForm/RegistrationForm';

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
