import { NavLink } from 'react-router-dom'
import {
  Box,
  Container,
  List,
  Heading,
  Image,
  VisuallyHidden,
  Link as ChakraLink,
} from '@chakra-ui/react'
import logo from '../../assets/images/logo-without-bg.png'

const navItems = [
  { label: 'About', to: '/about' },
  { label: 'Main', to: '/main' },
  { label: 'Login', to: '/login' },
  { label: 'Register', to: '/register' },
]

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
    px: '1rem',
    py: '0.5rem',
    borderRadius: '0.375rem',

    fontSize: { base: '0.875rem', md: '1rem' },
    fontWeight: 600,
    color: 'white',
    textDecoration: 'none',

    bg: 'teal.500',
    transition: 'background-color 0.2s ease',

    _hover: {
      textDecoration: 'none',
      bg: 'teal.600',
    },

    _focus: {
      outline: 'none',
      boxShadow: '0 0 0 2px teal.300',
    },
  }

  return (
    <Container {...containerStyles}>
      <VisuallyHidden>
        <Heading as='h1'>E-commerce. Shop smart. Live better.</Heading>
      </VisuallyHidden>
      <NavLink to='/main'>
        <Image
          src={logo}
          height='100px'
          objectFit='contain'
          width='auto'
          alt='Logo of the company E-commerce. Shop smart. Live better.'
        />
      </NavLink>

      <Box as='nav'>
        <List.Root {...listStyles}>
          {navItems.map(({ label, to }) => (
            <List.Item key={to}>
              <ChakraLink asChild {...linkStyles}>
                <NavLink to={to}>{label}</NavLink>
              </ChakraLink>
            </List.Item>
          ))}
        </List.Root>
      </Box>
    </Container>
  )
}

export default Header
