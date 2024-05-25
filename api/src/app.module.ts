import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordModule } from './discord/discord.module';
import { RobloxModule } from './roblox/roblox.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      autoIndex: true,
    }),
    DiscordModule,
    RobloxModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
