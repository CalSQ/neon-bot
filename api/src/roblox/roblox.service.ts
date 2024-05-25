import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { exchangeCodeForAccessToken, fetchUserProfile } from './utils/helpers';
import { WebsocketHandler } from 'src/websocket/socket';
import { User } from '../schemas/User.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RobloxProfile } from '../utils/types';

@Injectable()
export class RobloxService {
  constructor(
    @Inject(WebsocketHandler)
    private readonly wsHandler: WebsocketHandler,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async saveProfile(discordId: string, profile: RobloxProfile) {
    this.userModel
      .findOneAndUpdate(
        { discordId },
        { roblox: profile },
        {
          upsert: true,
        },
      )
      .catch((err) => {
        console.error(
          `There was a problem saving profile for user ${discordId}`,
          err,
        );
      });
  }

  async authenticate(request: Request, accessCode: string) {
    // Get user credentials and profile
    const oauthCredentials = await exchangeCodeForAccessToken(accessCode);
    const { token_type: tokenType, access_token: accessToken } =
      oauthCredentials;
    const {
      sub: robloxId,
      name,
      preferred_username,
      profile,
      picture,
    } = await fetchUserProfile(accessToken, tokenType);

    // Check if discord authentication exists
    if (!request.session.user?.discordId)
      throw new Error('There was a problem authenticating', {
        cause: 'Application',
      });

    // Complete authentication
    request.session.user.roblox = {
      id: robloxId,
      username: preferred_username,
      display_name: name,
      profile_url: profile,
      picture_url: picture,
    };
    this.saveProfile(
      request.session.user.discordId,
      request.session.user.roblox,
    );
    console.log(
      `[ ROBLOX Authentication ] Session: ${request.sessionID} | ID: ${robloxId}`,
    );
    this.wsHandler.authenticate(request.session.user);
    return await request.session.save();
  }
}
