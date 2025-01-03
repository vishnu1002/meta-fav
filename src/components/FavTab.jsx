import React, { useState, useRef } from 'react';
import { Box, Typography, Button, Alert, Grid, CircularProgress, IconButton, Snackbar } from '@mui/joy';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import GenerateIcon from '../assets/icons/generate.svg'; // Local SVG for Generate
import DownloadIcon from '../assets/icons/download.svg'; // Local SVG for Download
import CodeIcon from '../assets/icons/code.svg'; // Local SVG for Code
import CopyIcon from '../assets/icons/copy.svg'; // Local SVG for Copy
import { styles } from '../styles';  // Import shared styles
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import browserconfig from '../assets/user-config/browserconfig.xml?raw';
import manifest from '../assets/user-config/manifest.json?raw';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const FAVICON_SIZES = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
];

const APPLE_SIZES = [
  { size: 57, name: 'apple-touch-icon-57x57.png' },
  { size: 60, name: 'apple-touch-icon-60x60.png' },
  { size: 72, name: 'apple-touch-icon-72x72.png' },
  { size: 76, name: 'apple-touch-icon-76x76.png' },
  { size: 114, name: 'apple-touch-icon-114x114.png' },
  { size: 120, name: 'apple-touch-icon-120x120.png' },
  { size: 144, name: 'apple-touch-icon-144x144.png' },
  { size: 152, name: 'apple-touch-icon-152x152.png' },
  { size: 180, name: 'apple-touch-icon-180x180.png' },
];

const ANDROID_SIZES = [
  { size: 192, name: 'android-icon-192x192.png' },
  { size: 512, name: 'android-icon-512x512.png' },
];

const FavTab = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [processedImages, setProcessedImages] = useState(null);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef(null);
  const [showCode, setShowCode] = useState(false);
  const codeRef = useRef(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false); // For copy success notification

  const openFileDialog = () => {
    inputRef.current.click();
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      setError('Please upload an image file');
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setError('');
    
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      setError('Please upload an image file');
    }
  };

  const isValidImageType = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return validTypes.includes(file.type);
  };

  const processImage = async (file) => {
    setProcessing(true);
    try {
      const images = {
        favicons: [],
        appleIcons: [],
        androidIcons: [],
      };

      // Create canvas for image processing
      const createResizedImage = async (size) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;

        // Create image element
        const img = new Image();
        img.src = URL.createObjectURL(file);

        // Wait for image to load
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error('Failed to load image'));
        });

        // Draw and resize image
        ctx.drawImage(img, 0, 0, size, size);
        
        // Convert to blob
        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/png');
        });
      };

      // Process favicons
      for (const size of FAVICON_SIZES) {
        const blob = await createResizedImage(size.size);
        images.favicons.push({
          name: size.name,
          size: size.size,
          blob: blob,
          url: URL.createObjectURL(blob),
        });
      }

      // Process Apple touch icons
      for (const size of APPLE_SIZES) {
        const blob = await createResizedImage(size.size);
        images.appleIcons.push({
          name: size.name,
          size: size.size,
          blob: blob,
          url: URL.createObjectURL(blob),
        });
      }

      // Process Android icons
      for (const size of ANDROID_SIZES) {
        const blob = await createResizedImage(size.size);
        images.androidIcons.push({
          name: size.name,
          size: size.size,
          blob: blob,
          url: URL.createObjectURL(blob),
        });
      }

      setProcessedImages(images);
      setError(''); // Clear any previous errors
    } catch (err) {
      setError('Error processing image');
      console.error(err);
    }
    setProcessing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file first');
      return;
    }
    await processImage(selectedFile);
  };

  const downloadZip = async () => {
    if (!processedImages) {
      setError('No images to download');
      return;
    }

    const zip = new JSZip();

    // Add each image to the zip directly without a folder
    processedImages.favicons.forEach((image) => {
      zip.file(image.name, image.blob);
    });

    // Add Apple touch icons
    processedImages.appleIcons.forEach((image) => {
      zip.file(image.name, image.blob);
    });

    // Add Android icons
    processedImages.androidIcons.forEach((image) => {
      zip.file(image.name, image.blob);
    });

    // Add configuration files
    zip.file('browserconfig.xml', browserconfig);
    zip.file('manifest.json', manifest);

    // Generate the zip file
    const content = await zip.generateAsync({ type: "blob" });
    
    // Use FileSaver to save the zip file
    saveAs(content, "favicons.zip");
  };

  const downloadSingleImage = (blob, filename) => {
    saveAs(blob, filename);
  };

  const faviconCode = `
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">

<link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png">
<link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png">
<link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png">
<link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png">
<link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png">
<link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png">
<link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png">
<link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png">

<link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png"> <!-- Home screen shortcut -->
<link rel="icon" type="image/png" sizes="512x512" href="/android-icon-512x512.png"> <!-- Splash screen (PWAs) -->

<link rel="manifest" href="/manifest.json"> <!-- PWA manifest -->
<link rel="mask-icon" href="/icon.svg" color="#5bbad5"> <!-- Safari pinned tab icon -->

<meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
<meta name="msapplication-TileColor" content="#ffffff">
<meta name="theme-color" content="#ffffff"> <!-- Browser theme color -->

<!-- Paste the Generated Meta Tags -->
`;
  const copyCode = () => {
    navigator.clipboard.writeText(faviconCode)
      .then(() => {
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 3000);
      })
      .catch(() => {
        setError('Failed to copy to clipboard');
      });
  };

  const scrollToCode = () => {
    setShowCode(!showCode);
    setTimeout(() => {
      if (!showCode && codeRef.current) {
        codeRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  };

  const ImagePreviewSection = ({ title, images }) => (
    <Box sx={{ mb: 4 }}>
      <Typography level="h6" sx={{ mb: 2 }}>{title}</Typography>
      <Grid 
        container 
        spacing={3} 
        sx={{ 
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
          ml: 0,
        }}
      >
        {images.map((img) => (
          <Grid 
            key={img.name} 
            md="auto" 
            sm={3} 
            xs={4}
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <Box
              sx={{
                p: 2,
                borderColor: 'neutral.outlinedBorder',
                borderRadius: 'md',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                minWidth: '120px',
                bgcolor: 'background.level1',
                position: 'relative',
                '&:hover': {
                  '& .download-button': {
                    opacity: 1,
                  },
                  '& .image-container::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    borderRadius: 'sm',
                  },
                },
              }}
            >
              <IconButton
                className="download-button"
                size="sm"
                variant="soft"
                color="primary"
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                  '&:hover': {
                    bgcolor: '',
                  },
                  zIndex: 2,
                }}
                onClick={() => downloadSingleImage(img.blob, img.name)}
              >
                <img src={DownloadIcon} alt="Download" style={{ width: '20px', height: '20px' }} />
              </IconButton>

              <Box 
                className="image-container"
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: img.size > 120 ? '120px' : `${img.size}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                <img
                  src={img.url}
                  alt={img.name}
                  style={{
                    width: img.size > 120 ? '120px' : `${img.size}px`,
                    height: img.size > 120 ? '120px' : `${img.size}px`,
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Typography 
                level="body-xs" 
                sx={{ 
                  color: 'neutral.500',
                  mb: 3
                }}
              >
                {img.size}x{img.size}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography level="h5" sx={{ mb: 2 }}>
        Generate Favicons
      </Typography>

      {error && (
        <Alert 
          color="danger" 
          sx={{ mb: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
          sx={{
            border: '2px dashed',
            borderColor: dragActive ? 'primary.500' : 'neutral.outlinedBorder',
            borderRadius: 'lg',
            p: 4,
            mb: 2,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            bgcolor: dragActive ? 'background.level2' : 'background.level1',
            '&:hover': {
              bgcolor: 'background.level2',
              borderColor: 'primary.500',
            },
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{ display: 'none' }}
            id="file-input"
            aria-label="File upload input"
          />
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2,
            animation: dragActive ? 'pulse 1.5s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.05)' },
              '100%': { transform: 'scale(1)' },
            },
          }}>
            {selectedFile ? (
              <>
                <ImageRoundedIcon sx={{ fontSize: 48, color: 'primary.500' }} />
                <Typography level="body-md">
                  {selectedFile.name}
                </Typography>
              </>
            ) : (
              <>
                <FileUploadRoundedIcon sx={{ fontSize: 48, color: 'neutral.500' }} />
                <Typography level="body-md">
                  Drag and drop your image here or click to browse
                </Typography>
                <Typography level="body-sm" sx={{ color: 'neutral.500' }}>
                  Supports: PNG, JPG, JPEG
                </Typography>
              </>
            )}
          </Box>
        </Box>

        <Button 
          type="submit" 
          variant="solid" 
          color="primary" 
          fullWidth
          sx={styles.sharedButton}
          disabled={processing}
          startDecorator={processing && <CircularProgress size="sm" />}
          id="generate-favicons-button"
          aria-label="Generate Favicons"
        >
          <img src={GenerateIcon} alt="Generate" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
          {processing ? 'Processing...' : 'Generate Favicons'}
        </Button>
      </form>

      {processedImages && (
        <Box sx={{ mt: 4 }}>
          <ImagePreviewSection title="Favicons" images={processedImages.favicons} />
          <ImagePreviewSection title="Apple Touch Icons" images={processedImages.appleIcons} />
          <ImagePreviewSection title="Android Icons" images={processedImages.androidIcons} />

          <Typography sx={{textAlign: 'center'}} >
            Please ensure you edit the manifest.json file to match your website's specific requirements
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center',
            mt: 4 
          }}>
            <Button
              variant="solid"
              color="primary"
              startDecorator={<img src={DownloadIcon} alt="Download" style={{ width: '20px', height: '20px' }} />}
              onClick={downloadZip}
              sx={styles.sharedButton}
              id="download-zip-button"
              aria-label="Download ZIP of favicons"
            >
              Download ZIP
            </Button>
            <Button
              variant="outlined"
              color="neutral"
              startDecorator={<img src={CodeIcon} alt="Get Code" style={{ width: '20px', height: '20px' }} />}
              onClick={scrollToCode}
              sx={styles.sharedButton}
              id="get-code-button"
              aria-label="Get code for favicons"
            >
              {showCode ? 'Hide Code' : 'Get Code'}
            </Button>
          </Box>

          {showCode && (
            <Box 
              ref={codeRef}
              sx={{ 
                mt: 4, 
                position: 'relative',
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              <IconButton
                size="sm"
                variant="soft"
                color="primary"
                onClick={copyCode}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 2,
                }}
                id="copy-code-button"
                aria-label="Copy Code"
              >
                <img src={CopyIcon} alt="Copy" style={{ width: '20px', height: '20px' }} />
              </IconButton>
              <SyntaxHighlighter
                language="html"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: '8px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  backgroundColor: 'var(--joy-palette-background-level1)',
                }}
              >
                {faviconCode}
              </SyntaxHighlighter>
            </Box>
          )}
        </Box>
      )}
      
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

export default FavTab;