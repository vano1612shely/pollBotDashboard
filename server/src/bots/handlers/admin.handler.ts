import { Injectable } from '@nestjs/common';
import { Context, Markup, Telegraf } from 'telegraf';
import { ClientService } from '../../client/client.service';
import { MessagesService } from '../../messages/messages.service';
import {
  MessageEntity,
  MessageType,
} from '../../messages/entities/message.entity';
import { createInlineKeyboard, parseText } from './lib';
import { BotEntity } from '../entities/bot.entity';
import { IBotContext } from '../context';

@Injectable()
export class AdminHandler {
  constructor(
    private readonly clientService: ClientService,
    private readonly messagesService: MessagesService,
  ) {}
  register(telegrafBot: Telegraf<IBotContext>, bot: BotEntity) {
    telegrafBot.command('admin', (ctx) => {
      if (Number(bot.chat_id) === ctx.from.id) {
        this.execute(ctx, bot);
      }
    });
    telegrafBot.action('send_message', async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
      await ctx.scene.enter('send_message');
    });
    telegrafBot.action('send_poll', async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
      await ctx.scene.enter('send_poll_name');
    });
  }
  async execute(ctx: Context, bot: BotEntity) {
    await ctx.reply('Виберіть дію:', {
      ...Markup.inlineKeyboard([
        [Markup.button.callback('Відправити повідомлення', 'send_message')],
        [Markup.button.callback('Опитування', 'send_poll')],
      ]),
    });
  }
}
