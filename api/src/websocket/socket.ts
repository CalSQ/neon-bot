import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UserSession } from 'src/utils/types';

@WebSocketGateway()
export class WebsocketHandler {
  @WebSocketServer()
  ws: Server;

  authenticate(user: UserSession) {
    console.log(`[ Webhook ] Authenticating user ${user.discordId}`)
    this.ws.emit('authenticate', user);
  }
}
