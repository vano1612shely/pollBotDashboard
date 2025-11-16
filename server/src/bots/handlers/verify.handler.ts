import { Injectable } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';
import { ClientService } from '../../client/client.service';
import { BotEntity } from '../entities/bot.entity';
import { broadcastToAdmins } from './lib';

@Injectable()
export class VerifyHandler {
  constructor(
    private readonly clientService: ClientService,
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
      await broadcastToAdmins(bot, (chatId) =>
        ctx.telegram.sendMessage(chatId, 'Клієнта не знайдено'),
      );
      return;
    }

    const displayName = client.custom_name
      ? client.custom_name
      : '@' + client.username;

    try {
      await this.clientService.setStatus(client.id, true);
      await broadcastToAdmins(bot, (chatId) =>
        ctx.telegram.sendMessage(chatId, `${displayName} підтверджений`),
      );
    } catch (e) {
      await broadcastToAdmins(bot, (chatId) =>
        ctx.telegram.sendMessage(chatId, 'Сталась помилка'),
      );
      return;
    }
  }
}
