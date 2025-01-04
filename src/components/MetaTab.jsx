import React, { useState, useCallback } from 'react';
import { Box, Typography, Input, FormLabel, Button, IconButton, Snackbar, Textarea } from '@mui/joy';
import { styles } from '../styles';
import GenerateIcon from '../assets/icons/generate.svg';
import CopyIcon from '../assets/icons/copy.svg';

const MetaTab = () => {
  const [metaTags, setMetaTags] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    keywords: '',
    author: ''
  });

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const sanitizeInput = (input) => input.replace(/[<>]/g, '');

  const validateForm = (data) => {
    const errors = {};
    if (!data.url) errors.url = 'URL is required';
    else if (!isValidUrl(data.url)) errors.url = 'Please enter a valid URL';
    if (!data.title) errors.title = 'Title is required';
    if (!data.description) errors.description = 'Description is required';
    return errors;
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    setLoading(true);

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const generatedTags = `
<meta name="title" content="${formData.title}">
<meta name="description" content="${formData.description}">
<meta name="keywords" content="${formData.keywords}">
<meta name="author" content="${formData.author}">

<meta property="og:type" content="${formData.url}">
<meta property="og:title" content="${formData.title}">
<meta property="og:description" content="${formData.description}">
<meta property="og:url" content="${formData.url}">
<meta property="og:image" content="${formData.url}.../social-image.png">

<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="${formData.title}">
<meta property="twitter:description" content="${formData.description}">
<meta property="twitter:url" content="${formData.url}">
<meta property="twitter:image" content="${formData.url}.../social-image.png">
      `.trim();

      setMetaTags(generatedTags);
      setErrors({});
    } catch (error) {
      setErrors({ submit: 'Failed to generate meta tags' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(metaTags)
      .then(() => {
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 3000);
      })
      .catch(() => {
        setErrors({ copy: 'Failed to copy to clipboard' });
      });
  }, [metaTags]);

  return (
    <Box sx={{ display: 'flex', p: 2, gap: 4, mt: 2 }}>
      <Box sx={{ width: '35%', minWidth: '300px' }}>
        <Typography level="h5" sx={{ mb: 2 }}>
          Generate Meta Tags
        </Typography>
        <form onSubmit={handleGenerate}>
          <FormLabel sx={{ color: 'neutral.300', mb: 0.5 }} htmlFor="url-input">URL</FormLabel>
          <Input 
            name="url" 
            placeholder="https://example.com" 
            error={!!errors.url}
            sx={{ mb: errors.url ? 0.5 : 2 }} 
            id="url-input"
            aria-label="URL input"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: sanitizeInput(e.target.value) })}
          />
          {errors.url && (
            <Typography 
              level="body-xs" 
              color="danger" 
              sx={{ mb: 2 }}
            >
              {errors.url}
            </Typography>
          )}
          <FormLabel sx={{ color: 'neutral.300', mb: 0.5 }} htmlFor="title-input">Title</FormLabel>
          <Input 
            name="title" 
            placeholder="less than 60 characters" 
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: sanitizeInput(e.target.value) })}
            id="title-input"
            aria-label="Title input"
          />
          <Typography level="body-xs" sx={{ textAlign: 'right', color: 'neutral.300' }}>
            {formData.title.length} / 60
          </Typography>
          <FormLabel sx={{ color: 'neutral.300', mb: 0.5 }} htmlFor="description-input">Description</FormLabel>
          <Input 
            name="description" 
            placeholder="less than 110 characters" 
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: sanitizeInput(e.target.value) })}
            id="description-input"
            aria-label="Description input"
          />
          <Typography level="body-xs" sx={{ textAlign: 'right', color: 'neutral.300' }}>
            {formData.description.length} / 110
          </Typography>
          <FormLabel sx={{ color: 'neutral.300', mb: 0.5 }} htmlFor="keywords-input">Keywords</FormLabel>
          <Input 
            name="keywords" 
            placeholder="comma separated" 
            sx={{ mb: 2 }} 
            id="keywords-input"
            aria-label="Keywords input"
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: sanitizeInput(e.target.value) })}
          />
          <FormLabel sx={{ color: 'neutral.300', mb: 0.5 }} htmlFor="author-input">Author</FormLabel>
          <Input 
            name="author" 
            placeholder="your name" 
            sx={{ mb: 3 }} 
            id="author-input"
            aria-label="Author input"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: sanitizeInput(e.target.value) })}
          />
          <Button 
            type="submit" 
            variant="solid" 
            color="primary" 
            fullWidth
            loading={loading}
            sx={styles.sharedButton}
            id="generate-meta-tags-button"
            aria-label="Generate Meta Tags"
          >
            <img src={GenerateIcon} alt="Generate" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
            {loading ? 'Generating...' : 'Generate Meta Tags'}
          </Button>
        </form>
      </Box>

      {/* Code Display Section */}
      <Box sx={{ 
        width: '65%', 
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Box sx={{ 
          position: 'relative',
          bgcolor: 'background.level1',
          borderRadius: 'lg',
          p: 1,
        }}>
          <IconButton
            onClick={handleCopy}
            variant="soft"
            color="primary"
            size="sm"
            sx={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 2,
            }}
            id="copy-generated-code-button"
            aria-label="Copy Code"
          >
            <img src={CopyIcon} alt="Copy" style={{ width: '20px', height: '20px' }} />
          </IconButton>

          <Textarea
            aria-label='Meta Gen Code'
            id='meta-gen-code'
            name='meta-gen-code'
            className="lang-html"
            readOnly
            value={metaTags || '<!-- Generated meta tags will appear here -->'}
            sx={{
              margin: 0,
              borderStyle: 'none',
              width: '100%',
              height: 'auto',
              fontSize: '14px',
              lineHeight: '1.5',
              color: 'primary.300',
              bgcolor: 'transparent',
            }}
          />
          <Typography
            level="body-sm"
            sx={{
              mt: 2,
              textAlign: 'center',
              color: 'neutral.300',
            }}
          >
            Copy the code into your website &lt;head&gt;
          </Typography>
        </Box>
      </Box>

      {/* Success Notification */}
      <Snackbar
        variant="soft"
        color="success"
        open={showCopySuccess}
        onClose={() => setShowCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        Code copied to clipboard!
      </Snackbar>
    </Box>
  );
};

export default MetaTab;