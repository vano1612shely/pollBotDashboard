import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { ClientService } from '../client/client.service';

@Injectable()
export class TelegramBlockedMiddleware {
  constructor(private readonly clientService: ClientService) {}

  async use(ctx: Context, next: () => Promise<void>) {
    if (!ctx.from) {
      return;
    }

    try {
      const client = await this.clientService.findOneByTelegramId(ctx.from.id);
      if (client?.is_blocked) {
        return;
      }
    } catch (e) {
      console.error('Telegram blocked middleware failed', e);

      return;
    }

    return next();
  }
}
