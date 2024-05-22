import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordModule } from './discord/discord.module';
import { RobloxModule } from './roblox/roblox.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    DiscordModule,
    RobloxModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
