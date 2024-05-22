import {
  DISCORD_API_ROUTES,
  GRANT_TYPE,
  DiscordOAuthCredentialsResponse,
  OAuthTokens,
  DiscordProfileResponse,
} from 'src/utils/types';
import { HttpStatus } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

export function buildOAuthPayload(params: Record<string, string>) {
  return new URLSearchParams({
    client_id: process.env.DISCORD_APP_ID,
    client_secret: process.env.DISCORD_APP_SECRET,
    ...params,
  }).toString();
}

export function buildOAuthHeaders(
  accessToken: string,
  tokenType: string = 'Bearer',
) {
  return {
    Authorization: `${tokenType} ${accessToken}`,
  };
}

export async function exchangeCodeForAccessToken(
  accessCode: string,
): Promise<DiscordOAuthCredentialsResponse> {
  if (!accessCode)
    throw new Error('Access code was not found.', { cause: 'Application' });
  const response = await fetch(DISCORD_API_ROUTES.TOKEN_EXCHANGE, {
    method: 'POST',
    body: buildOAuthPayload({
      grant_type: GRANT_TYPE.AUTHORIZATION,
      code: accessCode,
      redirect_uri: process.env.DISCORD_APP_REDIRECT,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  if (response.status !== HttpStatus.OK)
    throw new Error('Problem exchanging code', { cause: 'Application' });
  return await response.json();
}

export async function fetchUserProfile(
  accessToken: string,
  tokenType: string,
): Promise<DiscordProfileResponse> {
  const response = await fetch(DISCORD_API_ROUTES.USER_PROFILE, {
    headers: buildOAuthHeaders(accessToken, tokenType),
  });
  if (response.status !== HttpStatus.OK)
    throw new Error('Problem fetching user profile', { cause: 'Application' });
  return await response.json();
}

export async function revokeUserAccessToken(
  accessToken: string,
): Promise<boolean> {
  const response = await fetch(DISCORD_API_ROUTES.REVOKE_TOKEN, {
    method: 'POST',
    body: buildOAuthPayload({
      token: accessToken,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  if (response.status !== HttpStatus.OK)
    throw new Error('Problem revoking token', { cause: 'Application' });
  return true;
}

export function encryptToken(token: string) {
  return CryptoJS.AES.encrypt(token, process.env.ENCRYPT_KEY).toString();
}

export function decryptToken(cipher: string) {
  const token = CryptoJS.AES.decrypt(cipher, process.env.ENCRYPT_KEY);
  return token.toString(CryptoJS.enc.Utf8);
}

export function encryptTokens(tokens: OAuthTokens): OAuthTokens {
  return {
    accessToken: encryptToken(tokens.accessToken),
    refreshToken: encryptToken(tokens.refreshToken),
  };
}

export function decryptTokens(tokens: OAuthTokens): OAuthTokens {
  return {
    accessToken: decryptToken(tokens.accessToken),
    refreshToken: decryptToken(tokens.refreshToken),
  };
}
