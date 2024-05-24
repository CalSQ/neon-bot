export enum ROBLOX_API_ROUTES {
  TOKEN_EXCHANGE = 'https://apis.roblox.com/oauth/v1/token',
  REVOKE_TOKEN = 'https://apis.roblox.com/oauth/v1/token/revoke',
  USER_PROFILE = 'https://apis.roblox.com/oauth/v1/userinfo',
}

export interface RobloxOAuthCredentialsResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  id_token: string;
  scope: string;
}

export interface RobloxProfileResponse {
  sub: string;
  name: string;
  nickname: string;
  preferred_username: string;
  created_at: number;
  profile: string;
  picture: string;
}

export enum DISCORD_API_ROUTES {
  TOKEN_EXCHANGE = 'https://discord.com/api/v10/oauth2/token',
  REVOKE_TOKEN = 'https://discord.com/api/v10/oauth2/token/revoke',
  USER_PROFILE = 'https://discord.com/api/v10/users/@me',
  USER_GUILDS = 'https://discord.com/api/v10/users/@me/guilds',
}

export interface DiscordOAuthCredentialsResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface DiscordProfileResponse {
  id: string;
  username: string;
  discriminator: string;
  global_name?: string;
  avatar?: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string;
  accent_color?: number;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
  avatar_decoration?: string;
}

export enum GRANT_TYPE {
  AUTHORIZATION = 'authorization_code',
  REFRESH = 'refresh_token',
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserSession {
  discordId?: string;
  robloxId?: string;
}

export enum AuthType {
  DISCORD = 'discord',
  ROBLOX = 'roblox',
}

export interface RobloxProfile {
  id: string;
  username: string;
  display_name: string;
  profile_url: string;
  picture_url: string;
}
