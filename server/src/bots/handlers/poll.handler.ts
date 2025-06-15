import { Injectable } from '@nestjs/common';
import { Markup, Telegraf } from 'telegraf';
import { ClientService } from '../../client/client.service';
import { MessagesService } from '../../messages/messages.service';
import { BotEntity } from '../entities/bot.entity';
import { IBotContext } from '../context';
import { parseText } from './lib';

@Injectable()
export class PollHandler {
  constructor(
    private readonly clientService: ClientService,
    private readonly messagesService: MessagesService,
  ) {}
  register(telegrafBot: Telegraf<IBotContext>, bot: BotEntity) {
    telegrafBot.action(/poll:.+/, async (ctx) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const data = ctx.callbackQuery.data.split(':')[1];
      const message_id = data.split('___')[0];
      const poll = data.split('___')[1];
      await this.messagesService.saveResult(
        Number(message_id),
        ctx.from.id,
        poll,
      );
      const client = await this.clientService.findOneByTelegramId(ctx.from.id);
      await this.messagesService.setActivity(client.id, message_id);
      const message = await this.messagesService.getById(Number(message_id));
      await ctx.telegram.sendMessage(
        bot.chat_id,
        `Нова відповідь:\nПовідомлення: ${message.name}\nКористувач: ${(client.custom_name ? client.custom_name : '') + ' @' + client.username}\nВибір: ${poll}`,
        {
          parse_mode: 'HTML',
        },
      );
      const cityButton = Markup.button.callback(
        '🏙️ Вибрати місто',
        'select_city',
      );
      const keyboardButtons = [];
      if (client.is_activated) keyboardButtons.push([cityButton]);
      const newButtons = Markup.inlineKeyboard(keyboardButtons);
      if (message.thx_message && !client.is_blocked) {
        if (message.thx_img && message.thx_img.endsWith('.gif')) {
          await ctx.sendAnimation(
            { url: message.thx_img },
            { caption: parseText(message.thx_message), ...newButtons },
          );
        } else if (message.thx_img) {
          await ctx.sendPhoto(
            { url: message.thx_img },
            { caption: parseText(message.thx_message), ...newButtons },
          );
        } else {
          await ctx.reply(parseText(message.thx_message), { ...newButtons });
        }
      }
    });
  }
}
