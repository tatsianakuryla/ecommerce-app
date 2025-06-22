import type { ToastOptions } from 'toastify-js';

export const createProfileToastOptions = (text: string): ToastOptions => ({
  text,
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
});

//Profile
export const profileBoxStyle = {
  p: '0.5rem',
  borderWidth: '1px',
  borderRadius: 'xl',
  boxShadow: 'sm',
  bg: 'gray.50',
  transition: 'all 0.2s',
};

export const basketBadgeStyle = {
  position: 'absolute',
  top: '-18px',
  right: '-18px',
  bg: 'red.500',
  color: 'white',
  borderRadius: 'full',
  fontSize: 'xs',
  lineHeight: '1',
  px: '0.35em',
  minW: '1.1em',
  height: '1.1em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
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

//Header
export const headerContainerStyle = {
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

export const headerListStyle = {
  display: 'flex',
  flexDirection: 'row',
  gap: '2',
  listStyleType: 'none',
};

export const hamburgerWrapperStyle = {
  display: { base: 'block', md: 'none' },
  position: 'relative',
};

// Add-remove items button
export const addRemoveButtonStyle = {
  flex: '1',
  bg: 'gray.300',
  color: 'gray.600',
  fontWeight: 'semibold' as const,
  fontSize: 'sm' as const,
  borderRadius: 'md' as const,
  px: 4,
  py: 3,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
};

export const removeButtonStyle = {
  bg: 'red.500',
  color: 'white',
  _hover: { bg: 'red.600' },
  transition: 'background-color 0.2s ease-in-out',
};

export const addButtonStyle = {
  bg: 'teal.500',
  color: 'white',
  _hover: { bg: 'teal.600' },
  transition: 'background-color 0.2s ease-in-out',
};

// About page
export const teamCardBoxStyle = {
  bg: 'white',
  shadow: 'md',
  borderRadius: 'lg',
  overflow: 'hidden',
  _hover: { shadow: 'lg' },
  transition: 'box-shadow 0.2s ease-in-out',
};

export const teamImageStyle = {
  objectFit: 'cover',
  w: { base: '100%', md: '150px' },
  transition: 'transform 0.2s ease-in-out',
};

export const githubLinkStyle = {
  fontSize: 'sm',
  display: 'inline-flex',
  alignItems: 'center',
  color: 'teal.500',
  _hover: { textDecor: 'underline' },
  transition: 'color 0.2s ease-in-out, text-decoration 0.2s ease-in-out',
};

export const teamCardNameStyle = {
  fontSize: 'lg',
  fontWeight: 'bold',
  color: 'teal.600',
  transition: 'color 0.2s ease-in-out',
};

export const teamCardRoleStyle = {
  fontSize: 'sm',
  fontWeight: 'medium',
  color: 'green.500',
  mb: 2,
  transition: 'color 0.2s ease-in-out',
};

export const teamCardDescStyle = {
  fontSize: 'sm',
  mb: 3,
  transition: 'color 0.2s ease-in-out',
};

export const collapsibleTriggerStyle = {
  fontSize: 'sm',
  color: 'teal.500',
  _hover: { textDecor: 'underline' },
  cursor: 'pointer',
  transition: 'color 0.2s ease-in-out, text-decoration 0.2s ease-in-out',
};

export const collapsibleContentTextStyle = {
  fontSize: 'sm',
  color: 'gray.600',
  whiteSpace: 'pre-line',
  transition: 'color 0.2s ease-in-out',
};

export const aboutPageTextContainer = {
  fontSize: { base: 'lg', md: 'xl' },
  flex: '1',
  mb: 4,
  transition: 'color 0.2s ease-in-out',
};

export const footerTextStyle = {
  fontSize: 'sm',
  color: 'gray.500',
  mb: 2,
  transition: 'color 0.2s ease-in-out',
};

export const rsSchoolLinkStyle = {
  fontSize: 'md',
  fontWeight: 'semibold',
  color: 'teal.600',
  display: 'inline-flex',
  alignItems: 'center',
  _hover: { textDecor: 'underline', color: 'teal.800' },
  transition: 'color 0.2s ease-in-out, text-decoration 0.2s ease-in-out',
};

export const rsSchoolLogoStyle = {
  boxSize: { base: '32px', md: '32px' },
  alt: 'RS School Logo',
  mr: 2,
};

// Breadcrumbs
export const breadcrumbRootStyle = {
  mb: '1rem',
};

export const breadcrumbListStyle = {
  gap: '8px',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
};

export const breadcrumbLinkStyle = {
  color: 'teal.600',
  fontWeight: 'medium',
  textDecoration: 'none',
  transition: 'color 0.2s ease-in-out, text-decoration 0.2s ease-in-out',
  _hover: {
    textDecoration: 'underline',
    color: 'teal.800',
  },
};

export const breadcrumbCurrentStyle = {
  fontWeight: '600',
  color: 'gray.700',
  transition: 'color 0.2s ease-in-out',
};

// CategoryNode
export const categoryBoxStyle = {
  pl: '1rem',
  w: '100%',
};

export const categoryItemWrapperStyle = {
  align: 'start',
  gap: 1,
};

export const iconButtonStyle = {
  mr: '0.25rem',
  transition: 'transform 0.2s ease-in-out',
  _hover: {
    transform: 'scale(1.1)',
    bg: 'gray.100',
  },
};

export const categoryLinkStyle = (isActive: boolean) => ({
  fontWeight: isActive ? 'bold' : 'normal',
  color: isActive ? 'teal.700' : 'gray.700',
  transition: 'color 0.2s ease-in-out, text-decoration 0.2s ease-in-out',
  _hover: {
    textDecor: 'underline',
    color: 'teal.800',
  },
});

export const nestedChildrenWrapperStyle = {
  align: 'start',
  gap: 0,
  pl: 2,
};

// Category sidebar
export const categorySidebarBoxStyle = {
  w: '250px',
  p: '1rem',
  borderWidth: '1px',
  borderRadius: 'md',
  overflowY: 'auto',
  maxH: '80vh',
  bg: 'white',
  boxShadow: 'sm',
  transition: 'box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out',
};

export const categorySidebarTitleStyle = {
  fontSize: 'lg',
  mb: '0.5rem',
  fontWeight: 'semibold',
  color: 'teal.700',
  transition: 'color 0.2s ease-in-out',
};

export const categorySidebarErrorStyle = {
  color: 'red.500',
  fontWeight: 'medium',
  transition: 'color 0.2s ease-in-out',
};

export const categorySidebarListStyle = {
  align: 'start',
  gap: 1,
};

// Error alert
export const errorAlertStyle = {
  fontSize: 'sm',
  mb: '4',
  px: '2',
};

// Form
export const formContainerStyle = {
  pos: 'relative',
  minWidth: { base: 320, md: 382 },
  maxWidth: { base: 320, md: 382 },
  margin: '2rem auto',
  transition: 'all 0.2s ease-in-out',
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

export const formIconStyle = {
  position: 'absolute',
  right: '0.5rem',
  top: '50%',
  transform: 'translateY(-50%)',
};

export const formFieldBoxStyle = (hasError: boolean) => ({
  mb: hasError ? 2 : 4,
  transition: 'margin-bottom 0.2s ease-in-out',
});

export const formInputStyle = {
  borderColor: 'gray.300',
  borderRadius: 'md',
  _hover: { borderColor: 'gray.400' },
  _focus: { borderColor: 'teal.500' },
  transition: 'border-color 0.2s ease-in-out',
};

export const formInputErrorStyle = {
  borderColor: 'red.500',
  _hover: { borderColor: 'red.600' },
  _focus: { borderColor: 'red.600' },
  transition: 'border-color 0.2s ease-in-out',
};

export const formPasswordToggleStyle = {
  _hover: {
    bg: 'gray.100',
  },
  transition: 'all 0.2s ease-in-out',
};

// Login form
export const loginFormWrapperStyle = {
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  py: '1rem',
  transition: 'all 0.2s ease-in-out',
};

// Registration form
export const registrationAddAddressButtonStyle = {
  background: 'none',
  color: 'teal.600',
  padding: 0,
  height: 'auto',
  fontWeight: 'medium',
  fontSize: 'sm',
  _hover: {
    textDecoration: 'underline',
    background: 'none',
    color: 'teal.700',
  },
  _active: {
    background: 'none',
    transform: 'scale(0.97)',
  },
  _focus: {
    boxShadow: 'none',
  },
  transition: 'all 0.2s ease',
  mb: '1rem',
  mt: '1rem',
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

// Redirection link

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

export const redirectionLinkWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: 'md',
};

// Images slider

export const imageSliderBoxStyle = {
  bg: 'gray.100',
  borderRadius: 'md',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const sliderImageStyle = {
  objectFit: 'contain',
  h: '100%',
  w: '100%',
  borderRadius: 'md',
};

export const sliderIconStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: '2',
  bg: 'rgba(255,255,255,0.7)',
  _hover: { bg: 'rgba(255,255,255,0.9)' },
};

export const sliderWrapper = {
  position: 'absolute',
  bottom: '2',
  left: '50%',
  transform: 'translateX(-50%)',
  gap: '2',
};

// Product card
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

export const productCardTextStyle = {
  textStyle: '2xl',
  fontWeight: 'medium',
  letterSpacing: 'tight',
  mt: '2',
};

export const productCardImageStyle = {
  height: '240px',
  width: '100%',
  objectFit: 'contain',
};
