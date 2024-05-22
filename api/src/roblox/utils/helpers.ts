import {
  ROBLOX_API_ROUTES,
  GRANT_TYPE,
  RobloxOAuthCredentialsResponse,
  RobloxProfileResponse,
} from 'src/utils/types';
import { HttpStatus } from '@nestjs/common';

export function buildOAuthPayload(params: Record<string, string>) {
  return new URLSearchParams({
    client_id: process.env.ROBLOX_APP_ID,
    client_secret: process.env.ROBLOX_APP_SECRET,
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
): Promise<RobloxOAuthCredentialsResponse> {
  if (!accessCode)
    throw new Error('Access code was not found.', { cause: 'Application' });
  const response = await fetch(ROBLOX_API_ROUTES.TOKEN_EXCHANGE, {
    method: 'POST',
    body: buildOAuthPayload({
      grant_type: GRANT_TYPE.AUTHORIZATION,
      code: accessCode,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  if (response.status !== HttpStatus.OK) {
    throw new Error('Problem exchanging code', { cause: 'Application' });
  }
  return await response.json();
}

export async function fetchUserProfile(
  accessToken: string,
  tokenType: string,
): Promise<RobloxProfileResponse> {
  const response = await fetch(ROBLOX_API_ROUTES.USER_PROFILE, {
    headers: buildOAuthHeaders(accessToken, tokenType),
  });
  if (response.status !== HttpStatus.OK)
    throw new Error('Problem fetching user profile', { cause: 'Application' });
  return await response.json();
}

export async function revokeUserAccessToken(
  refreshToken: string,
): Promise<boolean> {
  const response = await fetch(ROBLOX_API_ROUTES.REVOKE_TOKEN, {
    method: 'POST',
    body: buildOAuthPayload({
      token: refreshToken,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  if (response.status !== HttpStatus.OK)
    throw new Error('Problem revoking token', { cause: 'Application' });
  return true;
}
