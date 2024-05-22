import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RobloxController } from './roblox.controller';
import { RobloxService } from './roblox.service';
import { WsModule } from 'src/websocket/ws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
    }),
    WsModule,
  ],
  controllers: [RobloxController],
  providers: [
    {
      provide: 'ROBLOX_SERVICE',
      useClass: RobloxService,
    },
  ],
})
export class RobloxModule {}
