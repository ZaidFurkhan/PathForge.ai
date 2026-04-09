const http = require('http');

const data = JSON.stringify({
  name: 'Test Student',
  educationLevel: 'Undergraduate (2nd Year)',
  interests: 'Programming, AI, Machine Learning',
  currentSkills: 'Python, Basic HTML',
  careerGoal: 'AI Engineer'
});

const req = http.request(
  {
    hostname: 'localhost',
    port: 5000,
    path: '/api/generate-roadmap',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  },
  (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      console.log('STATUS:', res.statusCode);
      console.log('BODY:', body);
    });
  }
);

req.on('error', (e) => {
  console.error('NETWORK ERROR:', e.message);
});

req.write(data);
req.end();
