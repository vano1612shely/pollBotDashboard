import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { ClientService } from '../client/client.service';

@Injectable()
export class TelegramUserSyncMiddleware {
  constructor(private readonly clientService: ClientService) {}

  async use(ctx: Context, next: () => Promise<void>) {
    if (ctx.from) {
      console.log('before sync');
      await this.clientService.syncTelegramData(ctx.from);
    }
    console.log('after sync');
    return next();
  }
}
