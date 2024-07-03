import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatEntity } from './entities/chat.entity';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: new ConfigService().get('CLIENT_URL'),
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }
  handleConnection(client: Socket, ...args: any[]) {
    // console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: any): void {
    // Handle incoming messages from the client
    this.server.emit('messageToClient', payload);
  }

  @SubscribeMessage('joinToChat')
  joinToChat(client: Socket, payload: { client_id: number }): void {
    console.log(payload);
  }

  newMessage(client_id: number, message: ChatEntity) {
    this.server.emit('newMessage', { client_id: client_id, message: message });
  }

  messegeRead(message_id: number) {
    this.server.emit('messegeRead', { message_id: message_id });
  }

  updateUnreadMessages(count: number) {
    this.server.emit('unreadMessages', count);
  }
}
