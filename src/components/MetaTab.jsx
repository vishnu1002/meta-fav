import React, { useState } from 'react';
import { Box, Typography, Input, FormLabel, Button, IconButton, Alert, CircularProgress, Snackbar } from '@mui/joy';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { styles } from '../styles';  // Import shared styles

const MetaTab = () => {
  const [metaTags, setMetaTags] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  
  // State for character counts
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // URL validation
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const sanitizeInput = (input) => {
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .trim();
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.url) {
      errors.url = 'URL is required';
    } else if (!isValidUrl(data.url)) {
      errors.url = 'Please enter a valid URL';
    }
    if (!data.title) errors.title = 'Title is required';
    if (!data.description) errors.description = 'Description is required';
    return errors;
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.target);
    const data = {
      url: sanitizeInput(formData.get('url')),
      title: sanitizeInput(title),
      description: sanitizeInput(description),
      keywords: sanitizeInput(formData.get('keywords')),
      author: sanitizeInput(formData.get('author')),
    };

    // Validate form
    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      // Generate meta tags
      const generatedTags = `
<meta name="title" content="${data.title}">
<meta name="description" content="${data.description}">
<meta name="keywords" content="${data.keywords}">
<meta name="author" content="${data.author}">

<meta property="og:type" content="${data.url}">
<meta property="og:title" content="${data.title}">
<meta property="og:description" content="${data.description}">
<meta property="og:url" content="${data.url}">
<meta property="og:image" content="${data.url}/.../social-image.png">

<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="${data.title}">
<meta property="twitter:description" content="${data.description}">
<meta property="twitter:url" content="${data.url}">
<meta property="twitter:image" content="${data.url}/.../social-image.png">
      `.trim();

      setMetaTags(generatedTags);
      setErrors({});
    } catch (error) {
      setErrors({ submit: 'Failed to generate meta tags' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(metaTags)
      .then(() => {
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 3000);
      })
      .catch(() => {
        setErrors({ copy: 'Failed to copy to clipboard' });
      });
  };

  return (
    <Box sx={{ display: 'flex', p: 2, gap: 4 }}>
      <Box sx={{ width: '35%', minWidth: '300px' }}>
        <Typography level="h5" sx={{ mb: 2 }}>
          Generate Meta Tags
        </Typography>
        <form onSubmit={handleGenerate}>
          <FormLabel sx={{color: 'neutral.300', mb: 0.5}} >URL</FormLabel>
          <Input 
            name="url" 
            placeholder="https://example.com" 
            error={!!errors.url}
            sx={{ mb: errors.url ? 0.5 : 2 }} 
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
          <FormLabel sx={{color: 'neutral.300', mb: 0.5}} >Title</FormLabel>
          <Input 
            name="title" 
            placeholder="less than 60 characters" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Typography level="body-xs" sx={{ textAlign: 'right', color: 'neutral.500' }}>
            {title.length} / 60
          </Typography>
          <FormLabel sx={{color: 'neutral.300', mb: 0.5}} >Description</FormLabel>
          <Input 
            name="description" 
            placeholder="less than 110 characters" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Typography level="body-xs" sx={{ textAlign: 'right', color: 'neutral.500' }}>
            {description.length} / 110
          </Typography>
          <FormLabel sx={{color: 'neutral.300', mb: 0.5}} >Keywords</FormLabel>
          <Input name="keywords" placeholder="comma separated" sx={{ mb: 2 }} />
          <FormLabel sx={{color: 'neutral.300', mb: 0.5}} >Author</FormLabel>
          <Input name="author" placeholder="your name" sx={{ mb: 3 }} />
          <Button 
            type="submit" 
            variant="solid" 
            color="primary" 
            fullWidth
            loading={loading}
            sx={styles.sharedButton}
          >
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
          >
            <ContentCopyRoundedIcon />
          </IconButton>

          <SyntaxHighlighter
            language="html"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: '8px',
              width: '100%',
              maxHeight: '380px',
              backgroundColor: 'transparent',
              fontSize: '14px',
              lineHeight: '1.5',
            }}
          >
            {metaTags || '<!-- Generated meta tags will appear here -->'}
          </SyntaxHighlighter>
          <Typography 
            level="body-sm"
            sx={{
              mt: 2,
              textAlign: 'center',
              color: 'neutral.500',
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        Code copied to clipboard!
      </Snackbar>
    </Box>
  );
};

// Add PropTypes
MetaTab.propTypes = {
  // Add if you have props
};

// Browser compatibility check
const checkBrowserCompatibility = () => {
  const features = {
    clipboard: !!navigator.clipboard,
    formData: !!window.FormData,
    modules: 'noModule' in document.createElement('script'),
  };

  return Object.entries(features).reduce((acc, [key, supported]) => {
    if (!supported) acc.push(key);
    return acc;
  }, []);
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidMount() {
    const unsupportedFeatures = checkBrowserCompatibility();
    if (unsupportedFeatures.length > 0) {
      console.warn('Unsupported features:', unsupportedFeatures);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 2 }}>
          <Alert 
            color="danger" 
            variant="soft"
          >
            Something went wrong. Please try refreshing the page.
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Wrap the export with ErrorBoundary
export default function MetaTabWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <MetaTab />
    </ErrorBoundary>
  );
}
