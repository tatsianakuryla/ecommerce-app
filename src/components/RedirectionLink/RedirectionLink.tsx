import { Link as ChakraLink } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { ReactElement } from 'react';
import {
  redirectionLinkBoxStyle,
  redirectionLoginLinkStyle,
} from '~/styles/style.ts';

function RedirectionLink({
  label,
  to,
  icon,
  link,
}: {
  label: string;
  to: string;
  icon: ReactElement;
  link: string;
}) {
  return (
    <Box display='flex' justifyContent='center' alignItems='center'>
      <ChakraLink asChild {...redirectionLoginLinkStyle}>
        <NavLink to={to}>
          <Box
            as='span'
            display='flex'
            alignItems='center'
            gap='0.5rem'
            fontSize='md'
          >
            {label}
            <Box as='span' {...redirectionLinkBoxStyle}>
              {link}
              {icon}
            </Box>
          </Box>
        </NavLink>
      </ChakraLink>
    </Box>
  );
}

export default RedirectionLink;
