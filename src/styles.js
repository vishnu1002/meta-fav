import { tabClasses } from '@mui/joy/Tab';

const sharedButtonStyles = {
  height: '42px',
  fontSize: 'sm',
  fontWeight: 600,
  px: 3,
  borderRadius: 'lg',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: 'sm',
  },
};

export const styles = {
  rootBox: {
    bgcolor: 'background.body',
    minHeight: '100vh',
    width: '100%',
    color: 'text.primary',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    p: 2,
    boxSizing: 'border-box',
  },
  containerBox: {
    width: '100%',
    maxWidth: '990px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    mt: 2,
    mx: 'auto',
    padding: '0 16px',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  title: {
    mb: 4,
    textAlign: 'center',
  },
  tabs: {
    mb: 3,
    bgcolor: 'transparent',
    mx: 'auto',
  },
  tabList: (tabIndex, slideIn) => ({
    position: 'relative',
    p: 0.5,
    gap: 0.5,
    borderRadius: 'xl',
    bgcolor: 'background.level2',
    display: 'inline-flex',
    justifyContent: 'center',
    width: 'auto',
    mx: 'auto',
    overflow: 'hidden',
    [`& .${tabClasses.root}[aria-selected="true"]`]: {
      bgcolor: 'transparent',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      color: 'primary.plainColor',
    },
    [`& .${tabClasses.root}`]: {
      px: 2,
      py: 1,
      minHeight: 36,
      width: 100,
      fontSize: 'sm',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      height: 'calc(100% - 8px)',
      width: 100,
      top: '4px',
      left: tabIndex === 0 ? '4px' : 'calc(100px + 8px)',
      transform: 'none',
      bgcolor: 'background.surface',
      borderRadius: 'lg',
      transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
      animation: `${slideIn} 0.4s cubic-bezier(0.4, 0, 0.2, 1)`,
      zIndex: 0,
    },
  }),
  contentBox: {
    mt: 2,
    width: '100%',
    mx: 'auto',
  },
  sharedButton: sharedButtonStyles,
  '@media (max-width: 600px)': {
    containerBox: {
      padding: '0 8px',
    },
    title: {
      fontSize: '1.5rem',
    },
    tabList: {
      flexDirection: 'column',
    },
  },
}; 