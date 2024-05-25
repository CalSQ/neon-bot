import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('roblox')
export class RobloxController {
  constructor(@Inject('ROBLOX_SERVICE') private readonly robloxService) {}

  @Get('login')
  login(@Res() res: Response) {
    res.redirect(process.env.ROBLOX_OAUTH_REDIRECT);
  }

  @Get('redirect')
  async redirect(@Req() request: Request, @Res() response: Response) {
    const { code } = request.query;
    if (!code)
      throw new HttpException('No code provided', HttpStatus.BAD_REQUEST);
    try {
      await this.robloxService.authenticate(request, code.toString());
    } catch (error: unknown) {
      if (error instanceof Error && error.cause === 'Application') {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      console.log('There was error.', error);
      throw new HttpException(
        'There was a problem.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    response.send({
      message: 'You have successfully verified, you may return to Discord.',
      session: {
        discordId: request.session.user.discordId,
        robloxId: request.session.user.roblox.id,
      },
    });
  }
}
