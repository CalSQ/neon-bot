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

@Controller('discord')
export class DiscordController {
  constructor(@Inject('DISCORD_SERVICE') private readonly discordService) {}

  @Get('login')
  login(@Res() res: Response) {
    res.redirect(process.env.DISCORD_OAUTH_REDIRECT);
  }

  @Get('redirect')
  async redirect(@Req() request: Request, @Res() response: Response) {
    const { code } = request.query;
    if (!code)
      throw new HttpException('No code provided', HttpStatus.BAD_REQUEST);
    try {
      await this.discordService.authenticate(request, code.toString());
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
    response.redirect('/api/roblox/login');
  }
}
