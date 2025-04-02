const handler = require('./dist/lambda');

const event = {
  httpMethod: 'GET',
  path: '/api/profile/cart',
  headers: {
    Authorization: 'Basic dGVzdDp0ZXN0',
  },
};

const context = {
  userName: 'Alex',
};

console.log('Starting Lambda test...');

handler(event, context)
  .then((response) => {
    console.log('Context', context);
    console.log('Response:', JSON.stringify(response, null, 2));
  })
  .catch((error) => {
    console.error('Error:', error);
  });
