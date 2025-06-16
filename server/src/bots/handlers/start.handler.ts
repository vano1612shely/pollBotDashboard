import { Injectable } from '@nestjs/common';
import { Context, Markup, Telegraf } from 'telegraf';
import { ClientService } from '../../client/client.service';
import { MessagesService } from '../../messages/messages.service';
import { CityService } from '../../city/city.service';
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
    private readonly cityService: CityService,
  ) {}

  register(telegrafBot: Telegraf<IBotContext>, bot: BotEntity) {
    telegrafBot.start((ctx) => {
      this.execute(ctx, bot);
    });

    // Обробник для кнопки "Вибрати місто"
    telegrafBot.action('select_city', (ctx) => {
      this.showCitySelection(ctx, 0);
    });

    // Обробник пагінації міст
    telegrafBot.action(/city_page:(\d+)/, (ctx) => {
      const page = parseInt(ctx.match[1]);
      this.showCitySelection(ctx, page);
    });

    // Обробник вибору міста
    telegrafBot.action(/select_city:(\d+)/, (ctx) => {
      this.assignCityToUser(ctx, parseInt(ctx.match[1]));
    });

    // Обробник повернення до стартового меню
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
      const originalButtons = createInlineKeyboard(message.buttons, message.id);
      console.log(subscriber);
      const cityButton = Markup.button.callback(
        subscriber.city ? `🏙️ ${subscriber.city.name}` : '🏙️ Вибрати місто',
        'select_city',
      );

      // Створюємо нову клавіатуру з додатковою кнопкою
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
      // Отримуємо активні міста
      const cities = await this.cityService.findAll();

      if (cities.length === 0) {
        await ctx.editMessageText(
          '❌ Наразі немає доступних міст для вибору.',
          {
            ...Markup.inlineKeyboard([
              Markup.button.callback('🔙 Повернутися', 'back_to_start'),
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

      // Створюємо кнопки для міст
      const cityButtons = citiesOnPage.map((city) =>
        Markup.button.callback(`${city.name}`, `select_city:${city.id}`),
      );

      // Розміщуємо кнопки по одній в ряду
      const keyboard = cityButtons.map((button) => [button]);

      // Додаємо навігаційні кнопки
      const navigationButtons = [];

      if (currentPage > 0) {
        navigationButtons.push(
          Markup.button.callback(
            '⬅️ Попередня',
            `city_page:${currentPage - 1}`,
          ),
        );
      }

      if (currentPage < totalPages - 1) {
        navigationButtons.push(
          Markup.button.callback('Наступна ➡️', `city_page:${currentPage + 1}`),
        );
      }

      if (navigationButtons.length > 0) {
        keyboard.push(navigationButtons);
      }

      // Додаємо кнопку повернення
      keyboard.push([
        Markup.button.callback('🔙 Повернутися', 'back_to_start'),
      ]);

      const text = `🏙️ <b>Виберіть ваше місто:</b>\n\nСторінка ${currentPage + 1} з ${totalPages}\nВсього міст: ${cities.length}`;

      await ctx.editMessageText(text, {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(keyboard),
      });
    } catch (error) {
      console.error('Error in showCitySelection:', error);
      await ctx.editMessageText('❌ Виникла помилка при завантаженні міст.', {
        ...Markup.inlineKeyboard([
          Markup.button.callback('🔙 Повернутися', 'back_to_start'),
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
        await ctx.answerCbQuery('❌ Користувач не знайдений');
        return;
      }

      const city = await this.cityService.findOne(cityId);
      if (!city) {
        await ctx.answerCbQuery('❌ Місто не знайдено');
        return;
      }

      await this.clientService.assignCity(subscriber.id, cityId);

      const successText = `✅ <b>Місто успішно обрано!</b>\n\n🏙️ Ваше місто: <b>${city.name}</b>`;

      await ctx.editMessageText(successText, {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('🏙️ Змінити місто', 'select_city')],
          [Markup.button.callback('🏠 Головне меню', 'back_to_start')],
        ]),
      });

      // Показуємо підтвердження
      await ctx.answerCbQuery(`✅ Місто ${city.name} обрано!`);
    } catch (error) {
      console.error('Error in assignCityToUser:', error);
      await ctx.answerCbQuery('❌ Виникла помилка при виборі міста');

      await ctx.editMessageText(
        '❌ Виникла помилка при виборі міста. Спробуйте ще раз.',
        {
          ...Markup.inlineKeyboard([
            [Markup.button.callback('🏙️ Спробувати знову', 'select_city')],
            [Markup.button.callback('🔙 Повернутися', 'back_to_start')],
          ]),
        },
      );
    }
  }
}
