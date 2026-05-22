import { Injectable } from '@nestjs/common';
import { Context, Markup, Telegraf } from 'telegraf';
import { ClientService } from '../../client/client.service';
import { IBotContext } from '../context';

@Injectable()
export class CityInfoHandler {
  constructor(private readonly clientService: ClientService) {}

  register(telegrafBot: Telegraf<IBotContext>) {
    telegrafBot.command('my_city', (ctx) => {
      this.showCurrentCity(ctx);
    });
    telegrafBot.action('my_city', (ctx) => {
      this.showCurrentCity(ctx);
    });
  }

  async showCurrentCity(ctx: Context) {
    try {
      const subscriber = await this.clientService.findByTelegramIdWithCity(
        ctx.from.id,
      );

      if (!subscriber || subscriber.is_blocked) {
        await ctx.reply('❌ Користувач не знайдений');
        return;
      }

      if (!subscriber.city) {
        await ctx.reply('🏙️ У вас ще не обрано місто.', {
          ...Markup.inlineKeyboard([
            [Markup.button.callback('🏙️ Вибрати місто', 'select_city')],
          ]),
        });
        return;
      }

      const city = subscriber.city;
      const text = `🏙️ <b>Ваше поточне місто:</b>\n\n📍 <b>${city.name}</b>\n\n📅 Обрано: ${new Date(subscriber.updated_at).toLocaleDateString('uk-UA')}`;

      await ctx.reply(text, {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('🏙️ Змінити місто', 'select_city')],
          [Markup.button.callback('🔙 Головне меню', 'back_to_start')],
        ]),
      });
    } catch (error) {
      console.error('Error in showCurrentCity:', error);
      await ctx.reply(
        '❌ Виникла помилка при отриманні інформації про ваше місто.',
      );
    }
  }
}
