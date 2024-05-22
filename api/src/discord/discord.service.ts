import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { exchangeCodeForAccessToken, fetchUserProfile } from './utils/helpers';

@Injectable()
export class DiscordService {
  constructor() {}

  async authenticate(request: Request, accessCode: string) {
    const oauthCredentials = await exchangeCodeForAccessToken(accessCode);
    const { token_type: tokenType, access_token: accessToken } =
      oauthCredentials;
    const { id: discordId } = await fetchUserProfile(accessToken, tokenType);
    request.session.user = { discordId };
    console.log(
      `[ DISCORD Authentication ] Session: ${request.sessionID} | ID: ${discordId}`,
    );
    return await request.session.save();
  }
}
