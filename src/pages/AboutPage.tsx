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
          This project was developed by Dev Crew #11 as part of the RS School
          educational program. Throughout the development process, our team
          focused on collaboration, open discussion of challenges and solutions
          (including regular Discord calls), and effective task management using
          a shared board. These efforts resulted in the creation of a
          well-structured and functional product.
        </Text>
        <Text>
          Special recognition goes to Tatsiana, our dedicated team lead, who
          contributed the majority of the work and ensured steady progress
          despite limited participation from other team members due to their
          time constraints.
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
