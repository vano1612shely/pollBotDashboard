import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ClientService } from '../../client/client.service';
import { MessagesService } from '../../messages/messages.service';
import { BotEntity } from '../entities/bot.entity';
import { IBotContext } from '../context';

@Injectable()
export class CustomNameHandler {
  constructor(
    private readonly clientService: ClientService,
    private readonly messagesService: MessagesService,
  ) {}
  register(telegrafBot: Telegraf<IBotContext>, bot: BotEntity) {
    telegrafBot.action(/custom_name:.+/, (ctx) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      ctx.session.client_id = ctx.callbackQuery.data.split(':')[1];
      ctx.scene.enter('custom_name');
    });
  }
}
