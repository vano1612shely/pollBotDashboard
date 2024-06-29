import { Scenes } from 'telegraf';
import { IBotContext } from '../context';
import { Injectable } from '@nestjs/common';
import { ClientService } from '../../client/client.service';

export const customNameScene = new Scenes.BaseScene<IBotContext>('custom_name');

@Injectable()
export class CustomNameScene {
  constructor(private readonly clientService: ClientService) {
    customNameScene.enter(async (ctx) => {
      await ctx.reply("Введіть кастомне ім'я:");
    });

    customNameScene.on('text', async (ctx) => {
      const name = ctx.message.text;
      if (!name) {
        await ctx.reply("Ім'я не може бути пустим, спробуйте ще раз:");
        return;
      }
      const client = await this.clientService.findOneByTelegramId(
        Number(ctx.session.client_id),
      );
      await this.clientService.setCustomName(client.id, name);
      await ctx.reply("Кастомне ім'я успішно збереженно!");
      await ctx.scene.leave();
    });
  }
}
