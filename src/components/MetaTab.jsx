import React, { useState } from 'react';
import { Box, Typography, Input, FormLabel, Button, IconButton } from '@mui/joy';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';

const MetaTab = () => {
  const [metaTags, setMetaTags] = useState('');

  const handleGenerate = (event) => {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(event.target);
    const url = formData.get('url');
    const title = formData.get('title');
    const description = formData.get('description');
    const keywords = formData.get('keywords');
    const author = formData.get('author');
    const email = formData.get('email');

    // Generate meta tags
    const generatedTags = `
<meta name="title" content="${title}">
<meta name="description" content="${description}">
<meta name="keywords" content="${keywords}">
<meta name="author" content="${author}">
<meta name="email" content="${email}">

<meta property="og:type" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:email" content="${email}">
<meta property="og:image" content="${url}/.../social-image.png">

<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:url" content="${url}">
<meta property="twitter:image" content="${url}/.../social-image.png">
    `.trim();

    setMetaTags(generatedTags);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(metaTags);
  };

  return (
    <Box sx={{ display: 'flex', p: 2, gap: 4 }}>
      <Box sx={{ width: '35%', minWidth: '300px' }}>
        <Typography level="h5" sx={{ mb: 2 }}>
          Generate Meta Tags
        </Typography>
        <form onSubmit={handleGenerate}>
          <FormLabel>URL</FormLabel>
          <Input name="url" placeholder="URL" sx={{ mb: 1 }} />
          <FormLabel>Title</FormLabel>
          <Input name="title" placeholder="Title" sx={{ mb: 1 }} />
          <FormLabel>Description</FormLabel>
          <Input name="description" placeholder="Description" sx={{ mb: 1 }} />
          <FormLabel>Keywords</FormLabel>
          <Input name="keywords" placeholder="Keywords" sx={{ mb: 1 }} />
          <FormLabel>Author</FormLabel>
          <Input name="author" placeholder="Author" sx={{ mb: 1 }} />
          <FormLabel>Email</FormLabel>
          <Input name="email" placeholder="Email" sx={{ mb: 2 }} />
          <Button type="submit" variant="solid" color="primary" fullWidth>
            Generate Meta Tags
          </Button>
        </form>
      </Box>

      {/* Code Display Section */}
      <Box sx={{ 
        width: '65%', 
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}>
        <Typography level="h6">
          Generated Code
        </Typography>
        
        <Box sx={{ 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <IconButton
            onClick={handleCopy}
            variant="soft"
            color="neutral"
            size="sm"
            sx={{
              position: 'absolute',
              top: '8px',
              right: '20px',
              zIndex: 2,
              bgcolor: 'background.level1',
              '&:hover': {
                bgcolor: 'background.level2',
              }
            }}
          >
            <ContentCopyRoundedIcon />
          </IconButton>

          <SyntaxHighlighter
            language="html"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: '8px',
              width: 'auto',
              minHeight: '360px',
              backgroundColor: 'var(--joy-palette-background-level1)',
              position: 'relative',
              lineHeight: '1.5',
            }}
          >
            {metaTags || '<!-- Generated meta tags will appear here -->'}
          </SyntaxHighlighter>
        </Box>
      </Box>
    </Box>
  );
};

export default MetaTab;
