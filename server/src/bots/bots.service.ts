import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BotEntity, BotStatus } from './entities/bot.entity';
import { Repository } from 'typeorm';
import { Scenes, session, Telegraf } from 'telegraf';
import { StartHandler } from './handlers/start.handler';
import { VerifyHandler } from './handlers/verify.handler';
import { customNameScene } from './scenes/custom_name.scene';
import { IBotContext } from './context';
import { CustomNameHandler } from './handlers/custom_name.handler';
import {
  MessageEntity,
  MessageType,
} from '../messages/entities/message.entity';
import { ClientEntity } from '../client/entities/client.entity';
import { ClientService } from '../client/client.service';
import { createInlineKeyboard, parseText } from './handlers/lib';
import { PollHandler } from './handlers/poll.handler';
import { AdminHandler } from './handlers/admin.handler';
import { sendMessageScene } from './scenes/send_message.scene';
import { pollScene, pollScene2, pollSceneName } from './scenes/poll.scene';
import { MessageHandler } from './handlers/message.handler';
import axios from 'axios';
import { SendedListEntity } from '../messages/entities/sendedList.entity';
@Injectable()
export class BotsService implements OnModuleInit {
  bot: Telegraf<IBotContext> | null = null;
  bot_id: number;
  constructor(
    @InjectRepository(BotEntity)
    private readonly botRepository: Repository<BotEntity>,
    @InjectRepository(SendedListEntity)
    private readonly sendedListRepository: Repository<SendedListEntity>,
    private readonly startHandler: StartHandler,
    private readonly verifyHandler: VerifyHandler,
    private readonly customNameHandler: CustomNameHandler,
    private readonly clientService: ClientService,
    private readonly pollHandler: PollHandler,
    private readonly adminHandler: AdminHandler,
    private readonly messageHandler: MessageHandler,
  ) {}

  async onModuleInit() {
    await this.initializeBots();
  }
  async initializeBots() {
    const bots = await this.botRepository.find({
      where: { status: BotStatus.ACTIVE },
    });
    bots.forEach((bot) => {
      this.initializeBot(bot);
    });
  }
  async initializeBot(bot: BotEntity) {
    try {
      this.bot = new Telegraf<IBotContext>(bot.token);
      this.bot_id = bot.id;
      const stage = new Scenes.Stage<IBotContext>([
        customNameScene,
        sendMessageScene,
        pollScene,
        pollScene2,
        pollSceneName,
      ]);
      this.bot.use(session());
      this.bot.use(stage.middleware());
      this.startHandler.register(this.bot, bot);
      this.verifyHandler.register(this.bot, bot);
      this.customNameHandler.register(this.bot, bot);
      this.pollHandler.register(this.bot, bot);
      this.adminHandler.register(this.bot, bot);
      this.messageHandler.register(this.bot, bot);
      this.bot.launch();
      console.log(`Bot initialized`);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async createOrUpdate(createBotDto: CreateBotDto, user_id: number) {
    const res = await axios.get(
      `https://api.telegram.org/bot${createBotDto.token}/getMe`,
    );
    if (!res) {
      throw new BadRequestException('Bot token not valid');
    }
    const find = await this.botRepository.findOne({
      where: { user_id: user_id },
    });
    let bot;
    if (!find) {
      bot = await this.botRepository.save({
        ...createBotDto,
        user_id: user_id,
      });
    } else {
      bot = await this.botRepository.update(
        { id: find.id },
        { ...createBotDto },
      );
    }
    await this.initializeBots();
    return bot;
  }

  async findByUser(user_id: number) {
    return await this.botRepository.findOne({ where: { user_id: user_id } });
  }

  async start(user_id: number) {
    const bot = await this.botRepository.findOne({
      where: {
        user_id: user_id,
      },
    });
    if (!bot) {
      throw new BadRequestException('Bot does not exist');
    }
    await this.botRepository.update(
      {
        user_id: user_id,
      },
      {
        status: BotStatus.ACTIVE,
      },
    );
    await this.initializeBot(bot);
    return true;
  }
  async stop(user_id: number) {
    const bot = await this.botRepository.findOne({
      where: {
        user_id: user_id,
      },
    });
    if (!bot) {
      throw new BadRequestException('Bot does not exist');
    }
    this.bot.stop();

    await this.botRepository.update(
      { user_id: user_id },
      { status: BotStatus.INACTIVE },
    );

    return true;
  }

  async restart(user_id: number) {
    try {
      await this.stop(user_id);
      await this.start(user_id);
      return true;
    } catch (e) {
      return false;
    }
  }

  async sendMessage(message: MessageEntity) {
    let users: ClientEntity[] | null = null;
    if (message.type === MessageType.MessageForAll) {
      users = await this.clientService.findAllByStatus('all');
    } else if (message.type === MessageType.MessageForA) {
      users = await this.clientService.findAllByStatus(true);
    } else {
      users = await this.clientService.findAllByStatus(false);
    }
    if (users.length === 0) {
      throw new BadRequestException('Користувачів не знайдено');
    }

    // Define concurrency limit
    const CONCURRENCY_LIMIT = 10;
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const sendMessagesInBatches = async (batch: ClientEntity[]) => {
      return Promise.allSettled(
        batch.map(async (user) => {
          if (!user.is_blocked) {
            const buttons = createInlineKeyboard(message.buttons, message.id);
            try {
              if (message.message_img && message.message_img.endsWith('.gif')) {
                await this.bot.telegram.sendAnimation(
                  user.telegram_id,
                  { url: message.message_img },
                  { caption: parseText(message.message), ...buttons },
                );
              } else if (message.message_img) {
                await this.bot.telegram.sendPhoto(
                  user.telegram_id,
                  { url: message.message_img },
                  { caption: parseText(message.message), ...buttons },
                );
              } else {
                await this.bot.telegram.sendMessage(
                  user.telegram_id,
                  parseText(message.message),
                  { parse_mode: 'HTML', ...buttons },
                );
              }
              await this.sendedListRepository.save({
                client: user,
                message: message,
              });
              if (user.his_block_bot) {
                await this.clientService.userBlockBot(user.id, false);
              }
            } catch (e) {
              if (
                e.response.error_code === 403 ||
                e.response.error_code === '403'
              ) {
                await this.clientService.userBlockBot(user.id, true);
              }
              console.log(`Cant send message for user ${user.telegram_id}:`, e);
            }
            await delay(100);
          }
        }),
      );
    };

    // Process users in batches
    for (let i = 0; i < users.length; i += CONCURRENCY_LIMIT) {
      const batch = users.slice(i, i + CONCURRENCY_LIMIT);
      await sendMessagesInBatches(batch);
    }

    return true;
  }

  async sendMessageForClient(message: string, client_telegram_id: number) {
    try {
      const ctx = await this.bot.telegram.sendMessage(
        client_telegram_id,
        message,
        {
          parse_mode: 'HTML',
        },
      );
      return ctx;
    } catch (e) {
      console.log('Не вдалось відправити повідомлення');
    }
  }
  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
