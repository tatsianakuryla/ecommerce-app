import { Link as ChakraLink } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { ReactElement } from 'react';

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
  const loginLinkStyle = {
    textDecoration: 'none',
    _hover: {
      textDecoration: 'none',
      boxShadow: '0 0 0 3px rgba(56, 178, 172, 0.6)',
    },
    _focus: {
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(56, 178, 172, 0.6)',
    },
    _active: {
      transform: 'scale(0.98)',
    },
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
  };

  return (
    <Box display='flex' justifyContent='center' alignItems='center'>
      <ChakraLink asChild {...loginLinkStyle}>
        <NavLink to={to}>
          <Box
            as='span'
            display='flex'
            alignItems='center'
            gap='0.5rem'
            fontSize='md'
          >
            {label}
            <Box
              as='span'
              color='teal.600'
              fontWeight='semibold'
              display='flex'
              alignItems='center'
              gap='0.25rem'
            >
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
