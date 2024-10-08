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
export class StartHandler {
  constructor(
    private readonly clientService: ClientService,
    private readonly messagesService: MessagesService,
  ) {}
  register(telegrafBot: Telegraf<IBotContext>, bot: BotEntity) {
    telegrafBot.start((ctx) => {
      this.execute(ctx, bot);
    });
  }
  async execute(ctx: Context, bot: BotEntity) {
    let subscriber = await this.clientService.findOneByTelegramId(ctx.from.id);
    if (!subscriber) {
      let file_url: string = '';
      try {
        file_url = (
          await ctx.telegram.getFileLink(
            (await ctx.telegram.getUserProfilePhotos(ctx.from.id, 0, 1))
              .photos[0][0].file_id,
          )
        ).href;
      } catch (e) {
        console.log(e);
      }
      subscriber = await this.clientService.create({
        username: ctx.from.username,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name,
        telegram_id: ctx.from.id,
        img_link: file_url,
      });
      await ctx.telegram.sendMessage(
        bot.chat_id,
        `Новий користувач:\n@${subscriber.username}\n${subscriber.first_name} ${subscriber.last_name}`,
        {
          ...Markup.inlineKeyboard([
            Markup.button.callback(
              'Верифікувати',
              `verify:${subscriber.telegram_id}`,
            ),
            Markup.button.callback(
              "Додати кастомне ім'я",
              `custom_name:${subscriber.telegram_id}`,
            ),
          ]),
        },
      );
    }
    let message: MessageEntity;
    if (!subscriber.is_blocked) {
      if (!subscriber.is_activated) {
        message = (await this.messagesService.getByType(MessageType.StartU))[0];
      } else {
        message = (await this.messagesService.getByType(MessageType.StartA))[0];
      }
      const text = parseText(message.message);
      const buttons = createInlineKeyboard(message.buttons, message.id);
      if(message.message_img && message.message_img.endsWith('.gif')) {
        await ctx.sendAnimation({url: message.message_img}, {
          caption: text,
          parse_mode: 'HTML',
          ...buttons,
        });
      } else if(message.message_img) {
        await ctx.sendPhoto({url: message.message_img}, {
          caption: text,
          parse_mode: 'HTML',
          ...buttons,
        });
      } else {
        await ctx.reply(text, {
          parse_mode: 'HTML',
          ...buttons,
        })
      }
    }
  }
}
