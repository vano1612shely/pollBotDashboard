import { Injectable } from '@nestjs/common';
import { Context, Markup, Telegraf } from 'telegraf';
import { ClientService } from '../../client/client.service';
import { MessagesService } from '../../messages/messages.service';
import { CityService } from '../../city/city.service';
import {
  MessageEntity,
  MessageType,
} from '../../messages/entities/message.entity';
import { broadcastToAdmins, createInlineKeyboard, parseText } from './lib';
import { BotEntity } from '../entities/bot.entity';
import { IBotContext } from '../context';

@Injectable()
export class StartHandler {
  constructor(
    private readonly clientService: ClientService,
    private readonly messagesService: MessagesService,
    private readonly cityService: CityService,
  ) {}

  register(telegrafBot: Telegraf<IBotContext>, bot: BotEntity) {
    telegrafBot.start((ctx) => {
      this.execute(ctx, bot);
    });

    // РћР±СЂРѕР±РЅРёРє РґР»СЏ РєРЅРѕРїРєРё "Р’РёР±СЂР°С‚Рё РјС–СЃС‚Рѕ"
    telegrafBot.action('select_city', (ctx) => {
      this.showCitySelection(ctx, 0);
    });

    // РћР±СЂРѕР±РЅРёРє РїР°РіС–РЅР°С†С–С— РјС–СЃС‚
    telegrafBot.action(/city_page:(\d+)/, (ctx) => {
      const page = parseInt(ctx.match[1]);
      this.showCitySelection(ctx, page);
    });

    // РћР±СЂРѕР±РЅРёРє РІРёР±РѕСЂСѓ РјС–СЃС‚Р°
    telegrafBot.action(/select_city:(\d+)/, (ctx) => {
      this.assignCityToUser(ctx, parseInt(ctx.match[1]));
    });

    // РћР±СЂРѕР±РЅРёРє РїРѕРІРµСЂРЅРµРЅРЅСЏ РґРѕ СЃС‚Р°СЂС‚РѕРІРѕРіРѕ РјРµРЅСЋ
    telegrafBot.action('back_to_start', (ctx) => {
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
      await broadcastToAdmins(bot, (chatId) =>
        ctx.telegram.sendMessage(
          chatId,
          `Новий користувач:
@${subscriber.username}
${subscriber.first_name} ${subscriber.last_name}`,
          {
            ...Markup.inlineKeyboard([
              Markup.button.callback('Підтвердити',
                `verify:${subscriber.telegram_id}`,
              ),
              Markup.button.callback("Змінити ім'я",
                `custom_name:${subscriber.telegram_id}`,
              ),
            ]),
          },
        ),
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
      const originalButtons = createInlineKeyboard(message.buttons, message.id);
      console.log(subscriber);
      const cityButton = Markup.button.callback(
        subscriber.city ? `рџЏ™пёЏ ${subscriber.city.name}` : 'рџЏ™пёЏ Р’РёР±СЂР°С‚Рё РјС–СЃС‚Рѕ',
        'select_city',
      );

      // РЎС‚РІРѕСЂСЋС”РјРѕ РЅРѕРІСѓ РєР»Р°РІС–Р°С‚СѓСЂСѓ Р· РґРѕРґР°С‚РєРѕРІРѕСЋ РєРЅРѕРїРєРѕСЋ
      let keyboardButtons = [];
      if (
        originalButtons &&
        originalButtons.reply_markup &&
        originalButtons.reply_markup.inline_keyboard
      ) {
        keyboardButtons = [...originalButtons.reply_markup.inline_keyboard];
      }
      if (subscriber.is_activated) keyboardButtons.push([cityButton]);

      const newButtons = Markup.inlineKeyboard(keyboardButtons);

      if (message.message_img && message.message_img.endsWith('.gif')) {
        await ctx.sendAnimation(
          { url: message.message_img },
          {
            caption: text,
            parse_mode: 'HTML',
            ...newButtons,
          },
        );
      } else if (message.message_img) {
        await ctx.sendPhoto(
          { url: message.message_img },
          {
            caption: text,
            parse_mode: 'HTML',
            ...newButtons,
          },
        );
      } else {
        await ctx.reply(text, {
          parse_mode: 'HTML',
          ...newButtons,
        });
      }
    }
  }

  async showCitySelection(ctx: Context, page: number = 0) {
    try {
      // РћС‚СЂРёРјСѓС”РјРѕ Р°РєС‚РёРІРЅС– РјС–СЃС‚Р°
      const cities = await this.cityService.findAll();

      if (cities.length === 0) {
        await ctx.editMessageText(
          'вќЊ РќР°СЂР°Р·С– РЅРµРјР°С” РґРѕСЃС‚СѓРїРЅРёС… РјС–СЃС‚ РґР»СЏ РІРёР±РѕСЂСѓ.',
          {
            ...Markup.inlineKeyboard([
              Markup.button.callback('рџ”™ РџРѕРІРµСЂРЅСѓС‚РёСЃСЏ', 'back_to_start'),
            ]),
          },
        );
        return;
      }

      const CITIES_PER_PAGE = 5;
      const totalPages = Math.ceil(cities.length / CITIES_PER_PAGE);
      const currentPage = Math.max(0, Math.min(page, totalPages - 1));

      const startIndex = currentPage * CITIES_PER_PAGE;
      const endIndex = startIndex + CITIES_PER_PAGE;
      const citiesOnPage = cities.slice(startIndex, endIndex);

      // РЎС‚РІРѕСЂСЋС”РјРѕ РєРЅРѕРїРєРё РґР»СЏ РјС–СЃС‚
      const cityButtons = citiesOnPage.map((city) =>
        Markup.button.callback(`${city.name}`, `select_city:${city.id}`),
      );

      // Р РѕР·РјС–С‰СѓС”РјРѕ РєРЅРѕРїРєРё РїРѕ РѕРґРЅС–Р№ РІ СЂСЏРґСѓ
      const keyboard = cityButtons.map((button) => [button]);

      // Р”РѕРґР°С”РјРѕ РЅР°РІС–РіР°С†С–Р№РЅС– РєРЅРѕРїРєРё
      const navigationButtons = [];

      if (currentPage > 0) {
        navigationButtons.push(
          Markup.button.callback(
            'в¬…пёЏ РџРѕРїРµСЂРµРґРЅСЏ',
            `city_page:${currentPage - 1}`,
          ),
        );
      }

      if (currentPage < totalPages - 1) {
        navigationButtons.push(
          Markup.button.callback('РќР°СЃС‚СѓРїРЅР° вћЎпёЏ', `city_page:${currentPage + 1}`),
        );
      }

      if (navigationButtons.length > 0) {
        keyboard.push(navigationButtons);
      }

      // Р”РѕРґР°С”РјРѕ РєРЅРѕРїРєСѓ РїРѕРІРµСЂРЅРµРЅРЅСЏ
      keyboard.push([
        Markup.button.callback('рџ”™ РџРѕРІРµСЂРЅСѓС‚РёСЃСЏ', 'back_to_start'),
      ]);

      const text = `рџЏ™пёЏ <b>Р’РёР±РµСЂС–С‚СЊ РІР°С€Рµ РјС–СЃС‚Рѕ:</b>\n\nРЎС‚РѕСЂС–РЅРєР° ${currentPage + 1} Р· ${totalPages}\nР’СЃСЊРѕРіРѕ РјС–СЃС‚: ${cities.length}`;

      await ctx.editMessageText(text, {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(keyboard),
      });
    } catch (error) {
      console.error('Error in showCitySelection:', error);
      await ctx.editMessageText('вќЊ Р’РёРЅРёРєР»Р° РїРѕРјРёР»РєР° РїСЂРё Р·Р°РІР°РЅС‚Р°Р¶РµРЅРЅС– РјС–СЃС‚.', {
        ...Markup.inlineKeyboard([
          Markup.button.callback('рџ”™ РџРѕРІРµСЂРЅСѓС‚РёСЃСЏ', 'back_to_start'),
        ]),
      });
    }
  }

  async assignCityToUser(ctx: Context, cityId: number) {
    try {
      const subscriber = await this.clientService.findOneByTelegramId(
        ctx.from.id,
      );
      if (!subscriber) {
        await ctx.answerCbQuery('вќЊ РљРѕСЂРёСЃС‚СѓРІР°С‡ РЅРµ Р·РЅР°Р№РґРµРЅРёР№');
        return;
      }

      const city = await this.cityService.findOne(cityId);
      if (!city) {
        await ctx.answerCbQuery('вќЊ РњС–СЃС‚Рѕ РЅРµ Р·РЅР°Р№РґРµРЅРѕ');
        return;
      }

      await this.clientService.assignCity(subscriber.id, cityId);

      const successText = `вњ… <b>РњС–СЃС‚Рѕ СѓСЃРїС–С€РЅРѕ РѕР±СЂР°РЅРѕ!</b>\n\nрџЏ™пёЏ Р’Р°С€Рµ РјС–СЃС‚Рѕ: <b>${city.name}</b>`;

      await ctx.editMessageText(successText, {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('рџЏ™пёЏ Р—РјС–РЅРёС‚Рё РјС–СЃС‚Рѕ', 'select_city')],
          [Markup.button.callback('рџЏ  Р“РѕР»РѕРІРЅРµ РјРµРЅСЋ', 'back_to_start')],
        ]),
      });

      // РџРѕРєР°Р·СѓС”РјРѕ РїС–РґС‚РІРµСЂРґР¶РµРЅРЅСЏ
      await ctx.answerCbQuery(`вњ… РњС–СЃС‚Рѕ ${city.name} РѕР±СЂР°РЅРѕ!`);
    } catch (error) {
      console.error('Error in assignCityToUser:', error);
      await ctx.answerCbQuery('вќЊ Р’РёРЅРёРєР»Р° РїРѕРјРёР»РєР° РїСЂРё РІРёР±РѕСЂС– РјС–СЃС‚Р°');

      await ctx.editMessageText(
        'вќЊ Р’РёРЅРёРєР»Р° РїРѕРјРёР»РєР° РїСЂРё РІРёР±РѕСЂС– РјС–СЃС‚Р°. РЎРїСЂРѕР±СѓР№С‚Рµ С‰Рµ СЂР°Р·.',
        {
          ...Markup.inlineKeyboard([
            [Markup.button.callback('рџЏ™пёЏ РЎРїСЂРѕР±СѓРІР°С‚Рё Р·РЅРѕРІСѓ', 'select_city')],
            [Markup.button.callback('рџ”™ РџРѕРІРµСЂРЅСѓС‚РёСЃСЏ', 'back_to_start')],
          ]),
        },
      );
    }
  }
}

