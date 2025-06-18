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
import NavItem from '~components/Header/Nav-item';
import { useAuthContext } from '~/hooks/useAuthContext';
import { MenuItem } from '~types/types';
import {
  hamburgerWrapperStyle,
  headerContainerStyle,
  headerListStyle,
} from '~/styles/style.ts';

const navItems: MenuItem[] = [
  { label: 'About', to: '/about' },
  { label: 'Catalog', to: '/' },
  { label: '', to: '/basket' },
];

const loginRegisterItems: MenuItem[] = [
  { label: 'Login', to: '/login' },
  { label: 'Register', to: '/register' },
];

function Header() {
  const { isAuthenticated, logout } = useAuthContext();

  const guestItems = [...navItems, ...loginRegisterItems];
  const authItems = [
    ...navItems,
    { label: 'Profile', to: '/profile' },
    { label: 'Logout', to: '/', onClick: logout },
  ];
  const itemsToRender = isAuthenticated ? authItems : guestItems;

  const [isOpen, setOpen] = useState(false);
  return (
    <Container {...headerContainerStyle}>
      <VisuallyHidden>
        <Heading as='h1'>E-commerce. Shop smart. Live better.</Heading>
      </VisuallyHidden>
      <NavLink to='/'>
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
        gap='0.5'
      >
        <List.Root {...headerListStyle}>
          {itemsToRender.map(({ label, to, onClick }) => (
            <List.Item key={`${label}-${to}`}>
              <NavItem label={label} to={to} onClick={onClick} />
            </List.Item>
          ))}
        </List.Root>
      </Box>
      <Box {...hamburgerWrapperStyle}>
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
