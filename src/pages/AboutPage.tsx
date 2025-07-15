import {
  Container,
  Heading,
  Box,
  Image,
  Link,
  VisuallyHidden,
  Flex,
  Text,
  Stack,
  Collapsible,
} from '@chakra-ui/react';
import { LuExternalLink } from 'react-icons/lu';
import logo from '../assets/images/rss-logo.svg';
import {
  aboutPageTextContainer,
  collapsibleContentTextStyle,
  collapsibleTriggerStyle,
  footerTextStyle,
  githubLinkStyle,
  rsSchoolLinkStyle,
  rsSchoolLogoStyle,
  teamCardBoxStyle,
  teamCardDescStyle,
  teamCardNameStyle,
  teamCardRoleStyle,
  teamImageStyle,
} from '~/styles/style';
import { TeamMember } from '~types/types';
import { teamMembers } from '~constants/constants';

const TeamCard = ({ member }: { member: TeamMember }) => {
  return (
    <Box {...teamCardBoxStyle}>
      <Flex direction={{ base: 'column', md: 'row' }} h='100%' align='stretch'>
        <Image src={member.img} alt={member.name} {...teamImageStyle} />

        <Box p={4} flex='1'>
          <Text {...teamCardNameStyle}>{member.name}</Text>
          <Text {...teamCardRoleStyle}>{member.role}</Text>
          <Text {...teamCardDescStyle}>{member.desc}</Text>

          <Link href={member.github} {...githubLinkStyle}>
            GitHub profile&nbsp;
            <LuExternalLink />
          </Link>

          <Box mt={4}>
            <Collapsible.Root unmountOnExit>
              <Collapsible.Trigger asChild>
                <Text {...collapsibleTriggerStyle}>Read more</Text>
              </Collapsible.Trigger>

              <Collapsible.Content>
                <Box mt={2}>
                  <Text {...collapsibleContentTextStyle}>{member.bio}</Text>
                </Box>
                <Collapsible.Trigger asChild>
                  <Text {...collapsibleTriggerStyle} mt={2}>
                    Show less
                  </Text>
                </Collapsible.Trigger>
              </Collapsible.Content>
            </Collapsible.Root>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export const AboutPage = () => {
  return (
    <Container maxW='container.xl' py={{ base: 6, md: 12 }}>
      <VisuallyHidden>
        <Heading>About Us</Heading>
      </VisuallyHidden>

      <Box {...aboutPageTextContainer}>
        <Text mb={4}>Welcome to our eCommerce application!</Text>
        <Text mb={4}>
          This eCommerce web application was developed as the final team project
          during the RS School educational program. Our objective was to build a
          fully functional online store that includes user authentication,
          product search, category management, shopping cart functionality, and
          address management. The application features responsive design,
          accessibility, and clean code practices, using technologies such as
          React, TypeScript, and the commercetools API. It reflects our ability
          to collaborate effectively, solve real-world problems, and deliver a
          polished user experience.
        </Text>
        <Text>
          Tatsiana coordinated the project as team lead, actively contributing
          to all key parts of the application—from layout and business logic to
          integration and testing. Her leadership helped keep the team aligned
          and ensured consistent progress, even when challenges arose with
          scheduling and availability. Thanks to this structured approach, the
          team delivered a functional and well-organized final product.
        </Text>
      </Box>

      <Stack gap={8}>
        {teamMembers.map((member) => (
          <TeamCard key={member.name} member={member} />
        ))}
      </Stack>

      <Box textAlign='center' mt={{ base: 10, md: 16 }}>
        <Text {...footerTextStyle}>This project was built as part of the</Text>
        <Link href='https://rs.school/' {...rsSchoolLinkStyle}>
          <Image src={logo} {...rsSchoolLogoStyle} />
          Rolling Scopes School&nbsp;
          <LuExternalLink />
        </Link>
      </Box>
    </Container>
  );
};
