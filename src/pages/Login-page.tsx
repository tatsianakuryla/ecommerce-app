import { LoginForm } from '~components/Form/LoginForm/LoginForm';
import { Container, Heading, Flex, VisuallyHidden } from '@chakra-ui/react';

export const LoginPage = () => {
  return (
    <Container py='1rem'>
      <Flex justifyContent='center' alignItems='center'>
        <VisuallyHidden>
          <Heading>Login page</Heading>
        </VisuallyHidden>
        <LoginForm />
      </Flex>
    </Container>
  );
};
