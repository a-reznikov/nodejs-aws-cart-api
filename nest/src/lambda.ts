import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as serverless from 'serverless-http';
import * as express from 'express';

let server: any;

async function bootstrap() {
  const startTime = Date.now();
  console.log('Starting bootstrap...');

  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.enableCors();
  await app.init();

  const endTime = Date.now();
  console.log(`Bootstrap completed in ${endTime - startTime}ms`);

  return serverless(expressApp);
}

export const handler = async (event: any, context: any) => {
  const startTime = Date.now();
  console.log('Event:', event);
  console.log('Handler started at:', new Date().toISOString());

  try {
    if (!server) {
      console.log('Cold start detected, initializing server...');
      server = await bootstrap();
    }

    const result = await server(event, context);

    context.callbackWaitsForEmptyEventLoop = false;

    const endTime = Date.now();
    console.log(`Total execution time: ${endTime - startTime}ms`);

    return result;
  } catch (error) {
    console.error('Lambda handler error:', error);
    throw error;
  }
};
