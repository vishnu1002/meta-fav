import React, { useState, useMemo, lazy, Suspense } from 'react';
import { CssVarsProvider, Box, Typography, IconButton, Alert, Button } from '@mui/joy';
import Tabs from '@mui/joy/Tabs';
import Tab from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import { keyframes } from '@mui/system';
import darkTheme from './theme';
import { styles } from './styles';
import { ErrorBoundary } from 'react-error-boundary';
import GitHubIcon from './assets/icons/github.svg';

// Lazy load the components
const MetaTab = lazy(() => import('./components/MetaTab'));
const FavTab = lazy(() => import('./components/FavTab'));

function ErrorFallback({ error }) {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Alert color="danger" variant="soft" sx={{ mb: 2 }}>
        Something went wrong:
        <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      </Alert>
      <Button onClick={() => window.location.reload()} variant="soft">
        Try again
      </Button>
    </Box>
  );
}

function App() {
  const [tabIndex, setTabIndex] = useState(0);

  const slideIn = keyframes`
    from {
      transform: translateX(${tabIndex === 0 ? '-20px' : '20px'});
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  `;

  // Memoize tabs array
  const tabs = useMemo(() => [
    <MetaTab key="meta" />,
    <FavTab key="fav" />
  ], []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CssVarsProvider theme={darkTheme} defaultMode="dark">
        <Box sx={styles.rootBox}>
          <Box sx={styles.containerBox}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Typography level="h5">metafav.</Typography>
              <IconButton 
                aria-label="Vishnu1002 Github Repo"
                component="a" 
                href="https://github.com/vishnu1002/meta-fav"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={GitHubIcon} alt="GitHub" style={{ width: '24px', height: '24px' }} />
              </IconButton>
            </Box>

            <Tabs
              value={tabIndex}
              onChange={(event, newValue) => setTabIndex(newValue)}
              aria-label="Meta-Fav Tabs"
              sx={styles.tabs}
            >
              <TabList disableUnderline sx={styles.tabList(tabIndex, slideIn)}>
                <Tab disableIndicator>Meta Tags</Tab>
                <Tab disableIndicator>Favicons</Tab>
              </TabList>
            </Tabs>

            <Typography sx={{fontSize: '20px', color: 'neutral.300'}}>Boost traffic and visibility with metadata and favicons</Typography>
            {/* <Typography sx={{fontSize: '30px', color: 'neutral.300'}}></Typography> */}

            <Box sx={styles.contentBox}>
              <Box sx={{ display: tabIndex === 0 ? 'block' : 'none', width: '100%' }}>
                <Suspense fallback={<div>Loading...</div>}>
                  {tabs[0]}
                </Suspense>
              </Box>
              <Box sx={{ display: tabIndex === 1 ? 'block' : 'none', width: '100%' }}>
                <Suspense fallback={<div>Loading...</div>}>
                  {tabs[1]}
                </Suspense>
              </Box>
            </Box>
          </Box>
        </Box>
      </CssVarsProvider>
    </ErrorBoundary>
  );
}

export default App;