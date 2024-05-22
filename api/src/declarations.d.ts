import { UserSession } from './utils/types';

declare module 'express-session' {
  interface SessionData {
    user?: UserSession;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      ENCRYPT_KEY: string;
      CACHE_URL: string;
      COOKIE_SECRET: string;
      DISCORD_BOT_TOKEN: string;
      DISCORD_APP_ID: string;
      DISCORD_APP_SECRET: string;
      DISCORD_APP_REDIRECT: string;
      DISCORD_OAUTH_REDIRECT: string;
      ROBLOX_APP_ID: string;
      ROBLOX_APP_SECRET: string;
      ROBLOX_APP_REDIRECT: string;
      ROBLOX_OAUTH_REDIRECT: string;
    }
  }
}
