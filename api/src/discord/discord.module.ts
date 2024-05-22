import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { ConfigModule } from '@nestjs/config';
import { DiscordController } from './discord.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
    }),
  ],
  controllers: [DiscordController],
  providers: [
    {
      provide: 'DISCORD_SERVICE',
      useClass: DiscordService,
    },
  ],
})
export class DiscordModule {}
