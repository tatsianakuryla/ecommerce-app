import { Box, Link as ChakraLink } from '@chakra-ui/react';
import {
  FiHome,
  FiInfo,
  FiLogIn,
  FiUserPlus,
  FiUser,
  FiBookOpen,
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

export default function NavItem({
  label,
  to,
  onClick,
}: {
  label: string;
  to: string;
  onClick?: () => void;
}) {
  const icon =
    to === '/' ? (
      <FiHome />
    ) : to === '/about' ? (
      <FiInfo />
    ) : to === '/login' ? (
      <FiLogIn />
    ) : to === '/register' ? (
      <FiUserPlus />
    ) : to === '/profile' ? (
      <FiUser />
    ) : to === '/' ? (
      <FiBookOpen />
    ) : null;

  const baseLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: 'md',
    fontWeight: 'semibold',
    px: '1rem',
    py: '0.5rem',
    borderRadius: 'xl',
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out',
    lineHeight: 1.2,
    minHeight: '40px',
    boxSizing: 'border-box',
  };

  const linkStyles = {
    ...baseLinkStyle,
    color: 'teal.700',
    bg: 'gray.100',
    _hover: {
      bg: 'gray.200',
      textDecoration: 'none',
    },
    _focus: {
      boxShadow: '0 0 0 2px teal.300',
      outline: 'none',
    },
    _activeLink: {
      bg: 'teal.100',
      color: 'teal.800',
    },
  };

  const loginLinkStyle = {
    ...baseLinkStyle,
    color: 'teal.600',
    border: '2px solid teal',
    bg: 'transparent',
    _hover: {
      bg: 'teal.50',
    },
    _focus: {
      boxShadow: '0 0 0 2px teal.900',
      outline: 'none',
    },
    _activeLink: {
      bg: 'teal.100',
    },
  };

  const registerLinkStyle = {
    ...baseLinkStyle,
    color: 'white',
    bg: 'teal.500',
    _hover: {
      bg: 'teal.600',
    },
    _focus: {
      boxShadow: '0 0 0 2px teal.300',
      outline: 'none',
    },
    _activeLink: {
      bg: 'teal.700',
    },
  };

  const style =
    to === '/login'
      ? loginLinkStyle
      : to === '/register'
        ? registerLinkStyle
        : linkStyles;

  return (
    <ChakraLink asChild {...style}>
      <NavLink to={to} onClick={onClick}>
        <Box as='span' display='flex' alignItems='center' gap='0.5rem'>
          {icon}
          {label}
        </Box>
      </NavLink>
    </ChakraLink>
  );
}
