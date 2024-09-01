import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { CreateChatMessageDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity, ChatMessageType } from './entities/chat.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { ClientService } from '../client/client.service';
import { ChatGateway } from './chat.gateway';
import { BotsService } from '../bots/bots.service';

@Injectable()
export class ChatService implements OnModuleInit {
  unreadMessages = 0;
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    private readonly clientService: ClientService,
    private readonly chatGateway: ChatGateway,
    @Inject(forwardRef(() => BotsService))
    private readonly botService: BotsService,
  ) {}
  async onModuleInit() {
    const count = await this.getCountUnreadMessages();
    this.updateUnreadMessages(count);
  }

  async getCountUnreadMessages() {
    const count = await this.chatRepository.count({
      where: { read: false },
    });
    return count;
  }

  updateUnreadMessages(count: number) {
    this.unreadMessages = count;
    this.chatGateway.updateUnreadMessages(this.unreadMessages);
  }
  async create(create: CreateChatMessageDto) {
    const client = await this.clientService.findOneByTelegramId(
      create.client_telegram_id,
    );
    if (!client) {
      throw new BadRequestException('Client not found');
    }

    const chatMessage = await this.chatRepository.save({
      message: create.message,
      client: client,
      type: create.type,
      telegram_message_id: create.telegram_message_id,
    });
    await this.clientService.updateLastMessage(client.id, chatMessage);
    this.updateUnreadMessages(this.unreadMessages + 1);
    this.chatGateway.newMessage(client.id, chatMessage);
    if (chatMessage.type === ChatMessageType.BOT) {
      const ctx = await this.botService.sendMessageForClient(
        chatMessage.message,
        client.telegram_id,
      );
      await this.chatRepository.update(
        {
          id: chatMessage.id,
        },
        {
          telegram_message_id: ctx.message_id,
        },
      );
    }
    return chatMessage;
  }
  async getByClient(id: number) {
    const messages = await this.chatRepository.find({
      where: { client_id: id },
      order: {
        createdAt: 'asc',
      },
    });
    return messages;
  }

  async delete(id: number) {
    return await this.chatRepository.delete({ client_id: id });
  }

  async readMessages(id: number) {
    const message = await this.chatRepository.findOne({ where: { id: id } });
    if (message) {
      await this.chatRepository.update({ id: id }, { read: true });
      await this.chatRepository.update(
        {
          createdAt: LessThanOrEqual(message.createdAt),
          client_id: message.client_id,
        },
        { read: true },
      );
      this.chatGateway.messegeRead(message.id);
      const count = await this.getCountUnreadMessages();
      this.updateUnreadMessages(count);
      return true;
    }
    return false;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
