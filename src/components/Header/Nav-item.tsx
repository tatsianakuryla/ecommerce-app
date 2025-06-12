import { Badge, Box, Link as ChakraLink } from '@chakra-ui/react';
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
import { useCart } from '~/contexts/cartContext';
import {
  basketBadgeStyle,
  linkStyles,
  loginLinkStyle,
  registerLinkStyle,
} from '~/styles/style';

export default function NavItem({
  label,
  to,
  onClick,
}: {
  label: string;
  to: string;
  onClick?: () => void;
}) {
  const { totalCount } = useCart();

  let icon = null;
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
        <Box>
          <FiShoppingCart size='1.2em' />
          {totalCount >= 0 && (
            <Badge size='xs' {...basketBadgeStyle}>
              {totalCount}
            </Badge>
          )}
        </Box>
      );
      break;
    default:
      icon = <FiBookOpen />;
  }

  const style =
    to === '/login'
      ? loginLinkStyle
      : to === '/register'
        ? registerLinkStyle
        : linkStyles;

  return (
    <ChakraLink asChild {...style} position='relative'>
      <NavLink to={to} onClick={onClick}>
        <Box as='span' display='flex' alignItems='center' gap='0.5rem'>
          {icon}
          {label}
        </Box>
      </NavLink>
    </ChakraLink>
  );
}
