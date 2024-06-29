import { Injectable } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';
import { ClientService } from '../../client/client.service';
import { MessagesService } from '../../messages/messages.service';
import { BotEntity } from '../entities/bot.entity';

@Injectable()
export class VerifyHandler {
  constructor(
    private readonly clientService: ClientService,
    private readonly messagesService: MessagesService,
  ) {}
  register(telegrafBot: Telegraf<Context>, bot: BotEntity) {
    telegrafBot.action(/verify:.+/, (ctx) => {
      this.execute(ctx, bot);
    });
  }
  async execute(ctx: Context, bot: BotEntity) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    const telegram_id = ctx.callbackQuery.data.split(':')[1];
    const client = await this.clientService.findOneByTelegramId(telegram_id);
    if (!client) {
      await ctx.telegram.sendMessage(bot.chat_id, 'Клієнта не знайдено');
      return;
    }
    try {
      await this.clientService.setStatus(client.id, true);
      await ctx.telegram.sendMessage(
        bot.chat_id,
        `${client.custom_name ? client.custom_name : '' + ' @' + client.username} верифікований`,
      );
    } catch (e) {
      await ctx.telegram.sendMessage(bot.chat_id, 'Сталась помилка');
      return;
    }
  }
}
