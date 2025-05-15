import { Container, Heading } from '@chakra-ui/react';

export const MainPage = () => {
  return (
    <Container py='1rem'>
      {/*для тестов и для скрин-ридеров прошу в случае необходимости не удалять элемент, а обернуть элемент в <VisuallyHidden>*/}
      <Heading>Main page</Heading>
    </Container>
  );
};
