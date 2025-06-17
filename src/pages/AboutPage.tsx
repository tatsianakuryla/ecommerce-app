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

import Tanya from '../assets/images/tanya.jpg';
import Nastassya from '../assets/images/nastassya.jpg';
import Kirill from '../assets/images/kirill.jpg';
import logo from '../assets/images/rss-logo.svg';

interface TeamMember {
  img: string;
  name: string;
  role: string;
  desc: string;
  bio: string;
  github: string;
}

interface TeamMember {
  img: string;
  name: string;
  role: string;
  desc: string;
  bio: string;
  github: string;
}

const teamMembers: TeamMember[] = [
  {
    img: Tanya,
    name: 'Tatsiana Kuryla',
    role: 'Team Lead',
    desc: 'Supervised the completion of tasks at hand. Developed more than half of the application.',
    bio: `I was born in Grodno, Belarus. After finishing school, I moved to Minsk to study at the Belarusian State Economic University in the faculty of Marketing and Logistics. My specialty is Logistics.

Professional Background
My professional career began during the fourth year of study at the university in the procurement sphere. Over the period of five years, I worked my way up from Purchasing Specialist to Category Manager, gaining experience in both small companies and the largest retail chain in Belarus, which operates over 1,000 stores nationwide.

My interest in the IT sphere started unexpectedly—during a casual gathering with my developer friends. They were discussing work-related topics, and to my surprise (and to their surprise), I was able to follow the conversation intuitively. They encouraged me to try programming, convinced that I had the right mindset for it. This is how I first started thinking about IT courses. I started with three-month courses in HTML and CSS in 2022, and eventually decided to focus on Frontend Development.

However, juggling between full-time work and studying was a difficult task for me. The turning point came when I decided to move to another country in 2023. Since my company didn’t support remote work, I resigned. This gave me the perfect opportunity to fully dedicate myself to programming. Now, I am deeply engaged in learning Frontend technologies. I have completed courses in:
- HTML  
- CSS  
- JavaScript  
- TypeScript  

And I am currently studying ReactJS. The more I learn, the more passionate I become. I love the logical challenges that frontend development offers, and I feel really happy when I see the result of my work, when my project works well.`,
    github: 'https://github.com/tatsianakuryla',
  },
  {
    img: Nastassya,
    name: 'Anastasiya Voroshkevich',
    role: 'Software Developer',
    desc: 'Project setup. Mobile version.',
    bio: `I am from Belarus. I finished the physics and mathematics department of Brest State University named after A.S. Pushkin and am currently attending the RSSchool interactive course. I worked in a hospital as a programmer—editing information on the hospital website, interacting with users, and maintaining basic applications. I also served as the site administrator.

In my free time, I strive to upgrade my skills and knowledge in front-end development. It is very difficult for me to combine work and study, but I believe that through hard work I will become an experienced front-end developer. I have completed a course on HTML & CSS layout of sites on Web-cademy.ru (technologies: HTML, CSS, responsive layout, PixelPerfect, JS basics) and the “Development of Web Applications in JavaScript” course at IT-Academy (technologies: ES2015, SPA architecture, localStorage state, fetch requests).

My graduation project was a test simulator written specifically for students and teachers who love math. The simulator is a collection of math tests—after passing, students see their gaps in knowledge and teachers help fill them.`,
    github: 'https://github.com/nastasiya-voroshkevich',
  },
  {
    img: Kirill,
    name: 'Kiryl Makhvienia',
    role: 'Software Developer',
    desc: 'Project setup. Integrate auth service, handle errors. Registration API integration. Display products on the main page.',
    bio: `Originally from Belarus, and having finished courses there, Kiryl Makhvienia now lives in Lithuania, where he works as a software tester. He's currently studying Python, as it's required for his main job. With a sharp eye for detail and a love for figuring out how things work, Kiryl has always been drawn to the inner mechanics of digital products.

“I enjoy testing because it’s like solving a puzzle,” he says. “You need to think critically, spot things others might miss, and make sure everything runs smoothly.” 

“What I love about frontend is the instant feedback. You write code—and you see the result right away. It’s creative and logical at the same time,” he explains. “It’s exciting to bring designs to life and make products feel intuitive for users.”`,
    github: 'https://github.com/mahveenya',
  },
];

const TeamCard = ({ member }: { member: TeamMember }) => {
  return (
    <Box
      bg='white'
      shadow='md'
      borderRadius='lg'
      overflow='hidden'
      _hover={{ shadow: 'lg' }}
    >
      <Flex direction={{ base: 'column', md: 'row' }} h='100%' align='stretch'>
        <Image
          src={member.img}
          objectFit='cover'
          w={{ base: '100%', md: '150px' }}
          alt={member.name}
        />

        <Box p={4} flex='1'>
          <Text fontSize='lg' fontWeight='bold' color='teal.600'>
            {member.name}
          </Text>
          <Text fontSize='sm' fontWeight='medium' color='green.500' mb={2}>
            {member.role}
          </Text>
          <Text fontSize='sm' mb={3}>
            {member.desc}
          </Text>
          <Link
            href={member.github}
            fontSize='sm'
            display='inline-flex'
            alignItems='center'
            color='teal.500'
            _hover={{ textDecor: 'underline' }}
          >
            GitHub profile&nbsp;
            <LuExternalLink />
          </Link>
          <Box mt={4}>
            <Collapsible.Root unmountOnExit>
              <Collapsible.Trigger asChild>
                <Text
                  as='button'
                  fontSize='sm'
                  color='teal.500'
                  _hover={{ textDecor: 'underline' }}
                >
                  Read more
                </Text>
              </Collapsible.Trigger>

              <Collapsible.Content>
                <Box mt={2}>
                  <Text fontSize='sm' color='gray.600' whiteSpace='pre-line'>
                    {member.bio}
                  </Text>
                </Box>
                <Collapsible.Trigger asChild>
                  <Text
                    as='button'
                    mt={2}
                    fontSize='sm'
                    color='teal.500'
                    _hover={{ textDecor: 'underline' }}
                  >
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

      <Flex
        direction={{ base: 'column', md: 'row' }}
        align='center'
        justify='space-between'
        mb={{ base: 8, md: 12 }}
        gap={6}
      >
        <Text fontSize={{ base: 'lg', md: 'xl' }} flex='1'>
          Welcome to our eCommerce application! This application was made by the
          team known as Dev Crew #11 as part of the RS School teaching course.
          Mutual assistance, discussion of current problems and solutions to
          them (Discord calls), organizing the task board, effective task
          management led the team to the creation of the successful product. The
          majority of the work was done by Tatsiana, our team-lead. Other
          members of the team could not give it their all, for they were too
          busy.
        </Text>
      </Flex>

      <Stack gap={8}>
        {teamMembers.map((m) => (
          <TeamCard key={m.name} member={m} />
        ))}
      </Stack>
      <Box textAlign='center' mt={{ base: 10, md: 16 }}>
        <Text fontSize='sm' color='gray.500' mb={2}>
          This project was built as part of the
        </Text>
        <Link
          href='https://rs.school/'
          fontSize='md'
          fontWeight='semibold'
          color='teal.600'
          display='inline-flex'
          alignItems='center'
          _hover={{ textDecor: 'underline', color: 'teal.800' }}
        >
          <Image
            src={logo}
            boxSize={{ base: '32px', md: '32px' }}
            alt='RS School Logo'
            mr={2}
          />
          Rolling Scopes School&nbsp;
          <LuExternalLink />
        </Link>
      </Box>
    </Container>
  );
};
