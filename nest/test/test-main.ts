const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

console.log('Starting main.js test...');

const mainJsPath = path.resolve(__dirname, '../dist/main.js');

const app = spawn('node', [mainJsPath], {
  stdio: 'inherit',
});

setTimeout(() => {
  const req = http.request(
    {
      hostname: 'localhost',
      port: 4000,
      path: '/api/profile',
      method: 'GET',
      headers: {
        Authorization: 'Basic YV9yZXpuaWtvdjpURVNUX1BBU1NXT1JE',
      },
    },
    (res) => {
      console.log(`STATUS: ${res.statusCode}`);

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('RESPONSE:', data);
        app.kill();
        process.exit(0);
      });
    },
  );

  req.on('error', (error) => {
    console.error('Error testing application:', error);
    app.kill();
    process.exit(1);
  });

  req.end();
}, 3000);

process.on('SIGINT', () => {
  app.kill();
  process.exit();
});
