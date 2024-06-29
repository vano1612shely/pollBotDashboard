import { Markup, Scenes } from 'telegraf';
import { IBotContext } from '../context';
import { Injectable } from '@nestjs/common';
import { ClientService } from '../../client/client.service';
import { ButtonsService } from '../../buttons/buttons.service';
import { MessagesService } from '../../messages/messages.service';
import { MessageType } from '../../messages/entities/message.entity';

export const pollScene = new Scenes.BaseScene<IBotContext>('send_poll');
export const pollSceneName = new Scenes.BaseScene<IBotContext>(
  'send_poll_name',
);
export const pollScene2 = new Scenes.BaseScene<IBotContext>(
  'send_poll_thx_message',
);

@Injectable()
export class PollSceneName {
  constructor() {
    pollSceneName.enter(async (ctx) => {
      await ctx.reply('Введіть назву:', {
        ...Markup.inlineKeyboard([Markup.button.callback('Назад', 'back')]),
      });
    });
    pollSceneName.action('back', async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
      await ctx.scene.leave();
      await ctx.reply('Виберіть дію:', {
        ...Markup.inlineKeyboard([
          [Markup.button.callback('Відправити повідомлення', 'send_message')],
          [Markup.button.callback('Опитування', 'send_poll')],
        ]),
      });
    });
    pollSceneName.on('text', async (ctx) => {
      if (!ctx.message.text) {
        await ctx.reply('Назва не може бути пустою, спробуйте ще раз: ');
        return;
      }
      console.log(ctx.message.text);
      ctx.session.name = ctx.message.text;
      await ctx.scene.enter('send_poll');
    });
  }
}
@Injectable()
export class PollScene {
  constructor(private readonly buttonsService: ButtonsService) {
    pollScene.enter(async (ctx) => {
      await ctx.reply('Введіть текст:', {
        ...Markup.inlineKeyboard([Markup.button.callback('Назад', 'back')]),
      });
    });
    pollScene.action('back', async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
      await ctx.scene.leave();
      await ctx.reply('Виберіть дію:', {
        ...Markup.inlineKeyboard([
          [Markup.button.callback('Відправити повідомлення', 'send_message')],
          [Markup.button.callback('Опитування', 'send_poll')],
        ]),
      });
    });

    pollScene.on('text', async (ctx) => {
      if (!ctx.message.text) {
        await ctx.reply('Повідомлення не може бути пустим, спробуйте ще раз: ');
        return;
      }
      ctx.session.message = ctx.message.text;
      ctx.session.per_page = 5;
      ctx.session.page = 1;
      const buttons = await this.buttonsService.getAll(
        ctx.session.per_page,
        ctx.session.page,
      );
      const arr = [];
      if (buttons) {
        buttons.data.forEach((row: any) => {
          arr.push(
            Markup.button.callback(
              row.name,
              `send_poll_with_buttons:${row.id}`,
            ),
          );
        });
      }
      const prevNextButtons = [];
      if (ctx.session.page > 1)
        prevNextButtons.push(Markup.button.callback('⬅️', 'prev_buttons'));
      if (ctx.session.page * ctx.session.per_page < buttons.count)
        prevNextButtons.push(Markup.button.callback('➡️', 'next_buttons'));
      if (prevNextButtons.length > 0) {
        arr.push([...prevNextButtons]);
      }
      ctx.reply('Виберіть набір кнопок:', {
        ...Markup.inlineKeyboard([
          arr,
          [Markup.button.callback('Назад', 'back')],
        ]),
      });
    });

    pollScene.action(/send_poll_with_buttons:.+/, async (ctx) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const id = ctx.callbackQuery.data.split(':')[1];
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
      ctx.session.buttons = (
        await this.buttonsService.getById(Number(id))
      ).buttons;
      await ctx.reply('Виберіть кому відправити повідомлення: ', {
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
    pollScene.action(/send_message_for:.+/, async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const msgType = ctx.callbackQuery.data.split(':')[1];
      if (!msgType) {
        return;
      }
      let type: MessageType;
      if (msgType === 'all') type = MessageType.MessageForAll;
      else if (msgType === 'auth') type = MessageType.MessageForA;
      else type = MessageType.MessageForU;
      ctx.session.type = type;
      await ctx.scene.enter('send_poll_thx_message');
    });
  }
}

@Injectable()
export class PollScene2 {
  constructor(private readonly messagesService: MessagesService) {
    pollScene2.enter(async (ctx) => {
      await ctx.reply('Введіть текст прощального повідомлення:', {
        ...Markup.inlineKeyboard([Markup.button.callback('Назад', 'back')]),
      });
    });
    pollScene2.action('back', async (ctx) => {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
      await ctx.scene.leave();
      await ctx.reply('Виберіть дію:', {
        ...Markup.inlineKeyboard([
          [Markup.button.callback('Відправити повідомлення', 'send_message')],
          [Markup.button.callback('Опитування', 'send_poll')],
        ]),
      });
    });
    pollScene2.on('text', async (ctx) => {
      const message = await this.messagesService.create({
        name: ctx.session.name,
        message: ctx.session.message,
        buttons: ctx.session.buttons,
        type: ctx.session.type,
        thx_message: ctx.message.text,
      });
      await this.messagesService.sendMessage(message.id);
      await ctx.reply('Повідомлення успішно відправленно!');
      await ctx.scene.leave();
    });
  }
}
