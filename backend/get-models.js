const https = require('https');
const fs = require('fs');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      if (parsed.error) {
        fs.writeFileSync('debug-result.txt', 'API ERROR: ' + JSON.stringify(parsed.error), 'utf8');
      } else if (parsed.models) {
        const supported = parsed.models
          .filter(m => m.supportedGenerationMethods.includes('generateContent'))
          .map(m => m.name);
        fs.writeFileSync('debug-result.txt', 'SUPPORTED MODELS: \n' + supported.join('\n'), 'utf8');
      }
    } catch(e) {
      fs.writeFileSync('debug-result.txt', 'PARSE ERROR: ' + e.message + '\n\n' + body, 'utf8');
    }
  });
}).on('error', (e) => {
    fs.writeFileSync('debug-result.txt', 'NETWORK ERROR: ' + e.message, 'utf8');
});
