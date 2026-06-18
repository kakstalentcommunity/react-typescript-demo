const http = require('http');
const data = JSON.stringify({ name: 'Test', email: 'test@example.com', password: 'password123' });
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};
const req = http.request(options, (res) => {
  console.log('status', res.statusCode);
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => console.log('body', body));
});
req.on('error', (e) => console.error('req error', e));
req.write(data);
req.end();
