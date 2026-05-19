import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { ClientService } from '../client/client.service';

@Injectable()
export class TelegramUserSyncMiddleware {
  constructor(private readonly clientService: ClientService) {}

  async use(ctx: Context, next: () => Promise<void>) {
    if (ctx.from) {
      try {
        await this.clientService.syncTelegramData(ctx.from);
      } catch (e) {
        console.error('Telegram sync failed', e);
      }
    }

    return next();
  }
}
