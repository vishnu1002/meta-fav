import React from 'react';
import { Box, Typography, Input, Button } from '@mui/joy';

const MetaTab = () => (
  <Box sx={{ p: 2, width: '50%' }}>
    <Typography level="h5" sx={{ mb: 2 }}>
      Generate Meta Tags
    </Typography>
    <form>
      <Input placeholder="URL" sx={{ mb: 1 }} />
      <Input placeholder="Title" sx={{ mb: 1 }} />
      <Input placeholder="Description" sx={{ mb: 1 }} />
      <Input placeholder="Keywords" sx={{ mb: 1 }} />
      <Input placeholder="Author" sx={{ mb: 1 }} />
      <Input placeholder="Email" sx={{ mb: 2 }} />
      <Button type="submit" variant="solid" color="primary">
        Generate Meta Tags
      </Button>
    </form>
  </Box>
);

export default MetaTab;
