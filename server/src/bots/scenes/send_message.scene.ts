import { Markup, Scenes } from 'telegraf';
import { IBotContext } from '../context';
import { BotsService } from '../bots.service';
import { ClientEntity } from '../../client/entities/client.entity';
import { MessageType } from '../../messages/entities/message.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createInlineKeyboard, parseText } from '../handlers/lib';
import { ClientService } from '../../client/client.service';
import { message } from 'telegraf/filters';

export const sendMessageScene = new Scenes.BaseScene<IBotContext>(
  'send_message',
);
@Injectable()
export class SendMessageScene {
  constructor(private readonly clientService: ClientService) {
    sendMessageScene.enter(async (ctx) => {
      await ctx.reply('Введіть повідомлення:', {
        ...Markup.inlineKeyboard([Markup.button.callback('Назад', 'back')]),
      });
    });
    sendMessageScene.action('back', async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
      await ctx.scene.leave();
      await ctx.reply('Виберіть дію:', {
        ...Markup.inlineKeyboard([
          [Markup.button.callback('Відправити повідомлення', 'send_message')],
          [Markup.button.callback('Опитування', 'send_poll')],
        ]),
      });
    });
    sendMessageScene.on('text', async (ctx) => {
      const msg = ctx.message.text;
      if (!msg) {
        await ctx.reply('Повідомлення не може бути пустим, спробуйте ще раз:');
        return;
      }
      ctx.session.message = msg;
      await ctx.reply('Виберіть кому це повідомлення буде відправлено:', {
        ...Markup.inlineKeyboard([
          [Markup.button.callback('Для всіх', 'send_message_for:all')],
          [
            Markup.button.callback(
              'Для верифікованих',
              'send_message_for:auth',
            ),
          ],
          [
            Markup.button.callback(
              'Для неверифікованих',
              'send_message_for:unauth',
            ),
          ],
          [Markup.button.callback('Назад', 'back')],
        ]),
      });
    });

    sendMessageScene.action(/send_message_for:.+/, async (ctx) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const msgType = ctx.callbackQuery.data.split(':')[1];
      if (!msgType) {
        return;
      }
      let users: ClientEntity[] | null = null;
      if (msgType === 'all') users = await clientService.findAllByStatus('all');
      else if (msgType === 'auth')
        users = await clientService.findAllByStatus(true);
      else users = await clientService.findAllByStatus(false);
      if (users.length === 0) {
        throw new BadRequestException('Користувачів не знайдено');
      }
      for (const user of users) {
        ctx.telegram.sendMessage(
          user.telegram_id,
          parseText(ctx.session.message),
          {
            parse_mode: 'HTML',
          },
        );
      }
      await ctx.reply('Повідомлення відправленно!');
      return true;
    });
  }
}
