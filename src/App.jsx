import React, { useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import { keyframes } from '@mui/system';
import MetaTab from './components/MetaTab';
import FavTab from './components/FavTab';
import darkTheme from './theme';
import { styles } from './styles';

function App() {
  const [tabIndex, setTabIndex] = useState(0);

  const slideIn = keyframes`
    from {
      transform: translateX(${tabIndex === 0 ? '-100%' : '100%'});
      opacity: 0.5;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  `;

  // Pre-render both tabs
  const tabs = [
    <MetaTab key="meta" />,
    <FavTab key="fav" />
  ];

  return (
    <CssVarsProvider theme={darkTheme} defaultMode="dark">
      <Box sx={styles.rootBox}>
        <Box sx={styles.containerBox}>
          <Typography level="h4" sx={styles.title}>
            metafav.
          </Typography>

          <Tabs
            value={tabIndex}
            onChange={(event, newValue) => setTabIndex(newValue)}
            aria-label="Meta-Fav Tabs"
            sx={styles.tabs}
          >
            <TabList
              disableUnderline
              sx={styles.tabList(tabIndex, slideIn)}
            >
              <Tab disableIndicator>Meta tags</Tab>
              <Tab disableIndicator>Fav icons</Tab>
            </TabList>
          </Tabs>

          <Box sx={styles.contentBox}>
            {/* Use pre-rendered tabs */}
            <Box sx={{ 
              display: tabIndex === 0 ? 'block' : 'none',
              width: '100%'
            }}>
              {tabs[0]}
            </Box>
            <Box sx={{ 
              display: tabIndex === 1 ? 'block' : 'none',
              width: '100%'
            }}>
              {tabs[1]}
            </Box>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}

export default App;
