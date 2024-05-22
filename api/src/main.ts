import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');

  // Redis
  const redisClient = createClient({
    url: process.env.CACHE_URL,
  })
    .on('ready', () => console.log('[ Redis: CONNECTED ] - Connected to cache'))
    .on('reconnecting', () =>
      console.warn('[ Redis: WARN ] - Reconnecting to cache'),
    )
    .on('error', (err) => console.error('[ Redis: ERROR ]', err));

  redisClient.connect().catch(console.error);

  const redisStore = new RedisStore({
    client: redisClient,
  });

  // Environment checks
  if (
    !process.env.COOKIE_SECRET ||
    !process.env.PORT ||
    !process.env.CACHE_URL
  ) {
    throw new Error('Missing required environment variables');
  }

  // Middlewares;
  app.use(cookieParser());

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
      store: redisStore,
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
