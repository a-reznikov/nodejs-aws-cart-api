import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: (req, callback) => callback(null, true),
    });
    app.use(helmet());
    await app.init();
  }
  return app;
}

export const handler = async (event: any, context: any) => {
  const app = await bootstrap();
  const expressApp = app.getHttpAdapter().getInstance();

  return new Promise((resolve, reject) => {
    expressApp(event, context, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
