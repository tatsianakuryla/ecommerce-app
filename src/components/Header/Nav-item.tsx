import {
  Badge,
  Box,
  Link as ChakraLink,
  type LinkProps,
} from '@chakra-ui/react';
import {
  FiHome,
  FiInfo,
  FiLogIn,
  FiUserPlus,
  FiUser,
  FiBookOpen,
  FiShoppingCart,
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import {
  basketBadgeStyle,
  linkStyles,
  loginLinkStyle,
  registerLinkStyle,
} from '~/styles/style';
import { useCart } from '~hooks/useCart';
import { NavItemProperties } from '~types/types';

export default function NavItem({ label, to, onClick }: NavItemProperties) {
  const { cart } = useCart();
  const totalCount =
    cart?.lineItems.reduce((sum, li) => sum + li.quantity, 0) ?? 0;

  let icon: React.ReactNode;
  switch (to) {
    case '/':
      icon = <FiHome />;
      break;
    case '/about':
      icon = <FiInfo />;
      break;
    case '/login':
      icon = <FiLogIn />;
      break;
    case '/register':
      icon = <FiUserPlus />;
      break;
    case '/profile':
      icon = <FiUser />;
      break;
    case '/basket':
      icon = (
        <Box position='relative' display='inline-block'>
          <FiShoppingCart size='1.2em' />
          {totalCount > 0 && <Badge {...basketBadgeStyle}>{totalCount}</Badge>}
        </Box>
      );
      break;
    default:
      icon = <FiBookOpen />;
  }

  const style: LinkProps =
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
