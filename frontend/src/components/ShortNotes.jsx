import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { UploadFile, Description, Person } from '@mui/icons-material';

// Replace with your secure keys
const OCR_API_KEY = 'K89469803888957';
const GEMINI_API_KEY = 'AIzaSyBGR9Y2TgP8nt2KYrPdbJ5BAA-WGE_bGyk';

const ShortNotes = () => {
  const [file, setFile] = useState(null);
  const [notesData, setNotesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // --- Enhanced Function to Parse Gemini Response ---
  // Handles inline bold formatting within sentences
  function parseGeminiResponse(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const parsed = [];

    lines.forEach((line) => {
      // Case 1: Bullet + Bold Key-Value pair: • **Key:** Value
      const bulletBoldMatch = line.match(/^•\s+\*\*(.+?)\*\*:\s*(.*)/);
      if (bulletBoldMatch) {
        parsed.push({
          type: 'section',
          key: bulletBoldMatch[1].trim(),
          value: processBoldText(bulletBoldMatch[2].trim()),
          isBold: true,
          bullet: true,
        });
        return;
      }

      // Case 2: Bold Key-Value pair: **Key:** Value
      const boldMatch = line.match(/^\*\*(.+?)\*\*:\s*(.*)/);
      if (boldMatch) {
        parsed.push({
          type: 'section',
          key: boldMatch[1].trim(),
          value: processBoldText(boldMatch[2].trim()),
          isBold: true,
          bullet: false,
        });
        return;
      }

      // Case 3: Bullet list with plain text: • value
      const bulletOnlyMatch = line.match(/^•\s+(.*)/);
      if (bulletOnlyMatch) {
        parsed.push({
          type: 'bullet-point',
          value: processBoldText(bulletOnlyMatch[1].trim()),
        });
        return;
      }

      // Case 4: Fallback: Plain text (may contain inline bold)
      parsed.push({
        type: 'text',
        value: processBoldText(line.trim()),
      });
    });

    return parsed;
  }

  // New helper function to process inline bold text
  function processBoldText(text) {
    // If text contains no bold markers, return it as is
    if (!text.includes('**')) return text;

    // Extract parts marked as bold and create an array of segments
    // Each segment will be either normal text or bold text
    const segments = [];
    let currentIndex = 0;

    // Find all **text** patterns
    const boldPattern = /\*\*(.+?)\*\*/g;
    let match;
    
    while ((match = boldPattern.exec(text)) !== null) {
      // Add any text before this bold section
      if (match.index > currentIndex) {
        segments.push({
          type: 'regular',
          text: text.substring(currentIndex, match.index)
        });
      }
      
      // Add the bold text (without the ** markers)
      segments.push({
        type: 'bold',
        text: match[1] // The captured group inside **
      });
      
      // Update current position
      currentIndex = match.index + match[0].length;
    }
    
    // Add any remaining text after the last bold section
    if (currentIndex < text.length) {
      segments.push({
        type: 'regular',
        text: text.substring(currentIndex)
      });
    }

    return segments;
  }

  // --- Handler for File Input Changes ---
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setSuccess('');
      setNotesData([]);
    }
  };

  // --- Function to Extract Text from PDF using OCR.Space ---
  const extractTextFromPDF = async (pdfFile) => {
    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        apikey: OCR_API_KEY,
      },
      body: formData,
    });
    const result = await response.json();
    return result?.ParsedResults?.[0]?.ParsedText || '';
  };

  // --- Function to Generate Short Notes using Gemini API ---
  const generateWithGemini = async (text) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const body = {
      contents: [
        {
          parts: [
            {
              text: `Create detailed notes from the give text:\n\n${text}`,
            },
          ],
        },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    // Extract the notes text from the Gemini response
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  };

  // --- Main Handler for Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    setNotesData([]);

    try {
      // Step 1: Extract text from the PDF file
      const text = await extractTextFromPDF(file);
      if (!text.trim()) {
        setError('No text found in the PDF.');
        setIsLoading(false);
        return;
      }

      // Step 2: Generate notes via Gemini API
      const summary = await generateWithGemini(text);
      if (!summary.trim()) {
        setError('No summary generated from Gemini.');
        setIsLoading(false);
        return;
      }

      // Step 3: Parse the Gemini response into structured data
      const parsedNotes = parseGeminiResponse(summary);
      setNotesData(parsedNotes);
      setSuccess('Short notes generated successfully!');
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred during processing.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sample data to demonstrate the teacher profile
  const sampleTeacherNotes = [
    { type: 'section', key: 'SCE Overview', value: 'Self-financed engineering college (AICTE approved, VTU affiliated), 7 UG, 2 PG programs, ~3000 students.', isBold: true },
    { type: 'section', key: 'Vision', value: 'Enabling learning environment, producing **globally competitive** professionals.', isBold: true },
    { type: 'section', key: 'Mission', value: 'Quality engineering education, fulfilling professional dreams, contributing **competent professionals** to society.', isBold: true },
    { type: 'section', key: 'Program Educational Objectives (PEOs)', value: '', isBold: true },
    { type: 'bullet-point', value: 'PEO1: **Strong foundational knowledge** for problem-solving.' },
    { type: 'bullet-point', value: 'PEO2: Successful careers, leadership, and team management.' },
    { type: 'bullet-point', value: 'PEO3: **Interpersonal skills** & lifelong learning.' },
    { type: 'section', key: 'Program Specific Outcomes (PSOs)', value: '', isBold: true },
    { type: 'bullet-point', value: 'Adaptability to **changing environments** through continuous learning.' },
    { type: 'bullet-point', value: 'Utilizing **diverse knowledge** & interpersonal skills to meet industry needs.' },
  ];

  // Process sample data to handle inline bold formatting
  const processedSampleNotes = sampleTeacherNotes.map(item => {
    if (typeof item.value === 'string' && item.value.includes('**')) {
      return { ...item, value: processBoldText(item.value) };
    }
    return item;
  });

  // Function to render content with inline bold formatting
  const renderFormattedContent = (content) => {
    if (Array.isArray(content)) {
      return content.map((segment, i) => (
        segment.type === 'bold' 
          ? <strong key={i}>{segment.text}</strong> 
          : <span key={i}>{segment.text}</span>
      ));
    }
    return content;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Generate Short Notes
      </Typography>
      <Typography variant="body1" paragraph>
        Upload a PDF document to extract text and generate short, concise notes. The API extracts the text from the document, sends it to Gemini for summarization, and then displays the results.
      </Typography>

      <Paper sx={{ p: 3, mb: 4, maxWidth: '800px', mx: 'auto' }} elevation={3}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFile />}
              sx={{ borderRadius: 2 }}
            >
              Select PDF File
              <input
                type="file"
                hidden
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </Button>
            <Typography variant="body2">
              {file ? file.name : 'No file selected'}
            </Typography>
            <Button
              variant="contained"
              type="submit"
              disabled={isLoading || !file}
              sx={{
                mt: 2,
                borderRadius: 2,
                py: 1.5,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                  Generating Notes...
                </>
              ) : (
                'Generate Short Notes'
              )}
            </Button>
          </Box>
        </form>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </Paper>

      {/* Sample Teacher Profile with enhanced formatting */}
      <Card sx={{ mb: 4, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            display="flex"
            alignItems="center"
            gap={1}
          >
            {/* <Person color="primary" /> Sample Teacher Notes (with Bold Formatting) */}
          </Typography>
          {/* <Divider sx={{ mb: 2 }} /> */}
        
        </CardContent>
      </Card>

      {/* Render the generated notes with enhanced styling */}
      {notesData.length > 0 && (
        <Card sx={{ mb: 4, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Description color="primary" /> Generated Notes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ px: 2, pt: 1 }}>
              {notesData.map((item, index) => {
                if (item.type === 'section') {
                  return (
                    <Typography key={index} variant="body1" sx={{ mt: 1.5, mb: 0.5 }}>
                      {item.bullet && <span>• </span>}
                      <strong>{item.key}:</strong> {renderFormattedContent(item.value)}
                    </Typography>
                  );
                }
                if (item.type === 'bullet-point') {
                  return (
                    <Typography key={index} variant="body1" sx={{ pl: 2, mt: 1 }}>
                      • {renderFormattedContent(item.value)}
                    </Typography>
                  );
                }
                return (
                  <Typography key={index} variant="body2" sx={{ mt: 1 }}>
                    {renderFormattedContent(item.value)}
                  </Typography>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ShortNotes;