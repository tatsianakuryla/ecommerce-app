import { NavLink } from 'react-router-dom';
import {
  Box,
  Container,
  List,
  Heading,
  Image,
  VisuallyHidden,
} from '@chakra-ui/react';
import logo from '../../assets/images/logo-without-bg.png';
import Hamburger from 'hamburger-react';
import { useState } from 'react';
import NavItem from '~components/Header/Nav-item.tsx';
import { useAuth } from '~hooks/useAuth.ts';
import { MenuItem } from '~types/types';

const navItems: MenuItem[] = [
  { label: 'About', to: '/about' },
  { label: 'Main', to: '/main' },
];

const loginRegisterItems: MenuItem[] = [
  { label: 'Login', to: '/login' },
  { label: 'Register', to: '/register' },
];

function Header() {
  const { isAuthenticated, logout } = useAuth();

  const guestItems = [...navItems, ...loginRegisterItems];
  const authItems = [
    ...navItems,
    { label: 'Logout', to: '/login', onClick: logout },
  ];
  const itemsToRender = isAuthenticated ? authItems : guestItems;

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
  };

  const listStyles = {
    display: 'flex',
    flexDirection: 'row',
    gap: { base: '0.5rem', md: '1rem' },
    listStyleType: 'none',
  };

  const [isOpen, setOpen] = useState(false);
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
          min-width='240px'
          alt='Logo of the company E-commerce. Shop smart. Live better.'
        />
      </NavLink>

      <Box
        as='nav'
        aria-label='Main navigation'
        display={{ base: 'none', md: 'flex' }}
        gap={{ base: '0.5rem', md: '1rem' }}
      >
        <List.Root {...listStyles}>
          {[...navItems, ...loginRegisterItems].map(({ label, to }) => (
            <List.Item key={to}>
              <NavItem label={label} to={to} />
            </List.Item>
          ))}
        </List.Root>
      </Box>
      <Box display={{ base: 'block', md: 'none' }} position='relative'>
        <Hamburger toggled={isOpen} toggle={setOpen} size={20} />

        {isOpen && (
          <Box
            as='nav'
            aria-label='Mobile navigation'
            position='absolute'
            top='calc(100% + 0.5rem)'
            right='0'
            bg='white'
            boxShadow='md'
            borderRadius='md'
            px='1rem'
            py='1rem'
            zIndex='overlay'
            w='250px'
          >
            <List.Root
              display='flex'
              flexDirection='column'
              gap='0.5rem'
              listStyleType='none'
            >
              {itemsToRender.map(({ label, to, onClick }) => (
                <List.Item key={label}>
                  <NavItem
                    label={label}
                    to={to}
                    onClick={() => {
                      setOpen(false);
                      onClick?.();
                    }}
                  />
                </List.Item>
              ))}
            </List.Root>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Header;
