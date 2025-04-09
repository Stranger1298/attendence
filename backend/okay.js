import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

// OCR.Space API key
const OCR_API_KEY = 'K89469803888957'; // 🔐 Replace with your secure API key

// Gemini API key
const GEMINI_API_KEY = 'AIzaSyBGR9Y2TgP8nt2KYrPdbJ5BAA-WGE_bGyk';

async function extractTextFromPDF(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found at: ${filePath}`);
    return;
  }

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('language', 'eng');
  form.append('isOverlayRequired', 'false');

  const response = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    headers: {
      apikey: OCR_API_KEY,
      ...form.getHeaders()
    },
    body: form
  });

  const result = await response.json();
  const extractedText = result.ParsedResults?.[0]?.ParsedText || '';

  if (!extractedText.trim()) {
    console.log('⚠️ No text found in PDF.');
    return;
  }

  // console.log('✅ Extracted Text:\n', extractedText);

  // Now send it to Gemini for summarization
  await generateShortNotesWithGemini(extractedText);
}

async function generateShortNotesWithGemini(text) {
  try {
    console.log('🔄 Sending request to Gemini API...');
    
    // Update to use the correct model name: gemini-1.5-flash
    const geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY;

    const body = {
      contents: [
        {
          parts: [
            {
              text: `Create concise short notes for teachers from the following content:\n\n${text}`
            }
          ]
        }
      ]
    };

    console.log('📤 Sending request with body structure:', JSON.stringify(body).substring(0, 100) + '...');

    const response = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error(`❌ Gemini API returned status: ${response.status}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error('❌ No candidates in response:', JSON.stringify(data));
      return;
    }
    
    const notes = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!notes) {
      console.error('❌ Failed to extract text from response:', JSON.stringify(data));
      return;
    }

    console.log('\n📝 Short Notes Generated by Gemini:\n', notes);
  } catch (error) {
    console.error('❌ Error during Gemini API call:', error.message);
  }
}

// Run with a file path
extractTextFromPDF('e:/attendence/backend/okay.pdf');
