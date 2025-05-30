import { Container, Heading, VisuallyHidden } from '@chakra-ui/react';
import { Profile } from '~features/customers/Profile.tsx';

export const ProfilePage = () => {
  return (
    <Container py='1rem'>
      <VisuallyHidden>
        <Heading>Profile page</Heading>
      </VisuallyHidden>
      <Profile />
    </Container>
  );
};
