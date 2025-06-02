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
  p: '2rem',
  borderWidth: '1px',
  borderRadius: 'xl',
  boxShadow: 'sm',
  bg: 'gray.50',
  transition: 'all 0.2s',
};
