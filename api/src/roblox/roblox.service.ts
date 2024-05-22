import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { exchangeCodeForAccessToken, fetchUserProfile } from './utils/helpers';
import { WebsocketHandler } from 'src/websocket/socket';

@Injectable()
export class RobloxService {
  constructor(
    @Inject(WebsocketHandler)
    private readonly wsHandler: WebsocketHandler,
  ) {}

  async authenticate(request: Request, accessCode: string) {
    const oauthCredentials = await exchangeCodeForAccessToken(accessCode);
    const { token_type: tokenType, access_token: accessToken } =
      oauthCredentials;
    const { sub: robloxId } = await fetchUserProfile(accessToken, tokenType);
    if (!request.session.user?.discordId)
      throw new Error('There was a problem authenticating', {
        cause: 'Application',
      });
    request.session.user.robloxId = robloxId;
    console.log(
      `[ ROBLOX Authentication ] Session: ${request.sessionID} | ID: ${robloxId}`,
    );
    this.wsHandler.authenticate(request.session.user);
    return await request.session.save();
  }
}
