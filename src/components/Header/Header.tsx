import { Box, Container, List, Heading, Link, Image } from '@chakra-ui/react'
import logo from '../../assets/images/logo-without-bg.png'

function Header() {
  const containerStyles = {
    maxW: 'container.xl',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    py: '0.5rem',
    px: '2rem',
    boxShadow: 'sm',
    bg: 'white',
    position: 'sticky',
    top: '0',
    zIndex: '1000',
  }

  const listStyles = {
    display: 'flex',
    flexDirection: 'row',
    gap: { base: '0.5rem', md: '1rem' },
    listStyleType: 'none',
  }

  const linkStyles = {
    fontSize: { base: 'sm', md: 'md' },
    fontWeight: 'semibold',
    color: 'white',
    bg: 'teal.500',
    px: '1rem',
    py: '0.5rem',
    borderRadius: 'md',
    _hover: {
      bg: 'teal.600',
      textDecoration: 'none',
    },
    _focus: {
      boxShadow: '0 0 0 2px teal.300',
      outline: 'none',
    },
    transition: 'background-color 0.2s ease',
  }

  return (
    <Container {...containerStyles}>
      <Heading as='h1' display='none'></Heading>

      <Image
        src={logo}
        height='100px'
        objectFit='contain'
        width='auto'
        alt='Logo of the company E-commerce'
      />
      <Box as='nav'>
        <List.Root {...listStyles}>
          {['About', 'Main', 'Login', 'Register'].map((item, index) => (
            <List.Item key={index}>
              <Link {...linkStyles} href={`#${item.toLowerCase()}`}>
                {item}
              </Link>
            </List.Item>
          ))}
        </List.Root>
      </Box>
    </Container>
  )
}

export default Header
