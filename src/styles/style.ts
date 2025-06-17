export const aboutUs = {
  containerFlex: {
    width: '100%',
    flexDirection: { base: 'column-reverse', md: 'row' },
    justifyContent: 'flex-end',
    mb: { base: '2rem', md: '4rem' },
  },
  title: {
    flex: 1,
    minWidth: '0',
    textAlign: 'center',
    pr: { base: '0rem', md: '4rem' },
    lineHeight: 'tall',
  },
  link: {
    _focus: { outline: 'none', boxShadow: 'none' },
    justifyContent: { base: 'center' },
    mb: { base: '1rem' },
  },
  grid: {
    templateRows: { base: 'auto auto auto', md: 'auto 1fr' },
    templateColumns: { base: '1fr', md: '350px 1fr' },
    gap: 4,
    mb: '2rem',
    p: { base: '1rem', md: '2rem' },
    background: 'gray.100',
  },
  gridRight: {
    templateRows: { base: 'auto auto auto', md: 'auto 1fr' },
    templateColumns: { base: '1fr', md: '1fr 350px' },
    gap: 4,
    mb: '2rem',
    p: { base: '1rem', md: '2rem' },
    boxShadow: 'lg',
    position: 'relative',
  },
  infoSection: {
    colSpan: { base: 1, md: 1 },
    order: { base: 2, md: 1 },
    textAlign: { base: 'center', md: 'left' },
  },
  imageContainer: {
    rowSpan: { base: 1, md: 2 },
    colSpan: { base: 1, md: 1 },
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'start',
  },
  imageContainerRight: {
    rowSpan: { base: 1, md: 2 },
    colSpan: { base: 1, md: 1 },
    display: 'flex',
    justifyContent: { base: 'center', md: 'flex-end' },
    order: { base: 1, md: 2 },
    mb: { base: 4, md: 0 },
    alignSelf: 'start',
  },
  image: {
    objectFit: 'contain',
    minWidth: '240px',
    textAlign: { md: 'top' },
    // maxWidth: { base: '180px', md: '100%' },
  },
  nameSection: {
    colSpan: { base: 1, md: 1 },
    textAlign: { base: 'center', md: 'left' },
  },
  bioSection: {
    colStart: { base: 1, md: 2 },
    colSpan: { base: 1, md: 1 },
    pt: { base: 4, md: 0 },
  },
  bioSectionRight: {
    colSpan: { base: 1, md: 1 },
    order: 3,
    pt: { base: 4, md: 0 },
  },

  text: {
    fontSize: { base: 'sm', md: 'md' },
    lineHeight: 'tall',
  },
};

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
  minWidth: { base: 320, md: 382 },
  maxWidth: { base: 320, md: 382 },
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
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minH: '420px',
  maxW: '300px',
  w: '100%',
  overflow: 'hidden',
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

export const productCardTextStyle = {
  textStyle: '2xl',
  fontWeight: 'medium',
  letterSpacing: 'tight',
  mt: '2',
};
