import { handler } from '../dist/lambda';

interface ApiGatewayEvent {
  httpMethod: string;
  path: string;
  headers: {
    [key: string]: string;
  };
}

interface LambdaContext {
  userName: string;
  type: string;
}

const event: ApiGatewayEvent = {
  httpMethod: 'GET',
  path: '/api/profile/cart',
  headers: {
    Authorization: 'Basic YV9yZXpuaWtvdjpURVNUX1BBU1NXT1JE',
  },
};

const context: LambdaContext = {
  userName: 'Alex',
  type: 'test',
};

console.log('Starting Lambda test...');

handler(event, context)
  .then((response) => {
    console.log('Context:', context);
    console.log('Response:', JSON.stringify(response, null, 2));
  })
  .catch((error) => {
    console.error('Error:', error);
  });
