import {
  Container,
  Heading,
  Grid,
  GridItem,
  Image,
  Link,
  VisuallyHidden,
  Flex,
  Text,
} from '@chakra-ui/react';
import { LuExternalLink } from 'react-icons/lu';
import Tanya from '../assets/images/Tanya.jpg';
import Nastassya from '../assets/images/Nastassya.jpg';
import Kirill from '../assets/images/Kirill.jpg';
import logo from '../assets/images/images.png';
export const AboutPage = () => {
  return (
    <Container py='1rem'>
      <VisuallyHidden>
        <Heading>About Us</Heading>
      </VisuallyHidden>
      <Flex width='100%' justifyContent='flex-end' mb='4rem'>
        <Text as='h1' flex='1' minWidth='0' textAlign='center' pr='4rem'>
          Welcome to our eCommerce application! This application was made by the
          team known as Dev Crew #11 as part of the RS Schoool teaching course.
          Mutual assistance, discussion of current problems and solutions to
          them (Discord calls), organizing the task board, effective task
          management led the team to the creation of the successful product. The
          majority of the work was done by Tatsiana, our team-lead. Other
          members of the team could not give it their all, for they were too
          busy.
        </Text>

        <Link
          href='https://rs.school/'
          target='_blank'
          rel='noopener noreferrer'
          _focus={{ outline: 'none', boxShadow: 'none' }}
        >
          <Image src={logo} height='60px' alt='Logo' />
        </Link>
      </Flex>

      <Grid
        templateRows='auto 1fr'
        templateColumns='350px 1fr'
        gap={4}
        mb='2rem'
        p='2rem'
        background={'gray.100'}
      >
        <GridItem rowSpan={2} colSpan={{ base: 1, md: 2 }}>
          <Image
            src={Tanya}
            objectFit='contain'
            width='auto'
            min-width='240px'
            alt='Tatsiana Kuryla'
          ></Image>
        </GridItem>
        <GridItem colSpan={{ base: 3, md: 3 }}>
          <Text color={'#125854'}>Tatsiana Kuryla</Text>
          <Text color={'green'}>Team Lead</Text>
          <Text>
            Supervised the completion of tasks at hand. Developed more than half
            of the application.
          </Text>
          <Link href='https://github.com/tatsianakuryla'>
            GitHub profile
            <LuExternalLink color={'green'} />
          </Link>
        </GridItem>

        <GridItem colStart={3} colSpan={3}>
          <Text>
            I was born in Grodno, Belarus. After finishing school, I moved to
            Minsk to study at the Belarusian State Economic University in the
            faculty of Marketing and Logistics. My specialty is Logistics.
            Professional Background My professional career began during the
            fourth year of study at the university in the procurement sphere.
            Over the period of five years, I worked my way up from Purchasing
            Specialist to Category Manager, gaining experience in both small
            companies and the largest retail chain in Belarus, which operates
            over 1,000 stores nationwide. My interest in the IT sphere started
            unexpectedly—during a casual gathering with my developer friends.
            They were discussing work-related topics, and to my surprise (and to
            their surprise), I was able to follow the conversation intuitively.
            They encouraged me to try programming, convinced that I had the
            right mindset for it. This is how I first started thinking about IT
            courses. I started with 3-month courses of HTML and CSS in 2022, and
            eventually, I decided to focus on Frontend Development. However,
            juggling between full-time work and studying was a difficult task
            for me. The turning point came when I decided to move to another
            country in 2023. Since my company didn’t support remote work, I had
            to resign. This gave me the perfect opportunity to fully dedicate
            myself to programming. Now, I am deeply engaged in learning Frontend
            technologies. I have completed courses in: - HTML - CSS - JavaScript
            - TypeScript. And I am currently studying ReactJS. The more I learn,
            the more passionate I become. I love the logical challenges that
            frontend development offers, and I feel really happy when I see the
            result of my work, when my project works well.
          </Text>
        </GridItem>
      </Grid>

      <Grid
        templateRows='auto 1fr'
        templateColumns='350px auto'
        gap={4}
        mb='2rem'
        boxShadow='lg'
        p='2rem'
      >
        <GridItem colSpan={{ base: 1, md: 3 }}>
          <Text color={'#125854'}>Anastasiya Voroshkevich</Text>
          <Text color={'green'}>Software Developer</Text>
          <Text>Project setup. Mobile version.</Text>
          <Link href='https://github.com/nastasiya-voroshkevich'>
            GitHub profile
            <LuExternalLink color={'green'} />
          </Link>
        </GridItem>

        <GridItem
          rowSpan={2}
          colStart={{ base: 2, md: 5 }}
          colEnd={5}
          display='flex'
          justifyContent='flex-end'
        >
          <Image
            src={Nastassya}
            objectFit='contain'
            width='auto'
            minWidth='240px'
            alt='Anastasiya Voroshkevich'
          />
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 2 }}>
          <Text>
            I am from Belarus. I finished the physics and mathematics department
            of Brest State University named after A.S. Pushkin and currently
            attending the RSSchool interactive course. I worked in a hospital as
            a programmer. I edited information on the hospital website and
            interacted with users, work with basic programs.I was the
            administrator of the hospital website. In my free time, I am trying
            to upgrade my skills and knowledge in the field of front-end
            development. It is very difficult for me to combine work and study.
            I believe that through hard work I will become an experienced
            front-end developer. I have completed a course on HTML, CSS layout
            of sites, on Web-cademy.ru. I have learned technologies: HTML, CSS,
            responsive layout, PixelPerfect, JS basics. I have completed the
            course “Development of Web Application in JavaScript”, IT-Academy. I
            have learned JS technologies. Studying JavaScript, I wrote a thesis
            project. My graduation project is a test simulator written
            specifically for students and teachers who love math. The test
            simulator is a collection of math tests. After passing the test,
            students see their gaps in knowledge and teachers help to fill these
            gaps. The project was written in pure JS. I used the ES standard
            (ES2015) and SPA website (Single Page Application). The state of the
            application is in localStorage. Fetch requests are used to work with
            the server.
          </Text>
        </GridItem>
      </Grid>

      <Grid
        templateRows='auto 1fr'
        templateColumns='350px 1fr'
        gap={4}
        mb='2rem'
        p='2rem'
        background={'gray.100'}
      >
        <GridItem rowSpan={2} colSpan={{ base: 1, md: 2 }}>
          <Image
            src={Kirill}
            objectFit='contain'
            width='auto'
            min-width='240px'
            alt='Kiryl Makhvienia'
          ></Image>
        </GridItem>
        <GridItem colSpan={{ base: 3, md: 3 }}>
          <Text color={'#125854'}>Kiryl Makhvienia</Text>
          <Text color={'green'}>Software Developer</Text>
          <Text>
            Project setup. Integrate auth service, handle errors. Registration
            api integration. Display products on the main page.{' '}
          </Text>
          <Link href='https://github.com/mahveenya'>
            {' '}
            GitHub profile
            <LuExternalLink color={'green'} />
          </Link>
        </GridItem>

        <GridItem colStart={3} colSpan={3}>
          <Text>
            Originally from Belarus, and having finished courses there, Kiryl
            Makhvienia now lives in Lithuania, where he works as a software
            tester. He's currently studying Python, as it's required for his
            main job. With a sharp eye for detail and a love for figuring out
            how things work, Kiryl has always been drawn to the inner mechanics
            of digital products. “I enjoy testing because it’s like solving a
            puzzle,” he says. “You need to think critically, spot things others
            might miss, and make sure everything runs smoothly.” “What I love
            about frontend is the instant feedback. You write code — and you see
            the result right away. It’s creative and logical at the same time,”
            he explains. “It’s exciting to bring designs to life and make
            products feel intuitive for users.”
          </Text>
        </GridItem>
      </Grid>
    </Container>
  );
};
