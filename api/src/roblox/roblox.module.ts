import { Module } from '@nestjs/common';
import { RobloxController } from './roblox.controller';
import { RobloxService } from './roblox.service';
import { WsModule } from 'src/websocket/ws.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/User.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
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
