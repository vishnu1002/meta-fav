// src/theme.js
import { extendTheme } from '@mui/joy/styles';

const darkTheme = extendTheme({
  fontFamily: {
    body: '"Google Sans"',
    display: '"Google Sans"',
  },
  typography: {
    h1: {
      fontFamily: '"Google Sans"',
    },
    h2: {
      fontFamily: '"Google Sans"',
    },
    h3: {
      fontFamily: '"Google Sans"',
    },
    h4: {
      fontFamily: '"Google Sans"',
    },
    h5: {
      fontFamily: '"Google Sans"',
    },
    h6: {
      fontFamily: '"Google Sans"',
    },
    body1: {
      fontFamily: '"Google Sans"',
    },
    body2: {
      fontFamily: '"Google Sans"',
    },
  },
  colorSchemes: {
    dark: {
      palette: {
        background: {
          body: '#121212', // Dark background for the whole body
          level1: '#1E1E1E', // For cards or containers
          level2: '#2E2E2E', // Slightly darker for contrast
          level3: '#424242', // For the surface components
        },
        text: {
          primary: '#ffffff', // Primary text color
          secondary: '#B0B0B0', // Muted text
        },
      },
    },
  },
});

export default darkTheme;
