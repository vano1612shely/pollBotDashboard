import { Injectable } from '@nestjs/common';
import { ClientService } from '../../client/client.service';
import { MessagesService } from '../../messages/messages.service';
import { Telegraf } from 'telegraf';
import { IBotContext } from '../context';
import { BotEntity } from '../entities/bot.entity';
import { ChatService } from '../../chat/chat.service';
import { ChatMessageType } from '../../chat/entities/chat.entity';

@Injectable()
export class MessageHandler {
  constructor(
    private readonly clientService: ClientService,
    private readonly messagesService: MessagesService,
    private readonly chatService: ChatService,
  ) {}
  register(telegrafBot: Telegraf<IBotContext>, bot: BotEntity) {
    telegrafBot.on('text', async (ctx) => {
      const text = ctx.message.text;
      await this.chatService.create({
        client_telegram_id: ctx.from.id,
        message: text,
        type: ChatMessageType.CLIENT,
        telegram_message_id: ctx.message.message_id,
      });
    });
  }
}
