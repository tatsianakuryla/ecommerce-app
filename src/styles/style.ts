export const profileToastifyOptions = {
  duration: 3000,
  close: false,
  gravity: 'bottom',
  position: 'center',
  stopOnFocus: true,
  style: {
    padding: '10px',
    background: 'linear-gradient(to right, #00b09b, #96c93d)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
    fontSize: '16px',
    color: '#fff',
    bottom: '5px',
    marginBottom: '0',
    left: '0',
    position: 'fixed',
    zIndex: '9999',
    cursor: 'pointer',
    borderRadius: '8px',
  },
};

export const redirectionLoginLinkStyle = {
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

export const redirectionLinkBoxStyle = {
  color: 'teal.600',
  fontWeight: 'semibold',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
};

export const registrationButtonStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  marginTop: '1rem',
  backgroundColor: 'teal.500',
  color: '#fff',
  border: 'none',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  fontWeight: 600,
  transition: 'all 0.2s ease-in-out',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
};

export const formContainerStyle = {
  pos: 'relative',
  minWidth: 382,
  maxWidth: 382,
  margin: '2rem auto',
};

export const formIconStyle = {
  position: 'absolute',
  right: '0.5rem',
  top: '50%',
  transform: 'translateY(-50%)',
};

export const profileCardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  mb: '1rem',
};

export const profileProgressCircleBoxStyle = {
  minHeight: 'calc(100vh - 120px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const profileBoxStyle = {
  p: '0.5rem',
  borderWidth: '1px',
  borderRadius: 'xl',
  boxShadow: 'sm',
  bg: 'gray.50',
  transition: 'all 0.2s',
};

export const productCardStyles = {
  maxW: 'sm',
  overflow: 'hidden',
  height: '100%',
  borderRadius: '2xl',
  boxShadow: 'sm',
  transition: 'all 0.3s ease-in-out',
  _hover: {
    transform: 'scale(1.03)',
    boxShadow: 'lg',
    bg: 'gray.50',
  },
  _active: {
    transform: 'scale(1.01)',
    boxShadow: 'md',
  },
};

export const basketBadgeStyle = {
  position: 'absolute',
  bottom: '0.2rem',
  right: '0.1rem',
  fontSize: '0.6rem',
  color: 'teal.900',
  borderRadius: '0.1rem',
};

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

export const linkStyles = {
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

export const loginLinkStyle = {
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

export const registerLinkStyle = {
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
