import React from 'react';
import { Box, Typography, Input, Button } from '@mui/joy';

const FavTab = () => (
  <Box sx={{ p: 2 }}>
    <Typography level="h2" sx={{ mb: 2 }}>
      Generate Favicons
    </Typography>
    <form>
      <Input type="file" accept="image/png" sx={{ mb: 2 }} />
      <Button type="submit" variant="solid" color="primary">
        Generate Favicons
      </Button>
    </form>
  </Box>
);

export default FavTab;
