import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');

  // Environment checks
  if (
    !process.env.COOKIE_SECRET ||
    !process.env.PORT ||
    !process.env.MONGO_URI
  ) {
    throw new Error('Missing required environment variables');
  }

  // Mongo
  const mongoStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    crypto: {
      secret: process.env.ENCRYPT_KEY,
    },
  });

  app.use(
    session({
      name: 'AUTH_SESSION',
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      // proxy: true,
      cookie: {
        maxAge: 60 * 20 * 1000,
        httpOnly: true,
        signed: true,
        // secure: process.env.NODE_ENV === 'production',
      },
      store: mongoStore,
    }),
  );

  // CORS
  app.enableCors({
    origin: `localhost:${process.env.PORT}`,
    credentials: true,
  });
  // app.set('trust proxy', 1);

  // Initiate application
  try {
    await app.listen(process.env.PORT);
    console.log(
      `Running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`,
    );
  } catch (err) {
    throw new Error(`Could not listen for port: ${process.env.PORT}`);
  }
}

bootstrap();
