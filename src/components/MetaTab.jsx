import React, { useState, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  Input,
  FormLabel,
  Button,
  Grid,
  IconButton,
  Snackbar,
  Textarea,
} from "@mui/joy";
import { styles } from "../styles";
import GenerateIcon from "../assets/icons/generate.svg";
import CopyIcon from "../assets/icons/copy.svg";
import TipIcon from '../assets/icons/tip.svg';

const MetaTab = () => {
  const [metaTags, setMetaTags] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const [formData, setFormData] = useState({
    url: "",
    title: "",
    description: "",
    keywords: "",
    author: "",
  });

  const codeRef = useRef(null);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const sanitizeInput = (input) => input.replace(/[<>]/g, "");

  const scrollToCode = () => {
    codeRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Validate only the URL field
    const validationErrors = {};
    if (!formData.url) {
      validationErrors.url = "URL is required";
    } else if (!isValidUrl(formData.url)) {
      validationErrors.url = "Please enter a valid URL";
    }

    // If there are validation errors for the URL, set them and stop the process
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      // Proceed with code generation regardless of other input values
      const generatedTags = `
<meta name="title" content="${formData.title || " "}">
<meta name="description" content="${formData.description || " "}">
<meta name="keywords" content="${formData.keywords || " "}">
<meta name="author" content="${formData.author || " "}">

<meta property="og:type" content="website">
<meta property="og:title" content="${formData.title || " "}">
<meta property="og:description" content="${formData.description || " "}">
<meta property="og:url" content="${formData.url}">
<meta property="og:image" content="${formData.url}social-image.png">

<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="${formData.title || " "}">
<meta property="twitter:description" content="${formData.description || " "}">
<meta property="twitter:url" content="${formData.url}">
<meta property="twitter:image" content="${formData.url}social-image.png">
      `.trim();

      setMetaTags(generatedTags);
      setShowCode(true);

      // Use setTimeout to allow the DOM to update before scrolling
      setTimeout(scrollToCode, 0);
      setErrors({});
    } catch (error) {
      setErrors({ submit: "Failed to generate meta tags" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(metaTags)
      .then(() => {
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 3000);
      })
      .catch(() => {
        setErrors({ copy: "Failed to copy to clipboard" });
      });
  }, [metaTags]);

  return (
    <Box
      sx={{
        display: "flex",
        p: 2,
        gap: 4,
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Form Section */}
      <Box sx={{ width: "100%" }}>
        <Typography level="h5" sx={{ mb: 2 }}>
          Generate Meta Tags
        </Typography>
        <form onSubmit={handleGenerate}>
          <Grid container spacing={2}>
            {/* URL Input */}
            <Grid xs={12} sm={4}>
              <FormLabel sx={{ color: "neutral.400" }} htmlFor="url-input">
                URL
              </FormLabel>
              <Input
                name="url"
                placeholder="https://example.com"
                error={!!errors.url}
                sx={{ mb: errors.url ? 0.5 : 2, color: "primary.300" }}
                id="url-input"
                aria-label="URL input"
                value={formData.url}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    url: sanitizeInput(e.target.value),
                  })
                }
              />
              {errors.url && (
                <Typography level="body-xs" color="danger" sx={{ mb: 2 }}>
                  {errors.url}
                </Typography>
              )}
            </Grid>

            {/* Title Input */}
            <Grid xs={12} sm={4}>
              <FormLabel sx={{ color: "neutral.400" }} htmlFor="title-input">
                Title
              </FormLabel>
              <Input
                name="title"
                placeholder="less than 60 characters"
                value={formData.title}
                sx={{ color: "primary.300" }}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: sanitizeInput(e.target.value),
                  })
                }
                id="title-input"
                aria-label="Title input"
              />
              <Typography
                level="body-xs"
                sx={{ textAlign: "right", color: "neutral.300" }}
              >
                {formData.title.length} char / 60
              </Typography>
            </Grid>

            {/* Author Input */}
            <Grid xs={12} sm={4}>
              <FormLabel sx={{ color: "neutral.400" }} htmlFor="author-input">
                Author
              </FormLabel>
              <Input
                name="author"
                placeholder="your name"
                value={formData.author}
                sx={{ color: "primary.300" }}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    author: sanitizeInput(e.target.value),
                  })
                }
                id="author-input"
                aria-label="Author input"
              />
            </Grid>

            {/* Description Input */}
            <Grid xs={12} sm={6}>
              <FormLabel
                sx={{ color: "neutral.400" }}
                htmlFor="description-input"
              >
                Description
              </FormLabel>
              <Textarea
                id="description-input"
                aria-label="Description Input"
                name="description-input"
                placeholder="less than 110 characters"
                value={formData.description}
                sx={{ color: "primary.300" }}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: sanitizeInput(e.target.value),
                  })
                }
                minRows={3}
              />
              <Typography
                level="body-xs"
                sx={{ textAlign: "right", color: "neutral.300" }}
              >
                {formData.description.length} char / 110
              </Typography>
            </Grid>

            {/* Keywords Input */}
            <Grid xs={12} sm={6}>
              <FormLabel sx={{ color: "neutral.400" }} htmlFor="keywords-input">
                Keywords
              </FormLabel>
              <Textarea
                id="keywords-input"
                aria-label="Keywords Input"
                name="keywords-input"
                placeholder="comma separated"
                value={formData.keywords}
                sx={{ color: "primary.300" }}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    keywords: sanitizeInput(e.target.value),
                  })
                }
                minRows={3}
              />
              <Typography
                level="body-xs"
                sx={{ textAlign: "right", color: "neutral.300" }}
              >
                {formData.keywords
                  ? formData.keywords.split(",").filter(Boolean).length
                  : 0}{" "}
                keywords
              </Typography>
            </Grid>
          </Grid>

          {/* Generate Meta Tags - Button */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              type="submit"
              variant="solid"
              color="primary"
              loading={loading}
              sx={styles.sharedButton}
              id="generate-meta-tags-button"
              aria-label="Generate Meta Tags"
            >
              <img
                src={GenerateIcon}
                alt="Generate"
                style={{ width: "20px", height: "20px", marginRight: "8px" }}
              />
              {loading ? "Generating..." : "Generate Meta Tags"}
            </Button>
          </Box>
        </form>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: '',
          mt: 2,
          p: 2,
          border: "1px solid",
          borderColor: "neutral.outlinedBorder",
          borderRadius: "md",
          bgcolor: "background.level1",
          boxShadow: "md",
          width: 'fit-content',
          textAlign: "left",
        }}
      >
        <img
          src={TipIcon}
          alt="Tip"
          style={{
            width: '24px',
            height: '24px',
            marginRight: '16px',
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography>
          • Copy the generated code into the {'<head>'} section
          </Typography>
          <Typography>
          • Ensure that the path to `./social-image.png` is correctly specified
          </Typography>
        </Box>
      </Box>

      {/* Code Display Section */}
      {showCode && (
        <Box
          ref={codeRef}
          sx={{
            width: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "800px",
              position: "relative",
              border: "1px solid neutral.outlinedBorder",
              borderRadius: "md",
              bgcolor: "background.level1",
              boxShadow: "md",
              p: 2,
              overflow: "hidden",
            }}
          >
            <IconButton
              onClick={handleCopy}
              variant="soft"
              color="primary"
              size="sm"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 2,
              }}
              id="copy-generated-code-button"
              aria-label="Copy Code"
            >
              <img
                src={CopyIcon}
                alt="Copy"
                style={{ width: "20px", height: "20px" }}
              />
            </IconButton>

            <Textarea
              aria-label="Meta Gen Code"
              id="meta-gen-code"
              name="meta-gen-code"
              className="lang-html"
              readOnly
              value={metaTags}
              sx={{
                margin: 0,
                border: "none",
                width: "100%",
                height: "auto",
                fontSize: "14px",
                lineHeight: "1.5",
                color: "primary.300",
                bgcolor: "transparent",
                boxShadow: "none",
                "&:focus": {
                  outline: "none",
                },
              }}
            />
          </Box>
        </Box>
      )}

      {/* Success Notification */}
      <Snackbar
        variant="soft"
        color="success"
        open={showCopySuccess}
        onClose={() => setShowCopySuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        Code copied to clipboard!
      </Snackbar>
    </Box>
  );
};

export default MetaTab;
