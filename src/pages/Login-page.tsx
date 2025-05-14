import { LoginForm } from '~components/LoginForm/LoginForm';
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
      {/*для тестов и для скрин-ридеров прошу в случае необходимости не удалять элемент, а обернуть элемент в <VisuallyHidden>*/}
    </Container>
  );
};
